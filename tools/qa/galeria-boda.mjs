// Pruebas de comportamiento de la galería de la boda (docs/pantallas.md § 6.9) contra las páginas de muestra de dev:
// subida (con un servidor simulado), archivos rechazados, falla al guardar y "Reintentar", sin señal y regreso de
// la conexión, arrastrar y soltar, gestos y teclado de las historias, dónde se quedó, ventana de barras, sin JS,
// movimiento reducido, objetivos táctiles y las rutas reales.
// Uso: node tools/qa/galeria-boda.mjs (con astro dev en QA_WEB). Capturas en tools/qa/salida/.
import { join } from 'node:path';
import { abrirNavegador, contexto, espera, SALIDA, TAMANOS, WEB } from './comun.mjs';

const browser = await abrirNavegador();
const filas = [];
const ok = (prueba, cond, detalle = '') => filas.push({ prueba, ok: cond ? 'sí' : 'NO', detalle: String(detalle).slice(0, 120) });
const hidratada = (page) => page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
const errores = [];
const nueva = async (t, extra) => {
  const ctx = await contexto(browser, TAMANOS[t], extra);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errores.push(String(e)));
  // Sin señal a propósito (prueba 3), el cliente de Vite no alcanza al servidor: no cuenta.
  page.on('console', (m) => m.type() === 'error' && !/INTERNET_DISCONNECTED/.test(m.text()) && errores.push(`${page.url()} ${m.text()}`));
  page.on('response', (r) => r.status() >= 400 && errores.push(`${r.status()} ${r.url()}`));
  return { ctx, page };
};

// Una foto de verdad (PNG de 1×1) que el navegador puede abrir y comprimir.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const foto = (nombre) => ({ name: nombre, mimeType: 'image/png', buffer: PNG });
const estado = (page) => page.locator('.galeria-boda__estado').textContent().catch(() => null);
const cifra = (page) => page.locator('.galeria-boda__cifra').textContent();
const hasta = (page, fn, arg, ms = 15000) => page.waitForFunction(fn, arg, { timeout: ms });
const textoEstado = (t) => (e) => document.querySelector('.galeria-boda__estado')?.textContent === e;

// 1. Subida: dos fotos y un video → "2 de 3 compartidas" con el video rechazado; luego dos más → éxito.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/simulada/galeria-de-la-boda', { waitUntil: 'networkidle' });
  await hidratada(page);
  await page.setInputFiles('#galeria-boda-archivos', [foto('a.png'), foto('b.png'), { name: 'IMG_1.MOV', mimeType: 'video/quicktime', buffer: Buffer.from('x') }]);
  await hasta(page, () => /^Subiendo/.test(document.querySelector('.galeria-boda__estado')?.textContent ?? ''));
  ok('al elegir: "Subiendo k de 3"', /^Subiendo [12] de 3$/.test(await estado(page)), await estado(page));
  await hasta(page, textoEstado(), '2 de 3 compartidas');
  ok('termina con el rechazo: "2 de 3 compartidas"', true);
  const aviso = await page.locator('.galeria-boda__aviso').getAttribute('role');
  const lista = await page.locator('.galeria-boda__rechazo').allTextContents();
  ok('aviso de rechazo es alert y nombra el archivo', aviso === 'alert' && lista.join('|').includes('IMG_1.MOVes un video'), `${aviso} ${lista}`);
  ok('cuenta 128 → 130', (await cifra(page)) === '130', await cifra(page));
  await page.setInputFiles('#galeria-boda-archivos', [foto('c.png'), foto('d.png')]);
  await hasta(page, textoEstado(), '2 fotos compartidas');
  const palomitas = await page.locator('.galeria-boda__tira--aviso .galeria-boda__mini-sello').count();
  ok('éxito: "2 fotos compartidas", palomita en las 2 nuevas', palomitas === 2, palomitas);
  ok('éxito: "Compartir más fotos" y "Verlas ahora"', (await page.locator('.galeria-boda__obturador-texto').textContent()) === 'Compartirmás fotos' && (await page.getByRole('link', { name: 'Verlas ahora' }).count()) === 1);
  const miniatura = await page.locator('.galeria-boda__tira--aviso img').first().getAttribute('src');
  ok('la miniatura nueva es la comprimida (blob:)', miniatura?.startsWith('blob:'), miniatura);
  await page.screenshot({ path: join(SALIDA, 'galeria-boda-flujo-listo.png') });
  // archivo de más de 25 MB
  await page.setInputFiles('#galeria-boda-archivos', [{ name: 'GRANDE.JPG', mimeType: 'image/jpeg', buffer: Buffer.alloc(26 * 1024 * 1024) }]);
  await hasta(page, textoEstado(), '0 de 1 compartidas');
  ok('más de 25 MB: "pesa más de 25 MB"', (await page.locator('.galeria-boda__rechazo-razon').textContent()) === 'pesa más de 25 MB');
  await ctx.close();
}

