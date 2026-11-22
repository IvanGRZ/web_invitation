// Convierte tableros del lienzo (.dc.html descargados con la herramienta de Artifacts) en páginas HTML locales
// para compararlas contra la web. Uso:
//   node tools/qa/referencias.mjs <carpeta-con-los-.dc.html>
// Copia también fuentes, foto e ikat desde design/ (privado). Todo queda en tools/qa/.ref/ (ignorado en git).
// Si un tablero usa un asset que no está en BLOBS, descárgalo con la herramienta de Artifacts (read con el id del
// blob) a tools/qa/.ref/ y agrégalo aquí.
// Con ?ajustar en la URL, el tablero se escala completo para caber en la ventana (centrado), como la web hace
// con los tableros más altos que una pantalla (p. ej. CeremoniaC, 390×1056).
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { REF_DIR, RAIZ } from './comun.mjs';

const DESIGN = join(RAIZ, '..', '..', 'design');
const origen = process.argv[2];
if (!origen) throw new Error('Indica la carpeta con los tableros .dc.html');

const BLOBS = {
  '57b5646c748f51762b096e16c8c1d5e0': 'fonts/CormorantGaramond-300.woff2',
  '268826ddad51d8382b7c5479fcaac934': 'fonts/CormorantGaramond-400.woff2',
  '32a60baf8e3e1196d447e543a5ba9ff7': 'fonts/CormorantGaramond-500.woff2',
  '1284b0b768c0fde28d7ee0b2e31dcc7f': 'fonts/CormorantGaramond-400-italic.woff2',
  'f32ddefcb281a0c879870f03d4ca56b5': 'fonts/Jost-400.woff2',
  '79aad3509efb7096b8011aba43f7b86a': 'fonts/Jost-500.woff2',
  '19fa5a3ecadff4f2ac07eeab152a2add': 'fonts/PinyonScript-400.woff2',
  '9f93156140fee16d0466b6841b5fa4ec': 'toledo.jpg',
  'a2c9c3f01a384517b5216a6b7f8a6f22': 'ikat.svg',
  '5ee626b5461a465929b2cb7c7a2672da': 'invitacion-frente.jpg',
  // Los mismos archivos con los ids de la cuenta nueva (lienzo migrado el 22 nov; tableros GaleriaBoda-*).
  'fa96d9f0d6336c77dfd48d66324ce41b': 'fonts/CormorantGaramond-300.woff2',
  'd53fb2e7ebea0555396fb4db3c862456': 'fonts/CormorantGaramond-400.woff2',
  '2d335da60f9f9d1264ba398975154b35': 'fonts/CormorantGaramond-500.woff2',
  'a3af10de4755b5a49bbec9dfaf8deb54': 'fonts/CormorantGaramond-400-italic.woff2',
  '3e0b2df65f23288f37d8606e218198f6': 'fonts/Jost-400.woff2',
  '712143233dccb07ffcf9d3188d505660': 'fonts/Jost-500.woff2',
  'd07397a06234e8f710e7c35be0290f1c': 'fonts/PinyonScript-400.woff2',
  '3347cc8c1e6ef30aca045e42c2a5876c': 'ikat.svg',
  'd5514379fbc5c444ffe625930476ae67': 'toledo.jpg',
};

// Tableros con pasos (estado de su lógica): además del estado inicial se genera una copia por variante,
// <Tablero>-<variante>.html, con ese estado aplicado sobre el del constructor. Los bloques <sc-if> de las
// variantes se resuelven con los valores reales de renderVals(), no con su valor de muestra.
const PASOS_CONFIRMACION = {
  paso2: { step: 1 },
  paso3: { step: 2 },
  gracias: { step: 3 },
  extranaremos: { step: 3, si: false },
};
const VARIANTES = {
  ConfirmacionD2: PASOS_CONFIRMACION,
  ConfirmacionEscritorio: PASOS_CONFIRMACION,
};

const AJUSTAR = `if (/ajustar/.test(location.search)) {
  const t = document.body.firstElementChild;
  const W = t.offsetWidth, H = t.offsetHeight, s = Math.min(innerWidth / W, innerHeight / H);
  document.documentElement.style.background = getComputedStyle(t).backgroundColor;
  document.body.style.cssText = 'margin:0;height:100vh;overflow:hidden';
  t.style.transformOrigin = '0 0';
  t.style.transform = 'translate(' + (innerWidth - W * s) / 2 + 'px,' + (innerHeight - H * s) / 2 + 'px) scale(' + s + ')';
}`;

