// Pruebas de comportamiento de la confirmación (docs/pantallas.md § 6.7) contra las páginas de muestra de dev:
// sillas en orden y cascada, teclado, foco, error al guardar, candado, objetivos táctiles en iPhone SE, sin JS,
// movimiento reducido y la navegación sello del cierre → /confirmar → "Volver a la invitación".
// Uso: node tools/qa/confirmacion.mjs (con astro dev en QA_WEB). Capturas en tools/qa/salida/.
import { join } from 'node:path';
import { abrirNavegador, contexto, espera, SALIDA, TAMANOS, WEB } from './comun.mjs';

const browser = await abrirNavegador();
const filas = [];
const ok = (prueba, cond, detalle = '') => filas.push({ prueba, ok: cond ? 'sí' : 'NO', detalle: String(detalle).slice(0, 140) });
const hidratada = (page) => page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
const errores = [];
const nueva = async (t, extra) => {
  const ctx = await contexto(browser, TAMANOS[t], extra);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  return { ctx, page };
};
const boton = (page, texto) => page.locator(':is(.confirmacion__isla, .screen) :is(button, a):visible').filter({ hasText: new RegExp(`^\\s*${texto}\\s*$`) }).first();

// 1. Sillas en orden, cascada, contador, Continuar apagado, teclado.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/pasos/confirmar', { waitUntil: 'networkidle' });
  await hidratada(page);
  await boton(page, 'Sí, con mucho gusto').click();
  await espera(300);
  const ocupadas = () => page.$$eval('.confirmacion__silla', (s) => s.map((b) => b.getAttribute('aria-pressed')).join(''));
  ok('al entrar, todas ocupadas', (await ocupadas()) === 'truetruetruetrue', await ocupadas());
  await page.getByRole('button', { name: 'Lugar 2' }).click();
  ok('tocar ocupada libera ella y las siguientes', (await ocupadas()) === 'truefalsefalsefalse', await ocupadas());
  const dl = await page.$$eval('.confirmacion__silla', (s) => s.map((b) => b.style.getPropertyValue('--dl')).join(' '));
  ok('cascada al vaciar (desde la última)', dl === '0.00s 0.14s 0.07s 0.00s', dl);
  await page.getByRole('button', { name: 'Lugar 4' }).click();
  ok('tocar vacía ocupa hasta ella', (await ocupadas()) === 'truetruetruetrue', await ocupadas());
  const dl2 = await page.$$eval('.confirmacion__silla', (s) => s.map((b) => b.style.getPropertyValue('--dl')).join(' '));
  ok('cascada al llenar (izq → der)', dl2 === '0.00s 0.00s 0.07s 0.14s', dl2);
  await page.getByRole('button', { name: 'Lugar 1' }).click();
  ok('vaciar todas', (await ocupadas()) === 'falsefalsefalsefalse', await ocupadas());
  ok('Continuar apagado sin sillas', await page.getByRole('button', { name: 'Continuar' }).isDisabled());
  await page.getByRole('button', { name: 'Lugar 1' }).click();
  ok('con todas vacías, la primera ocupa sólo la primera', (await ocupadas()) === 'truefalsefalsefalse', await ocupadas());
  const cuenta = await page.$eval('.confirmacion__cuenta', (c) => c.getAttribute('aria-live') + ' ' + c.textContent);
  ok('contador aria-live', cuenta.startsWith('polite') && cuenta.includes('1'), cuenta);
  // teclado
  await page.getByRole('button', { name: 'Lugar 3' }).focus();
  await page.keyboard.press('Enter');
  ok('teclado: Enter en Lugar 3', (await ocupadas()) === 'truetruetruefalse', await ocupadas());
  await page.keyboard.press('Space');
  ok('teclado: Espacio en Lugar 3 lo libera', (await ocupadas()) === 'truetruefalsefalse', await ocupadas());
  const foco = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  ok('foco se queda en la silla', foco === 'Lugar 3', foco);
  // tamaños de pase y objetivos táctiles
  await page.getByRole('button', { name: 'Continuar' }).click();
  await espera(200);
  const titulo = await page.evaluate(() => document.activeElement?.textContent);
  ok('al cambiar de paso el foco va a la pregunta', titulo === 'Un mensaje para nosotros', titulo);
  await page.locator('.confirmacion__isla textarea').fill('Hola');
  await page.getByRole('button', { name: 'Atrás' }).click();
  await espera(100);
  ok('Atrás desde el mensaje → sillas, conserva', (await ocupadas()) === 'truetruefalsefalse', await ocupadas());
  await page.getByRole('button', { name: 'Continuar' }).click();
  ok('mensaje conservado', (await page.locator('.confirmacion__isla textarea').inputValue()) === 'Hola');
  await page.getByRole('button', { name: 'Confirmar asistencia' }).click();
  await espera(900);
  ok('gracias', (await page.locator('h1').textContent()) === 'gracias');
  ok('resumen 2 de 4', (await page.locator('.confirmacion__resumen').textContent()).includes('2 de 4 lugares confirmados'));
  await boton(page, 'Cambiar mi respuesta').click();
  await espera(100);
  ok('Cambiar mi respuesta → paso 1', (await page.locator('h1').textContent()) === '¿Nos acompañarán?');
  await boton(page, 'No podremos asistir').click();
  await espera(100);
  ok('No → salta al mensaje', (await page.locator('h1').textContent()) === 'Un mensaje para nosotros');
  await page.getByRole('button', { name: 'Atrás' }).click();
  await espera(100);
  ok('Atrás desde el mensaje (no) → paso 1', (await page.locator('h1').textContent()) === '¿Nos acompañarán?');
  const hidden = await page.$eval('.confirmacion__isla input[name=guests]', (i) => i.value);
  ok('datos: guests = 0 si no asisten', hidden === '0', hidden);
  await ctx.close();
}