// 2. Falla al guardar y "Reintentar".
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/simulada-falla/galeria-de-la-boda', { waitUntil: 'networkidle' });
  await hidratada(page);
  await page.setInputFiles('#galeria-boda-archivos', [foto('a.png'), foto('b.png')]);
  await hasta(page, textoEstado(), '1 de 2 compartida');
  const titulo = await page.locator('.galeria-boda__aviso-titulo').textContent();
  ok('falla: "Una foto no se pudo guardar" (alert)', titulo === 'Una foto no se pudo guardar' && (await page.locator('.galeria-boda__aviso').getAttribute('role')) === 'alert', titulo);
  ok('falla: la miniatura de la foto con "!"', (await page.locator('.galeria-boda__mini--fallida img').count()) === 1);
  await page.getByRole('button', { name: 'Reintentar' }).click();
  await hasta(page, textoEstado(), '2 fotos compartidas');
  ok('"Reintentar" la vuelve a subir: "2 fotos compartidas"', true);
  await ctx.close();
}

// 3. Sin señal: la foto espera y se sube sola al volver la conexión.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/simulada/galeria-de-la-boda', { waitUntil: 'networkidle' });
  await hidratada(page);
  await ctx.setOffline(true);
  await page.setInputFiles('#galeria-boda-archivos', [foto('a.png')]);
  await hasta(page, textoEstado(), 'En pausa · 0 de 1');
  ok('sin señal: "En pausa · 0 de 1" y "Sin señal por ahora"', (await page.locator('.galeria-boda__aviso-titulo').textContent()) === 'Sin señal por ahora');
  await page.screenshot({ path: join(SALIDA, 'galeria-boda-flujo-sinsenal.png') });
  await page.getByRole('button', { name: 'Reintentar ahora' }).click();
  await espera(300);
  ok('"Reintentar ahora" sin señal: sigue en pausa', (await estado(page)) === 'En pausa · 0 de 1', await estado(page));
  await ctx.setOffline(false);
  await hasta(page, textoEstado(), '1 foto compartida');
  ok('al volver la conexión se sube sola: "1 foto compartida"', true);
  await ctx.close();
}

// 4. Computadora: arrastrar y soltar sobre el círculo.
{
  const { ctx, page } = await nueva('computadora');
  await page.goto(WEB + '/prueba/simulada/galeria-de-la-boda', { waitUntil: 'networkidle' });
  await hidratada(page);
  const dt = await page.evaluateHandle((b64) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const d = new DataTransfer();
    d.items.add(new File([bytes], 'soltada.png', { type: 'image/png' }));
    return d;
  }, PNG.toString('base64'));
  await page.dispatchEvent('.galeria-boda__obturador', 'dragover', { dataTransfer: dt });
  await page.dispatchEvent('.galeria-boda__obturador', 'drop', { dataTransfer: dt });
  await hasta(page, textoEstado(), '1 foto compartida');
  ok('computadora: soltar una foto en el círculo la sube', true);
  ok('computadora: "o arrástralas aquí" visible', await page.getByText('o arrástralas aquí').isVisible());
  await ctx.close();
}

