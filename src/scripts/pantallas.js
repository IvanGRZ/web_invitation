// Controlador de pantallas del recorrido (layouts/Recorrido.astro).
//
// Entrada de cada pantalla
// - Precarga: cuando una pantalla está a una pantalla de distancia, sus imágenes empiezan a cargar.
// - Activación: cuando una pantalla ocupa la mayor parte de la vista, espera a que sus imágenes estén
//   decodificadas y las fuentes listas (con un tope) y le pone `is-active`: su secuencia de entrada corre
//   (screen.css la tiene en pausa hasta ese momento). Cada pantalla entra una sola vez.
//
// Direcciones, como páginas
// - Cada pantalla tiene su ruta (`/portada`, `/bienvenida`, `/i/<codigo>/bienvenida`); la ruta base
//   (`/`, `/i/<codigo>`) abre la primera y la barra muestra su dirección. Al llegar a una pantalla,
//   la barra del navegador muestra su dirección y la pestaña su título; cada cambio es una entrada del
//   historial, así que "Atrás" regresa a la pantalla anterior.
// - Los enlaces a otra pantalla del recorrido no recargan: desplazan hasta ella.

const recorrido = /** @type {HTMLElement | null} */ (document.querySelector('[data-recorrido]'));
const pantallas = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-screen]')]);

const ESPERA_MAXIMA_MS = 2500;
const UMBRAL_ACTIVA = 0.6;
const TOPE_NAVEGACION_MS = 2000;

const base = recorrido?.dataset.base ?? '';
// Páginas con dirección fija (el 404): la barra conserva la ruta que se pidió.
const fija = recorrido?.dataset.fija !== undefined;
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ─── Rutas ─────────────────────────────────────────────────────────── */

/** @param {string} ruta */
const normalizar = (ruta) => (ruta.length > 1 ? ruta.replace(/\/+$/, '') : ruta);

/** @param {string} slug */
const rutaDe = (slug) => `${base}/${slug}`;

/** @param {string} ruta */
const pantallaDeRuta = (ruta) => pantallas.find((p) => rutaDe(p.dataset.slug ?? '') === normalizar(ruta));

/* ─── Entrada de cada pantalla ──────────────────────────────────────── */

/** @param {Element} pantalla */
const imagenes = (pantalla) => [...pantalla.querySelectorAll('img')];

/** @param {Element} pantalla */
function precargar(pantalla) {
  for (const img of imagenes(pantalla)) {
    if (img.loading === 'lazy') img.loading = 'eager';
  }
}

/** @param {Element} pantalla */
function lista(pantalla) {
  const esperas = imagenes(pantalla).map((img) => img.decode().catch(() => {}));
  esperas.push(document.fonts ? document.fonts.ready.then(() => {}) : Promise.resolve());
  const tope = new Promise((resolver) => setTimeout(resolver, ESPERA_MAXIMA_MS));
  return Promise.race([Promise.all(esperas), tope]);
}

/** @param {HTMLElement} pantalla */
async function activar(pantalla) {
  if (pantalla.dataset.entrada) return;
  pantalla.dataset.entrada = 'preparando';
  precargar(pantalla);
  await lista(pantalla);
  pantalla.dataset.entrada = 'hecha';
  pantalla.classList.add('is-active');
}

/* ─── Pantalla actual: dirección, título e historial ────────────────── */

/** Slug al que se está navegando (Atrás/Adelante o un enlace); mientras tanto no se escribe el historial. */
let navegandoA = /** @type {string | null} */ (null);
let topeNavegacion = 0;

/** @param {HTMLElement} pantalla */
function irA(pantalla) {
  navegandoA = pantalla.dataset.slug ?? '';
  clearTimeout(topeNavegacion);
  topeNavegacion = window.setTimeout(() => (navegandoA = null), TOPE_NAVEGACION_MS);
  pantalla.scrollIntoView({ behavior: sinMovimiento.matches ? 'instant' : 'smooth', block: 'start' });
}

/** @param {HTMLElement} pantalla */
function llegarA(pantalla) {
  const slug = pantalla.dataset.slug ?? '';
  if (navegandoA !== null) {
    if (slug !== navegandoA) return; // pantallas de paso durante una navegación
    navegandoA = null;
    clearTimeout(topeNavegacion);
  }
  if (pantalla.dataset.titulo) document.title = pantalla.dataset.titulo;
  const ruta = rutaDe(slug);
  if (!fija && normalizar(location.pathname) !== ruta) {
    history.pushState({ slug }, '', ruta + location.search);
  }
}

window.addEventListener('popstate', () => {
  const pantalla = pantallaDeRuta(location.pathname);
  if (pantalla) irA(pantalla);
});

recorrido?.addEventListener('click', (evento) => {
  if (evento.defaultPrevented || evento.button !== 0) return;
  if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
  const enlace = /** @type {HTMLElement} */ (evento.target).closest('a[href]');
  if (!(enlace instanceof HTMLAnchorElement) || enlace.target) return;
  const url = new URL(enlace.href);
  if (url.origin !== location.origin) return;
  const pantalla = url.hash ? pantallas.find((p) => `#${p.id}` === url.hash) : pantallaDeRuta(url.pathname);
  if (!pantalla) return;
  evento.preventDefault();
  irA(pantalla);
});

