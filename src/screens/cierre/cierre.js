// Pantalla 7 · Cierre: romper el sello (docs/pantallas.md § 6.6).
// El sello es un enlace real a la confirmación. Aquí sólo se intercepta el toque para correr la animación
// del lienzo (sello que se rompe, sobre que se desvanece, frente impreso, luz marfil que llena la pantalla)
// y, al terminar, navegar a ese mismo enlace. Sin JS o con movimiento reducido el enlace navega directo.

const DURACION_MS = 2900; // la luz marfil empieza a 1.9 s y tarda 1 s en llenar la pantalla
const ESCALA_LIENZO = 48;

const escena = /** @type {HTMLElement | null} */ (document.querySelector('[data-cierre]'));
const sello = /** @type {HTMLAnchorElement | null} */ (escena?.querySelector('[data-cierre-sello]'));
const luz = /** @type {HTMLElement | null} */ (escena?.querySelector('.cierre__marfil'));
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

/** La escala del lienzo (48) cubre su tablero; en pantallas más grandes o alargadas se agranda lo necesario. */
function ajustarLuz() {
  if (!escena || !luz) return;
  const caja = luz.getBoundingClientRect();
  const cx = caja.left + caja.width / 2;
  const cy = caja.top + caja.height / 2;
  const radio = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
  const escala = Math.max(ESCALA_LIENZO, ((radio * 2) / (luz.offsetWidth || 1)) * 1.02);
  escena.style.setProperty('--ci-luz-escala', String(escala));
}

let temporizador = 0;

sello?.addEventListener('click', (evento) => {
  if (sinMovimiento.matches || evento.button !== 0) return;
  if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
  evento.preventDefault();
  if (!escena || escena.classList.contains('is-open')) return;
  ajustarLuz();
  escena.classList.add('is-open');
  const destino = sello.href;
  temporizador = window.setTimeout(() => window.location.assign(destino), DURACION_MS);
});

// Al volver con "Atrás" (página restaurada de la caché del navegador), el sobre vuelve a estar cerrado.
window.addEventListener('pageshow', (evento) => {
  if (!evento.persisted || !escena) return;
  window.clearTimeout(temporizador);
  escena.classList.remove('is-open');
});
