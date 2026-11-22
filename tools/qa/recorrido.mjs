// Prueba el recorrido completo: abre la ruta base, baja pantalla por pantalla con la rueda y regresa con "Atrás",
// revisando dirección, título y posición en cada paso. Uso:
//   node tools/qa/recorrido.mjs [celular|computadora|…] [--capturas]
// Con --capturas guarda la transición (a 220 ms) y el estado final de cada paso en tools/qa/salida/.
import { join } from 'node:path';
import { abrirNavegador, contexto, espera, SALIDA, TAMANOS, WEB } from './comun.mjs';

const tamanos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const capturas = process.argv.includes('--capturas');
const browser = await abrirNavegador();
const filas = [];

for (const nombre of tamanos.length ? tamanos : ['celular', 'computadora']) {
  const t = TAMANOS[nombre];
  const ctx = await contexto(browser, t);
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  await page.goto(WEB + '/', { waitUntil: 'networkidle' });
  await espera(1000);
  const estado = () => page.evaluate(() => {
    const r = document.querySelector('[data-recorrido]');
    return { ruta: location.pathname, titulo: document.title, pantalla: Math.round(r.scrollTop / r.clientHeight) };
  });
  const total = await page.evaluate(() => document.querySelectorAll('[data-screen]').length);
  filas.push({ tamano: nombre, paso: 'abrir /', ...(await estado()) });
  await page.mouse.move(t.width / 2, t.height / 2);
  for (let i = 1; i < total; i++) {
    await page.mouse.wheel(0, 120);
    await espera(220);
    if (capturas) await page.screenshot({ path: join(SALIDA, `${nombre}-ida-${i}-transicion.png`) });
    await espera(1500);
    if (capturas) await page.screenshot({ path: join(SALIDA, `${nombre}-ida-${i}.png`) });
    filas.push({ tamano: nombre, paso: `rueda ↓ ${i}`, ...(await estado()) });
  }
  for (let i = total - 1; i > 0; i--) {
    await page.goBack();
    await espera(220);
    if (capturas) await page.screenshot({ path: join(SALIDA, `${nombre}-regreso-${i}-transicion.png`) });
    await espera(1500);
    filas.push({ tamano: nombre, paso: `atrás ${i}`, ...(await estado()) });
  }
  if (errores.length) filas.push({ tamano: nombre, paso: 'ERRORES', ruta: errores.join(' | ') });
  await ctx.close();
}
await browser.close();
console.table(filas);