// 2. Error al guardar: mensaje intacto, aviso, "Intentar de nuevo", luego funciona.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/falla/confirmar', { waitUntil: 'networkidle' });
  await hidratada(page);
  await boton(page, 'No podremos asistir').click();
  await page.locator('.confirmacion__isla textarea').fill('Un abrazo');
  await page.getByRole('button', { name: 'Confirmar asistencia' }).click();
  await espera(800);
  ok('error: aviso role=alert', await page.locator('[role=alert]').isVisible());
  ok('error: botón Intentar de nuevo', await page.getByRole('button', { name: 'Intentar de nuevo' }).isVisible());
  ok('error: mensaje intacto', (await page.locator('.confirmacion__isla textarea').inputValue()) === 'Un abrazo');
  await page.getByRole('button', { name: 'Intentar de nuevo' }).click();
  await espera(800);
  ok('reintento → los extrañaremos', (await page.locator('h1').textContent()) === 'los extrañaremos');
  await ctx.close();
}

// 3. Candado: pegar con guion, habilitar, código inválido, código válido.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/prueba/candado/confirmar', { waitUntil: 'networkidle' });
  await hidratada(page);
  const entrar = page.getByRole('button', { name: 'Entrar a mi invitación' });
  ok('candado: Entrar apagado', await entrar.isDisabled());
  await page.locator('.confirmacion__isla input[name=codigo]').fill('k7n2-pq9x');
  const casillas = await page.$$eval('.confirmacion__casilla', (c) => c.map((x) => x.textContent).join(''));
  ok('candado: pegar con guion y minúsculas', casillas === 'K7N2PQ9X', casillas);
  ok('candado: Entrar encendido', await entrar.isEnabled());
  await page.keyboard.press('Enter');
  await espera(200);
  ok('candado: inválido con role=alert', await page.locator('[role=alert]').isVisible());
  ok('candado: casillas en rojo', await page.locator('.confirmacion__codigo.is-bad').count());
  await page.locator('.confirmacion__isla input[name=codigo]').press('Backspace');
  ok('candado: borrar quita el error', !(await page.locator('[role=alert]').count()));
  await page.locator('.confirmacion__isla input[name=codigo]').fill('K7M2PQ9X');
  await entrar.click();
  await page.waitForURL('**/prueba/pasos/confirmar', { timeout: 5000 }).catch(() => {});
  ok('candado: válido lleva a la confirmación', page.url().endsWith('/prueba/pasos/confirmar'), page.url());
  const attrs = await page.goto(WEB + '/confirmar').then(() => page.$eval('.confirmacion__isla input[name=codigo]', (i) => [i.inputMode, i.getAttribute('autocapitalize'), i.autocomplete, i.maxLength].join(' ')));
  ok('candado: atributos del input', attrs === 'text characters off 9', attrs);
  await ctx.close();
}

// 4. Objetivos táctiles ≥ 44 en iPhone SE y pase de 6.
{
  const { ctx, page } = await nueva('iphoneSE');
  await page.goto(WEB + '/prueba/pasos-6/confirmar', { waitUntil: 'networkidle' });
  await hidratada(page);
  await boton(page, 'Sí, con mucho gusto').click();
  await espera(1500);
  const chicos = await page.$$eval('button, a, input, textarea', (els) =>
    els.filter((e) => e.offsetParent).map((e) => { const r = e.getBoundingClientRect(); return [e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20), Math.round(r.width), Math.round(r.height)]; }).filter(([, w, h]) => w < 44 || h < 44),
  );
  ok('SE: objetivos ≥ 44 px (pase de 6)', chicos.length === 0, JSON.stringify(chicos));
  const desborde = await page.evaluate(() => [...document.querySelectorAll('.confirmacion__silla')].map((s) => s.getBoundingClientRect()).some((r) => r.left < 0 || r.right > innerWidth));
  ok('SE: 6 sillas en una fila sin salirse', !desborde);
  const fila = await page.$$eval('.confirmacion__silla', (s) => new Set(s.map((x) => Math.round(x.getBoundingClientRect().top))).size);
  ok('SE: una sola fila', fila === 1, fila);
  await page.screenshot({ path: join(SALIDA, 'confirmacion-se-6.png') });
  await ctx.close();
}