// 5. Historias en celular: toques, presión larga, avance solo, vuelta, dónde se quedó.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/historias/galeria-de-la-boda/historias', { waitUntil: 'networkidle' });
  await hidratada(page);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await hidratada(page);
  const actual = () => page.locator('.historias__quien.is-on').textContent();
  ok('empieza en la primera', (await actual()) === 'Familia García18:42 hrs', await actual());
  await page.mouse.click(300, 450);
  await espera(100);
  ok('toque a la derecha avanza', (await actual()) === 'Familia Munguía Ruiz21:07 hrs', await actual());
  await page.mouse.click(60, 450);
  await espera(100);
  ok('toque en el tercio izquierdo regresa', (await actual()) === 'Familia García18:42 hrs', await actual());
  await page.mouse.click(60, 450);
  await espera(100);
  ok('en la primera, regresar la vuelve a empezar', (await actual()) === 'Familia García18:42 hrs');
  const ancho = () => page.locator('.historias__barra.is-now-a i, .historias__barra.is-now-b i').evaluate((i) => i.getBoundingClientRect().width);
  await page.mouse.move(300, 450);
  await page.mouse.down();
  await espera(600);
  const a1 = await ancho();
  await espera(600);
  const a2 = await ancho();
  ok('mantener presionado pausa (la barra no avanza)', Math.abs(a2 - a1) < 0.5 && (await page.locator('.historias.is-paused').count()) === 1, `${a1} → ${a2}`);
  await page.mouse.up();
  await espera(150);
  ok('al soltar sigue sin brincarse', (await actual()) === 'Familia García18:42 hrs' && (await page.locator('.historias.is-paused').count()) === 0);
  await espera(5200);
  ok('pasa sola a los 5 s', (await actual()) === 'Familia Munguía Ruiz21:07 hrs', await actual());
  for (let k = 0; k < 5; k++) {
    await page.mouse.click(300, 450);
    await espera(60);
  }
  ok('después de la última, vuelve a la primera', (await actual()) === 'Familia García18:42 hrs', await actual());
  await page.mouse.click(300, 450);
  await page.mouse.click(300, 450);
  await espera(100);
  await page.reload({ waitUntil: 'networkidle' });
  await hidratada(page);
  await espera(200);
  ok('al volver, empieza donde se quedó', (await actual()) === 'Tía Lupita21:43 hrs', await actual());
  const menu = await page.locator('.historias__toque').evaluate((el) => {
    const e = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    el.dispatchEvent(e);
    return e.defaultPrevented && getComputedStyle(el).touchAction === 'none' && getComputedStyle(el.closest('.historias')).userSelect === 'none';
  });
  ok('sin menú de pulsación larga, touch-action none, sin selección', menu);
  await page.getByRole('link', { name: 'Volver' }).click();
  await page.waitForURL(/\/galeria-de-la-boda$/);
  ok('"Volver" regresa a subir fotos', true, page.url());
  await ctx.close();
}