mkdirSync(join(REF_DIR, 'fonts'), { recursive: true });
for (const f of readdirSync(join(DESIGN, 'fonts')).filter((f) => f.endsWith('.woff2'))) {
  copyFileSync(join(DESIGN, 'fonts', f), join(REF_DIR, 'fonts', f));
}
const copiar = (de, a) => existsSync(de) && copyFileSync(de, join(REF_DIR, a));
copiar(join(DESIGN, 'assets', 'fotos', 'toledo-propuesta.jpg'), 'toledo.jpg');
copiar(join(DESIGN, 'assets', 'ikat-textura-marfil.svg'), 'ikat.svg');
copiar(join(DESIGN, 'assets', 'invitacion-frente.jpg'), 'invitacion-frente.jpg');

/**
 * Tableros con lógica (`renderVals()` en su <script type="text/x-dc">, p. ej. la galería): se ejecuta una vez
 * con su estado inicial y se sustituyen los {{valores}} y los <sc-for>. Queda una foto fija del tablero en su
 * estado inicial (sin interacción), suficiente para comparar. Los tableros sin renderVals no cambian.
 */
function estadoInicial(src, cuerpo, estado) {
  const codigo = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  if (!codigo || !codigo.includes('renderVals')) return cuerpo;
  class DCLogic {
    constructor(props) { this.props = props; this.state = {}; }
    setState() {}
  }
  const Componente = new Function('DCLogic', `${codigo}\nreturn Component;`)(DCLogic);
  const componente = new Componente({});
  if (estado) componente.state = { ...componente.state, ...estado };
  const vals = componente.renderVals();
  const valor = (v) => (typeof v === 'function' || v == null ? '' : String(v));
  if (estado) {
    cuerpo = cuerpo.replace(/<sc-if value="\{\{(\w+)\}\}"[^>]*>([\s\S]*?)<\/sc-if>/g, (m, k, interior) => (k in vals ? (vals[k] ? interior : '') : m));
  }
  return cuerpo
    .replace(/<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (_, lista, alias, interior) =>
      (vals[lista] ?? []).map((item) => interior.replace(new RegExp(`\\{\\{${alias}\\.(\\w+)\\}\\}`, 'g'), (_m, k) => valor(item[k]))).join(''),
    )
    .replace(/ on[A-Z]\w*="\{\{\w+\}\}"/g, '')
    .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vals ? valor(vals[k]) : m));
}

for (const archivo of readdirSync(origen).filter((f) => f.endsWith('.dc.html'))) {
  const src = readFileSync(join(origen, archivo), 'utf8');
  const estilo = src.match(/<helmet>\s*<style>([\s\S]*?)<\/style>\s*<\/helmet>/)?.[1] ?? '';
  const cuerpo = src.match(/<\/helmet>([\s\S]*?)<\/x-dc>/)?.[1] ?? '';
  const nombre = basename(archivo, '.dc.html');
  const salidas = [[nombre, undefined], ...Object.entries(VARIANTES[nombre] ?? {}).map(([v, estado]) => [`${nombre}-${v}`, estado])];
  for (const [destino, estado] of salidas) {
    let html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${archivo}</title><style>${estilo}\nhtml,body{margin:0}</style></head><body>${estadoInicial(src, cuerpo, estado)}<script>${AJUSTAR}</script></body></html>`;
    html = html
      .replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => BLOBS[id] ?? m)
      .replace(/ds\/ivanemma\/fonts\//g, 'fonts/')
      // Bloques condicionales cerrados en el estado inicial del tablero (p. ej. las barras de "Cómo llegar").
      .replace(/<sc-if[^>]*hint-placeholder-val="\{\{ false \}\}"[^>]*>[\s\S]*?<\/sc-if>/g, '')
      .replace(/\{\{d\}\}/g, '91')
      .replace(/\{\{[a-z]\}\}/g, '00');
    const faltan = [...html.matchAll(/\/_blob\/([0-9a-f]{32})/g)].map((m) => m[1]);
    writeFileSync(join(REF_DIR, destino + '.html'), html);
    console.log('ok', destino, faltan.length ? `· faltan blobs: ${[...new Set(faltan)].join(', ')}` : '');
  }
}