// 5. Sin JavaScript.
for (const ruta of ['/confirmar', '/prueba/pasos/confirmar', '/prueba/cerrada/confirmar']) {
  const { ctx, page } = await nueva('celular', { javaScriptEnabled: false });
  await page.goto(WEB + ruta, { waitUntil: 'load' });
  await espera(1500);
  const vis = await page.evaluate(() => ({
    isla: !!document.querySelector('.confirmacion__isla')?.offsetParent,
    sinjs: !!document.querySelector('.confirmacion__sinjs')?.offsetParent,
    form: [...document.querySelectorAll('form')].filter((f) => f.offsetParent).map((f) => f.method + ':' + [...f.elements].map((e) => e.name).filter(Boolean).join(',')).join(' | '),
    opacidad: getComputedStyle(document.querySelector('h1, .confirmacion__pregunta, legend, label') ?? document.body).opacity,
  }));
  ok(`sin JS ${ruta}`, ruta.includes('cerrada') ? vis.isla && !vis.sinjs : !vis.isla && vis.sinjs && vis.form, JSON.stringify(vis));
  await page.screenshot({ path: join(SALIDA, `confirmacion-sinjs-${ruta.split('/').filter(Boolean).join('-')}.png`) });
  await ctx.close();
}

// 6. Movimiento reducido: todo visible y quieto al instante.
{
  const { ctx, page } = await nueva('celular', { reducedMotion: 'reduce' });
  await page.goto(WEB + '/prueba/pasos/confirmar', { waitUntil: 'networkidle' });
  await hidratada(page);
  await boton(page, 'Sí, con mucho gusto').click();
  await espera(150);
  const r = await page.evaluate(() => ({
    animando: document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName || a.transitionProperty).slice(0, 5),
    opacidades: [...document.querySelectorAll('[data-a]')].filter((e) => e.offsetParent).map((e) => getComputedStyle(e).opacity).filter((o) => o !== '1').length,
  }));
  ok('reducido: sin animaciones corriendo en el paso 2', r.animando.length === 0, JSON.stringify(r.animando));
  ok('reducido: todo visible', r.opacidades === 0, r.opacidades);
  await page.getByRole('button', { name: 'Lugar 2' }).click();
  const t = await page.evaluate(() => document.getAnimations().length);
  ok('reducido: sillas sin transición', t === 0, t);
  await boton(page, 'Continuar').click();
  await boton(page, 'Confirmar asistencia').click();
  await espera(700);
  const g = await page.evaluate(() => ({ destellos: [...document.querySelectorAll('.confirmacion__destello')].filter((e) => e.offsetParent).length, clip: getComputedStyle(document.querySelector('.confirmacion__gracias')).clipPath, anim: document.getAnimations().length }));
  ok('reducido: gracias sin escritura ni destellos', g.destellos === 0 && g.clip === 'none' && g.anim === 0, JSON.stringify(g));
  await ctx.close();
}

// 7. Navegación: sello del cierre → /confirmar; portada → /confirmar; Volver regresa.
{
  const { ctx, page } = await nueva('celular');
  await page.goto(WEB + '/cierre', { waitUntil: 'networkidle' });
  await espera(1500);
  await page.locator('[data-cierre-sello]').click();
  await page.waitForURL('**/confirmar', { timeout: 8000 }).catch(() => {});
  ok('sello del cierre → /confirmar', new URL(page.url()).pathname === '/confirmar', page.url());
  ok('título de la pestaña', (await page.title()) === 'Confirma tu asistencia · Ivan & Emma', await page.title());
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
  await boton(page, 'Volver a la invitación').click();
  await page.waitForURL('**/cierre', { timeout: 5000 }).catch(() => {});
  ok('Volver a la invitación regresa al cierre', new URL(page.url()).pathname === '/cierre', page.url());
  const href = await page.goto(WEB + '/portada').then(() => page.locator('a', { hasText: 'Confirmar asistencia' }).first().getAttribute('href'));
  ok('portada → /confirmar', href === '/confirmar', href);
  await ctx.close();
}

ok('sin errores de consola', errores.length === 0, errores.join(' | '));
await browser.close();
console.table(filas);
