// Compara la web contra los tableros del lienzo, primero con números (barato) y luego con imágenes.
// Uso: node tools/qa/comparar.mjs [filtro]      (p. ej. "bienvenida" o "celular")
// Requiere: astro dev en QA_WEB (4321) y servir-referencias.mjs en QA_REF (4400).
//
// Por cada caso con tablero:
//   1. Cajas: posición y tamaño de cada texto y SVG con nombre, lienzo vs web (deben coincidir al píxel).
//   2. Diferencia píxel a píxel del estado final (media 0–255 y % de píxeles muy distintos) + mapa de calor.
//   3. Imagen lado a lado.
// Imprime una tabla corta; mira las imágenes de tools/qa/salida/ sólo donde los números no cuadran.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { abrirNavegador, contexto, espera, SALIDA, TAMANOS, WEB, REF } from './comun.mjs';
import { CASOS } from './casos.mjs';

const filtro = process.argv[2] || '';
const ESPERA_FINAL_MS = Number(process.env.QA_ESPERA || 7500); // las entradas duran hasta ~6 s

/** Cajas de los textos (hojas) y de los SVG con nombre accesible, indexadas por su texto.
 *  En la web todas las pantallas están en el mismo documento: sólo se mide la que está en vista. */
function cajas() {
  const pantallas = [...document.querySelectorAll('[data-screen]')];
  const raiz = pantallas.length
    ? pantallas.reduce((a, b) => (Math.abs(b.getBoundingClientRect().top) < Math.abs(a.getBoundingClientRect().top) ? b : a))
    : document.body;
  const res = {};
  const poner = (clave, r) => {
    if (!clave || res[clave] || r.width === 0) return;
    res[clave] = [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10);
  };
  for (const el of raiz.querySelectorAll('*')) {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    const propio = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
    if (propio && !/^[\d\s:]+$/.test(propio)) {
      const rg = document.createRange();
      rg.selectNodeContents(el);
      poner(propio, rg.getBoundingClientRect());
    }
    if (el.tagName.toLowerCase() === 'svg' && el.getAttribute('aria-label')) poner('svg:' + el.getAttribute('aria-label'), el.getBoundingClientRect());
  }
  return res;
}

async function capturar(browser, url, t, archivo, accion) {
  const ctx = await contexto(browser, t);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  if (accion) await page.evaluate(accion); // deja la web en el mismo estado que el tablero
  await espera(ESPERA_FINAL_MS);
  await page.screenshot({ path: archivo });
  const c = await page.evaluate(cajas);
  await ctx.close();
  return c;
}

async function diferencia(page, a, b, mapa) {
  const datos = (f) => 'data:image/png;base64,' + readFileSync(f).toString('base64');
  const r = await page.evaluate(
    async ({ a, b }) => {
      const carga = async (s) => { const i = new Image(); i.src = s; await i.decode(); return i; };
      const [ia, ib] = await Promise.all([carga(a), carga(b)]);
      const w = ia.width, h = ia.height;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d');
      g.drawImage(ia, 0, 0); const da = g.getImageData(0, 0, w, h).data;
      g.clearRect(0, 0, w, h); g.drawImage(ib, 0, 0); const db = g.getImageData(0, 0, w, h).data;
      const out = g.createImageData(w, h);
      let suma = 0, muchos = 0;
      for (let i = 0; i < da.length; i += 4) {
        const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3;
        suma += d; if (d > 40) muchos++;
        const gris = (db[i] + db[i + 1] + db[i + 2]) / 9;
        out.data[i] = Math.min(255, gris + d * 4); out.data[i + 1] = gris; out.data[i + 2] = gris; out.data[i + 3] = 255;
      }
      g.putImageData(out, 0, 0);
      return { media: +(suma / (w * h)).toFixed(2), pct: +((muchos / (w * h)) * 100).toFixed(2), png: c.toDataURL('image/png') };
    },
    { a: datos(a), b: datos(b) },
  );
  writeFileSync(mapa, Buffer.from(r.png.split(',')[1], 'base64'));
  return r;
}

async function ladoALado(browser, t, ref, web, archivo, titulo) {
  const datos = (f) => 'data:image/png;base64,' + readFileSync(f).toString('base64');
  const ctx = await browser.newContext({ viewport: { width: t.width * 2 + 72, height: t.height + 64 }, deviceScaleFactor: t.movil ? 2 : 1 });
  const page = await ctx.newPage();
  const fig = (src, txt) => `<figure style="margin:0"><figcaption style="height:28px">${txt}</figcaption><img src="${src}" style="width:${t.width}px;height:${t.height}px;display:block"></figure>`;
  await page.setContent(`<body style="margin:0;background:#2a2f3a;font:600 14px system-ui;color:#e8e2d6;display:flex;gap:24px;padding:12px 24px">${fig(datos(ref), 'Lienzo · ' + titulo)}${fig(datos(web), 'Web')}</body>`);
  await page.screenshot({ path: archivo });
  await ctx.close();
}

const browser = await abrirNavegador();
const herramienta = await (await browser.newContext()).newPage();
const filas = [];
for (const caso of CASOS.filter((c) => c.nombre.includes(filtro))) {
  const t = TAMANOS[caso.tamano];
  const web = join(SALIDA, `${caso.nombre}-web.png`);
  const cajasWeb = await capturar(browser, WEB + caso.ruta, t, web, caso.accion);
  if (!caso.tablero) {
    filas.push({ caso: caso.nombre, cajas: '—', difMedia: '—', pctDistintos: '—', notas: 'sin tablero: revisar captura' });
    continue;
  }
  const ref = join(SALIDA, `${caso.nombre}-lienzo.png`);
  const cajasRef = await capturar(browser, `${REF}/${caso.tablero}.html${caso.ajustar ? '?ajustar' : ''}`, t, ref);
  const distintas = [];
  for (const [clave, r] of Object.entries(cajasRef)) {
    const w = cajasWeb[clave];
    if (!w) { distintas.push(`falta "${clave.slice(0, 30)}"`); continue; }
    const delta = Math.max(...r.map((v, i) => Math.abs(v - w[i])));
    if (delta > 1) distintas.push(`"${clave.slice(0, 30)}" Δ${delta.toFixed(1)}px (lienzo ${r.join(',')} · web ${w.join(',')})`);
  }
  const d = await diferencia(herramienta, ref, web, join(SALIDA, `${caso.nombre}-mapa.png`));
  await ladoALado(browser, t, ref, web, join(SALIDA, `${caso.nombre}-comparacion.png`), caso.tablero);
  filas.push({ caso: caso.nombre, cajas: distintas.length ? `${distintas.length} distintas` : `${Object.keys(cajasRef).length} OK`, difMedia: d.media, pctDistintos: d.pct, notas: distintas.join(' | ') });
}
await browser.close();
console.table(filas);
console.log(`Imágenes en ${SALIDA}`);