// 6. Historias en computadora: flechas, pausa y teclado.
{
  const { ctx, page } = await nueva('computadora');
  await page.goto(WEB + '/prueba/historias/galeria-de-la-boda/historias', { waitUntil: 'networkidle' });
  await hidratada(page);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await hidratada(page);
  const actual = () => page.locator('.historias__quien.is-on .historias__familia').textContent();
  await page.getByRole('button', { name: 'Foto siguiente' }).click();
  ok('flecha siguiente', (await actual()) === 'Familia Munguía Ruiz', await actual());
  await page.getByRole('button', { name: 'Foto anterior' }).click();
  ok('flecha anterior', (await actual()) === 'Familia García', await actual());
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  ok('botón de pausa: cambia a "Reanudar" y pausa', (await page.getByRole('button', { name: 'Reanudar', exact: true }).count()) === 1 && (await page.locator('.historias.is-paused').count()) === 1);
  await espera(5500);
  ok('en pausa no avanza', (await actual()) === 'Familia García', await actual());
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await page.locator('body').focus();
  await page.keyboard.press('ArrowRight');
  ok('teclado: flecha derecha', (await actual()) === 'Familia Munguía Ruiz', await actual());
  await page.keyboard.press('ArrowLeft');
  ok('teclado: flecha izquierda', (await actual()) === 'Familia García', await actual());
  await page.locator('.historias__toque').focus();
  await page.keyboard.press(' ');
  ok('teclado: barra espaciadora pausa', (await page.getByRole('button', { name: 'Reanudar', exact: true }).count()) === 1);
  await page.keyboard.press(' ');
  ok('teclado: barra espaciadora reanuda', (await page.getByRole('button', { name: 'Pausar', exact: true }).count()) === 1);
  const fondo = await page.locator('.historias__fondo .historias__foto.is-on .historias__desenfoque').evaluate((e) => getComputedStyle(e).filter);
  ok('fondo: la misma foto muy desenfocada', /blur\(60px\) brightness\(0\.32\)/.test(fondo), fondo);
  const completa = await page.locator('.historias__fotos .historias__foto.is-on .historias__completa').evaluate((e) => getComputedStyle(e).objectFit);
  ok('la foto nunca se recorta (contain)', completa === 'contain', completa);
  await ctx.close();
}

// 7. Muchas fotos: ventana de 30 barras que se recorre con la actual.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/muchas/galeria-de-la-boda/historias', { waitUntil: 'networkidle' });
  await hidratada(page);
  ok('40 fotos: 30 barras', (await page.locator('.historias__barra').count()) === 30);
  ok('sólo se montan 3 fotos (anterior, actual, siguiente)', (await page.locator('.historias__fotos .historias__foto').count()) === 3);
  for (let k = 0; k < 20; k++) await page.mouse.click(300, 450);
  await espera(100);
  const hechas = await page.locator('.historias__barra.is-done').count();
  ok('en la foto 21, la ventana se recorre (15 hechas a la izquierda)', hechas === 15, hechas);
  await ctx.close();
}

// 8. Sin JavaScript.
{
  const { ctx, page } = await nueva('celular', { javaScriptEnabled: false });
  await page.goto(WEB + '/prueba/reposo/galeria-de-la-boda', { waitUntil: 'networkidle' });
  await espera(4500);
  ok('sin JS: el contenido queda visible', (await page.locator('.galeria-boda__cifra').evaluate((e) => getComputedStyle(e).opacity)) === '1');
  ok('sin JS: el círculo es la etiqueta del selector', (await page.locator('label[for="galeria-boda-archivos"]').count()) === 1 && (await page.locator('#galeria-boda-archivos').getAttribute('type')) === 'file');
  ok('sin JS: aparece el botón para enviar las fotos', await page.getByRole('button', { name: 'Compartir las fotos elegidas' }).isVisible());
  await page.screenshot({ path: join(SALIDA, 'galeria-boda-sinjs-subir.png') });
  await page.goto(WEB + '/prueba/antes/galeria-de-la-boda', { waitUntil: 'networkidle' });
  ok('sin JS: el rollo dice cuánto falta (servidor)', /^Faltan? /.test(await page.locator('.galeria-boda__faltan').textContent()));
  await page.goto(WEB + '/prueba/historias/galeria-de-la-boda/historias', { waitUntil: 'networkidle' });
  await espera(1000);
  ok('sin JS: las historias muestran la primera foto y su pie', (await page.locator('.historias__quien.is-on').textContent()) === 'Familia García18:42 hrs' && (await page.locator('.historias__fotos .is-on .historias__completa').count()) === 1);
  await page.screenshot({ path: join(SALIDA, 'galeria-boda-sinjs-historias.png') });
  await ctx.close();
}