/* ─── Una pantalla por gesto (rueda y teclado) ──────────────────────── */
// Con snap obligatorio, un giro corto de rueda o una flecha regresan a la misma pantalla y un giro largo
// puede saltarse varias. Aquí cada gesto avanza o retrocede exactamente una pantalla. La inercia del
// trackpad (eventos continuos sin pausa) cuenta como el mismo gesto. En pantallas táctiles se queda el
// deslizamiento nativo, que ya se detiene en cada pantalla (scroll-snap-stop: always).

const PAUSA_ENTRE_GESTOS_MS = 220;
const BLOQUEO_TRAS_CAMBIO_MS = 850;
const DELTA_MINIMO = 6;

let bloqueadoHasta = 0;
let ultimaRueda = 0;
let gestoUsado = false;

/** Índice de la pantalla que ocupa la vista (o a la que se está yendo). */
function indiceActual() {
  if (navegandoA !== null) {
    const i = pantallas.findIndex((p) => (p.dataset.slug ?? '') === navegandoA);
    if (i >= 0) return i;
  }
  const alto = recorrido?.clientHeight || 1;
  return Math.min(pantallas.length - 1, Math.max(0, Math.round((recorrido?.scrollTop ?? 0) / alto)));
}

/** @param {number} paso +1 siguiente, −1 anterior */
function avanzar(paso) {
  const destino = pantallas[indiceActual() + paso];
  if (!destino) return false;
  bloqueadoHasta = performance.now() + BLOQUEO_TRAS_CAMBIO_MS;
  irA(destino);
  return true;
}

recorrido?.addEventListener(
  'wheel',
  (evento) => {
    if (evento.ctrlKey) return; // zoom del navegador
    const delta = Math.abs(evento.deltaY) >= Math.abs(evento.deltaX) ? evento.deltaY : 0;
    if (delta === 0) return;
    evento.preventDefault();
    const ahora = performance.now();
    const mismoGesto = ahora - ultimaRueda < PAUSA_ENTRE_GESTOS_MS;
    ultimaRueda = ahora;
    if (!mismoGesto) gestoUsado = false;
    if (gestoUsado || ahora < bloqueadoHasta || Math.abs(delta) < DELTA_MINIMO) return;
    gestoUsado = avanzar(Math.sign(delta));
  },
  { passive: false },
);

const TECLAS = /** @type {Record<string, number>} */ ({
  ArrowDown: 1,
  PageDown: 1,
  ArrowUp: -1,
  PageUp: -1,
});

recorrido?.addEventListener('keydown', (evento) => {
  if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
  const objetivo = /** @type {HTMLElement} */ (evento.target);
  // No robar el teclado a controles (botones, enlaces, campos): Espacio/Enter los activan.
  if (objetivo !== recorrido && objetivo.closest('a, button, input, textarea, select, [contenteditable]')) return;
  let paso = TECLAS[evento.key] ?? 0;
  if (evento.key === ' ') paso = evento.shiftKey ? -1 : 1;
  if (evento.key === 'Home' || evento.key === 'End') {
    evento.preventDefault();
    const destino = evento.key === 'Home' ? pantallas[0] : pantallas[pantallas.length - 1];
    if (destino) irA(destino);
    return;
  }
  if (!paso) return;
  evento.preventDefault();
  if (performance.now() >= bloqueadoHasta || evento.repeat === false) avanzar(paso);
});

/* ─── Observadores ──────────────────────────────────────────────────── */

// La dirección con la que se abrió (sin el #ancla de respaldo para navegadores sin JS).
const inicial = pantallaDeRuta(location.pathname) ?? pantallas[0];
if (inicial) {
  const slug = inicial.dataset.slug ?? '';
  if (!fija) history.replaceState({ slug }, '', rutaDe(slug) + location.search);
  if (inicial.dataset.titulo) document.title = inicial.dataset.titulo;
  // La pantalla con la que abre entra de inmediato, sin esperar al primer aviso del observador
  // (que puede tardar o no llegar si la página arranca en segundo plano).
  activar(inicial);
}

if (!('IntersectionObserver' in window)) {
  pantallas.forEach((pantalla) => activar(pantalla));
} else {
  const cercania = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          precargar(entrada.target);
          cercania.unobserve(entrada.target);
        }
      }
    },
    { root: recorrido, rootMargin: '0px 0px 100% 0px' },
  );

  const visible = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.intersectionRatio >= UMBRAL_ACTIVA) {
          const pantalla = /** @type {HTMLElement} */ (entrada.target);
          activar(pantalla);
          llegarA(pantalla);
        }
      }
    },
    { root: recorrido, threshold: UMBRAL_ACTIVA },
  );

  for (const pantalla of pantallas) {
    cercania.observe(pantalla);
    visible.observe(pantalla);
  }
}

// El teclado mueve el recorrido sólo si el foco está dentro de él.
if (recorrido && document.activeElement === document.body) {
  recorrido.focus({ preventScroll: true });
}