// 9. Movimiento reducido.
{
  const { ctx, page } = await nueva('celular', { reducedMotion: 'reduce' });
  await page.goto(WEB + '/prueba/listo/galeria-de-la-boda', { waitUntil: 'networkidle' });
  await espera(150);
  const quieto = await page.evaluate(() => {
    const op = [...document.querySelectorAll('[data-a]')].map((e) => getComputedStyle(e).opacity);
    const anims = document.getAnimations().map((a) => a.animationName ?? '').filter(Boolean);
    return { visibles: op.every((o) => o === '1'), anims };
  });
  ok('reducido: todo visible al instante', quieto.visibles);
  ok('reducido: sin animaciones en subir', quieto.anims.length === 0, quieto.anims.join(','));
  await page.goto(WEB + '/prueba/antes/galeria-de-la-boda', { waitUntil: 'networkidle' });
  const rollo = await page.evaluate(() => ({
    anims: document.getAnimations().map((a) => a.animationName).filter(Boolean),
    trazo: getComputedStyle(document.querySelector('[data-trazo]')).strokeDashoffset,
  }));
  ok('reducido: el rollo dibujado y quieto', rollo.anims.length === 0 && rollo.trazo === '0px', `${rollo.anims} ${rollo.trazo}`);
  await page.goto(WEB + '/prueba/historias/galeria-de-la-boda/historias', { waitUntil: 'networkidle' });
  const hist = await page.evaluate(() => document.getAnimations().map((a) => a.animationName).filter(Boolean));
  ok('reducido: en las historias sólo corre la barra de avance (marca el tiempo)', hist.every((n) => /^historias-avance/.test(n)), hist.join(','));
  await ctx.close();
}

// 10. Objetivos táctiles de 44 px en iPhone SE (el lienzo los dibuja de 40).
{
  const { ctx, page } = await nueva('iphoneSE');
  await page.goto(WEB + '/prueba/sinsenal/galeria-de-la-boda', { waitUntil: 'networkidle' });
  await espera(4000);
  const toques = await page.evaluate(() =>
    ['.galeria-boda__volver', '.galeria-boda__reintentar'].map((sel) => {
      const el = document.querySelector(sel);
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const alcanza = (dy) => el.contains(document.elementFromPoint(x, y + dy));
      return `${sel}:${alcanza(-21.5) && alcanza(21.5)}`;
    }),
  );
  ok('iPhone SE: "Volver" y "Reintentar ahora" responden en 44 px', toques.every((t) => t.endsWith('true')), toques.join(' '));
  const piso = await page.locator('.galeria-boda__aviso-texto').evaluate((e) => getComputedStyle(e).fontSize);
  ok('iPhone SE: el texto del aviso no baja de 17 px', piso === '17px', piso);
  const encimados = await page.evaluate(() => {
    const a = document.querySelector('.galeria-boda__aviso-pie').getBoundingClientRect();
    const b = document.querySelector('.galeria-boda__como').getBoundingClientRect();
    return a.bottom > b.top;
  });
  ok('iPhone SE: el aviso no alcanza al pie', !encimados);
  await ctx.close();
}

// 11. Rutas reales y el botón de la galería.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/galeria', { waitUntil: 'networkidle' });
  const href = await page.locator('.galeria__boton').getAttribute('href');
  ok('"Compartir mis fotos" de la galería lleva a /galeria-de-la-boda', href === '/galeria-de-la-boda', href);
  const r = await page.goto(WEB + '/galeria-de-la-boda', { waitUntil: 'networkidle' });
  ok('/galeria-de-la-boda hoy: el rollo sin revelar, sin caché', (await page.locator('h1').textContent()).includes('Este rollo se revela') && /no-store/.test(r.headers()['cache-control'] ?? ''), r.headers()['cache-control']);
  ok('título de la pestaña', (await page.title()) === 'Galería de la boda · Ivan & Emma', await page.title());
  await page.goto(WEB + '/galeria-de-la-boda/historias', { waitUntil: 'networkidle' });
  ok('/galeria-de-la-boda/historias sin fotos lleva a subir', new URL(page.url()).pathname === '/galeria-de-la-boda', page.url());
  await ctx.close();
}

ok('sin errores en consola', errores.length === 0, errores.join(' | '));
await browser.close();
console.table(filas);
