// Casos de comparación lienzo ↔ web. Agrega aquí cada pantalla nueva con sus tableros.
// `tablero`: nombre del .html en tools/qa/.ref/ (sin extensión). Sin tablero, sólo se captura la web.

// `accion`: código que corre en la página web (no en el lienzo) antes de esperar el estado final.
const ANIO_2025 = `document.querySelector('[data-galeria-punto="10"]').click()`;

// Confirmación: toca botones o sillas por su texto (o aria-label), uno tras otro, cuando la isla ya hidrató.
const TOCAR = (...textos) => `(async () => {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  while (document.querySelector('astro-island[ssr]')) await esperar(50);
  for (const t of ${JSON.stringify(textos)}) {
    await esperar(150);
    const el = [...document.querySelectorAll('button, a')].find((b) => b.textContent.trim() === t || b.getAttribute('aria-label') === t);
    el.click();
  }
})()`;

// Pasos de la confirmación tal como los muestra el lienzo (que entra a las sillas con la segunda vacía, y con dos
// filas con la segunda y la penúltima vacías; la web entra con todas: se liberan tocándolas por su nombre).
const CONFIRMACION_PASOS = [
  ['paso1', '', []],
  ['paso2', '-paso2', ['Sí, con mucho gusto', 'Guadalupe Ruiz']],
  ['paso3', '-paso3', ['Sí, con mucho gusto', 'Guadalupe Ruiz', 'Continuar']],
  ['gracias', '-gracias', ['Sí, con mucho gusto', 'Guadalupe Ruiz', 'Continuar', 'Confirmar asistencia']],
  ['extranaremos', '-extranaremos', ['No podremos asistir', 'Confirmar asistencia']],
];
// Nombres de las muestras (los del lienzo) y las sillas que el lienzo deja vacías: la segunda y, con dos filas, la
// penúltima.
const EJEMPLO = ['Roberto García', 'Guadalupe Ruiz', 'Sofía García', 'Mateo García', 'Valentina Torres', 'Emiliano García', 'Fernanda López', 'Diego García', 'Ximena Ortega', 'Andrés García', 'Lucía Morales', 'Tomás García'];
const LARGOS = ['Constantiniano Santamarina', 'Hermenegildo Covarrubias', 'Maximiliano Bustamante', 'Lupita', 'Purificación Valenzuela', 'Bartolomé Echeverría', 'Encarnación Santibáñez', 'Guadalupe Altamirano', 'Leonardo Castañeda', 'Concepción Villaseñor', 'Ximena Ortega', 'Emiliano Garza'];
const VACIAS = (nombres, l) => (l >= 7 ? [nombres[1], nombres[l - 2]] : [nombres[1]]);
// Galería de la boda (pantalla aparte): muestra de /prueba/<estado>/galeria-de-la-boda ↔ tablero (celular, computadora).
const GALERIA_BODA = [
  ['subiendo', 'GaleriaBoda-subir-c', 'GaleriaBoda-subir-escritorio'],
  ['sinsenal', 'GaleriaBoda-offline', 'GaleriaBoda-offline-escritorio'],
  ['rechazo', 'GaleriaBoda-rechazo', 'GaleriaBoda-rechazo-escritorio'],
  ['fallo', 'GaleriaBoda-fallo', 'GaleriaBoda-fallo-escritorio'],
  ['listo', 'GaleriaBoda-listo', 'GaleriaBoda-listo-escritorio'],
  ['vacia', 'GaleriaBoda-vacia', 'GaleriaBoda-vacia-escritorio'],
  ['antes', 'GaleriaBoda-antes-b', 'GaleriaBoda-antes-escritorio'],
  ['cerrada', 'GaleriaBoda-cerrada', 'GaleriaBoda-cerrada-escritorio'],
];
// Las historias: el tablero se queda en la primera foto con su barra llena (no corre su lógica); la web avanzaría
// a los 5 s. Se detiene el aviso de fin de la barra antes de que llegue a React.
const HISTORIA_QUIETA = `window.addEventListener('animationend', (e) => e.stopPropagation(), true)`;
const HISTORIAS = '/prueba/historias/galeria-de-la-boda/historias';

const CONFIRMACION_ESTADOS = [
  ['candado', 'candado'],
  ['invalido', 'invalido'],
  ['error', 'error'],
  ['regreso', 'regreso'],
  ['cerrada', 'cerrado'],
];

export const CASOS = [
  { nombre: 'portada-celular', ruta: '/portada', tamano: 'celular', tablero: 'Velas' },
  { nombre: 'portada-computadora', ruta: '/portada', tamano: 'computadora', tablero: 'PortadaEscritorio' },
  { nombre: 'portada-iphoneSE', ruta: '/portada', tamano: 'iphoneSE' },
  { nombre: 'portada-monitor', ruta: '/portada', tamano: 'monitorIvan' },

  { nombre: 'bienvenida-celular', ruta: '/bienvenida', tamano: 'celular', tablero: 'BienvenidaPostal' },
  { nombre: 'bienvenida-computadora', ruta: '/bienvenida', tamano: 'computadora', tablero: 'BienvenidaD' },
  { nombre: 'bienvenida-iphoneSE', ruta: '/bienvenida', tamano: 'iphoneSE' },
  { nombre: 'bienvenida-tableta', ruta: '/bienvenida', tamano: 'tableta' },
  { nombre: 'bienvenida-monitor', ruta: '/bienvenida', tamano: 'monitorIvan' },

  // El tablero de celular mide 390×1056: a 390×1056 se compara 1:1 (geometría al píxel); a 390×844 la web lo
  // escala para que quepa y el lienzo se escala igual (?ajustar). Ahí los textos chicos llevan su piso
  // (10 px / 17 px) y difieren a propósito del lienzo escalado.
  { nombre: 'ceremonia-tablero', ruta: '/ceremonia', tamano: 'celularAlto', tablero: 'CeremoniaC' },
  { nombre: 'ceremonia-celular', ruta: '/ceremonia', tamano: 'celular', tablero: 'CeremoniaC', ajustar: true },
  { nombre: 'ceremonia-computadora', ruta: '/ceremonia', tamano: 'computadora', tablero: 'CeremoniaEscritorio' },
  { nombre: 'ceremonia-iphoneSE', ruta: '/ceremonia', tamano: 'iphoneSE' },
  { nombre: 'ceremonia-tableta', ruta: '/ceremonia', tamano: 'tableta' },
  { nombre: 'ceremonia-monitor', ruta: '/ceremonia', tamano: 'monitorIvan' },

  // El tablero de celular mide 390×670: a 390×670 se compara 1:1. A 390×844 la web lo centra y sigue el cielo
  // a sangre (marfil arriba, noche abajo); el lienzo centrado deja franjas blancas: ahí sólo cuentan las cajas.
  { nombre: 'itinerario-tablero', ruta: '/itinerario', tamano: 'celularCorto', tablero: 'ItinerarioD' },
  { nombre: 'itinerario-celular', ruta: '/itinerario', tamano: 'celular', tablero: 'ItinerarioD', ajustar: true },
  { nombre: 'itinerario-computadora', ruta: '/itinerario', tamano: 'computadora', tablero: 'ItinerarioEscritorio' },
  { nombre: 'itinerario-iphoneSE', ruta: '/itinerario', tamano: 'iphoneSE' },
  { nombre: 'itinerario-tableta', ruta: '/itinerario', tamano: 'tableta' },
  { nombre: 'itinerario-monitor', ruta: '/itinerario', tamano: 'monitorIvan' },

  // El tablero de celular mide 390×740: a 390×740 se compara 1:1. A 390×844 la web lo centra y sigue la noche
  // a sangre; el lienzo centrado deja franjas blancas: ahí sólo cuentan las cajas.
  { nombre: 'vestimenta-tablero', ruta: '/vestimenta', tamano: 'celularMedio', tablero: 'VestimentaGala' },
  { nombre: 'vestimenta-celular', ruta: '/vestimenta', tamano: 'celular', tablero: 'VestimentaGala', ajustar: true },
  { nombre: 'vestimenta-computadora', ruta: '/vestimenta', tamano: 'computadora', tablero: 'VestimentaEscritorio' },
  { nombre: 'vestimenta-iphoneSE', ruta: '/vestimenta', tamano: 'iphoneSE' },
  { nombre: 'vestimenta-tableta', ruta: '/vestimenta', tamano: 'tableta' },
  { nombre: 'vestimenta-monitor', ruta: '/vestimenta', tamano: 'monitorIvan' },

  // El tablero de celular mide 390×1042: a 390×1042 se compara 1:1; a 390×844 la web lo escala (?ajustar).
  // El lienzo arranca en la foto 11 (2025, Toledo) para mostrar una foto real y la web en la primera:
  // `accion` (código que corre sólo en la web antes de capturar) toca ese punto de la línea de años.
  { nombre: 'galeria-tablero', ruta: '/galeria', tamano: 'celularGaleria', tablero: 'HistoriaPeliculaOro', accion: ANIO_2025 },
  { nombre: 'galeria-celular', ruta: '/galeria', tamano: 'celular', tablero: 'HistoriaPeliculaOro', ajustar: true, accion: ANIO_2025 },
  { nombre: 'galeria-computadora', ruta: '/galeria', tamano: 'computadora', tablero: 'HistoriaEscritorio', accion: ANIO_2025 },
  { nombre: 'galeria-iphoneSE', ruta: '/galeria', tamano: 'iphoneSE', accion: ANIO_2025 },
  { nombre: 'galeria-tableta', ruta: '/galeria', tamano: 'tableta' },
  { nombre: 'galeria-monitor', ruta: '/galeria', tamano: 'monitorIvan', accion: ANIO_2025 },

  // Tableros de 390×844 y 1440×900: se comparan 1:1 en su estado inicial (sobre cerrado).
  { nombre: 'cierre-celular', ruta: '/cierre', tamano: 'celular', tablero: 'CierreSello' },
  { nombre: 'cierre-computadora', ruta: '/cierre', tamano: 'computadora', tablero: 'CierreEscritorio' },
  { nombre: 'cierre-iphoneSE', ruta: '/cierre', tamano: 'iphoneSE' },
  { nombre: 'cierre-tableta', ruta: '/cierre', tamano: 'tableta' },
  { nombre: 'cierre-monitor', ruta: '/cierre', tamano: 'monitorIvan' },

  // Confirmación (pantalla aparte): tableros de 390×844 y 1440×900, 1:1. Páginas de muestra en /prueba/ (sólo dev).
  ...CONFIRMACION_PASOS.flatMap(([nombre, sufijo, toques]) => [
    { nombre: `confirmacion-${nombre}-celular`, ruta: '/prueba/pasos/confirmar', tamano: 'celular', tablero: `ConfirmacionD2${sufijo}`, accion: toques.length ? TOCAR(...toques) : undefined },
    { nombre: `confirmacion-${nombre}-computadora`, ruta: '/prueba/pasos/confirmar', tamano: 'computadora', tablero: `ConfirmacionEscritorio${sufijo}`, accion: toques.length ? TOCAR(...toques) : undefined },
  ]),
  ...CONFIRMACION_ESTADOS.flatMap(([ruta, tablero]) => [
    { nombre: `confirmacion-${ruta}-celular`, ruta: `/prueba/${ruta}/confirmar`, tamano: 'celular', tablero: `ConfEstado-${tablero}` },
    { nombre: `confirmacion-${ruta}-computadora`, ruta: `/prueba/${ruta}/confirmar`, tamano: 'computadora', tablero: `ConfEstado-${tablero}-escritorio` },
  ]),
  // De 7 a 12 personas (dos filas), nombres largos y nombre de invitación largo (lienzo del 24 nov).
  ...[7, 8, 9, 12].flatMap((l) => [
    { nombre: `confirmacion-${l}-celular`, ruta: `/prueba/pasos-${l}/confirmar`, tamano: 'celular', tablero: `ConfLugares${l}`, accion: TOCAR('Sí, con mucho gusto', ...VACIAS(EJEMPLO, l)) },
    { nombre: `confirmacion-${l}-computadora`, ruta: `/prueba/pasos-${l}/confirmar`, tamano: 'computadora', tablero: `ConfLugares${l}-escritorio`, accion: TOCAR('Sí, con mucho gusto', ...VACIAS(EJEMPLO, l)) },
  ]),
  { nombre: 'confirmacion-12-pase-celular', ruta: '/prueba/pasos-12/confirmar', tamano: 'celular', tablero: 'ConfLugares12-pase' },
  { nombre: 'confirmacion-12-gracias-celular', ruta: '/prueba/pasos-12/confirmar', tamano: 'celular', tablero: 'ConfLugares12-gracias', accion: TOCAR('Sí, con mucho gusto', ...VACIAS(EJEMPLO, 12), 'Continuar', 'Confirmar asistencia') },
  ...[4, 6, 12].map((l) => ({ nombre: `confirmacion-nombres-${l}-celular`, ruta: `/prueba/nombres-${l}/confirmar`, tamano: 'celular', tablero: `ConfNombres${l}`, accion: TOCAR('Sí, con mucho gusto', ...VACIAS(LARGOS, l)) })),
  { nombre: 'confirmacion-etiqueta-pase-celular', ruta: '/prueba/etiqueta/confirmar', tamano: 'celular', tablero: 'ConfEtiqueta-pase' },
  { nombre: 'confirmacion-etiqueta-sillas-celular', ruta: '/prueba/etiqueta/confirmar', tamano: 'celular', tablero: 'ConfEtiqueta-sillas', accion: TOCAR('Sí, con mucho gusto', 'Jessica Rodriguez') },
  { nombre: 'confirmacion-etiqueta-computadora', ruta: '/prueba/etiqueta/confirmar', tamano: 'computadora', tablero: 'ConfEtiqueta-escritorio' },
  ...['regreso', 'cerrado'].flatMap((t) => [
    { nombre: `confirmacion-${t}-12-celular`, ruta: `/prueba/${t === 'cerrado' ? 'cerrada' : t}-12/confirmar`, tamano: 'celular', tablero: `ConfEstado-${t}-12` },
    { nombre: `confirmacion-${t}-12-computadora`, ruta: `/prueba/${t === 'cerrado' ? 'cerrada' : t}-12/confirmar`, tamano: 'computadora', tablero: `ConfEstado-${t}-12-escritorio` },
  ]),
  { nombre: 'confirmacion-12-iphoneSE', ruta: '/prueba/pasos-12/confirmar', tamano: 'iphoneSE', accion: TOCAR('Sí, con mucho gusto') },
  { nombre: 'confirmacion-paso2-iphoneSE', ruta: '/prueba/pasos-6/confirmar', tamano: 'iphoneSE', accion: TOCAR('Sí, con mucho gusto') },
  { nombre: 'confirmacion-paso1-iphoneSE', ruta: '/prueba/pasos/confirmar', tamano: 'iphoneSE' },
  { nombre: 'confirmacion-candado-iphoneSE', ruta: '/confirmar', tamano: 'iphoneSE' },
  { nombre: 'confirmacion-paso2-monitor', ruta: '/prueba/pasos-6/confirmar', tamano: 'monitorIvan', accion: TOCAR('Sí, con mucho gusto') },
  { nombre: 'confirmacion-regreso-monitor', ruta: '/prueba/regreso/confirmar', tamano: 'monitorIvan' },
  { nombre: 'confirmacion-candado-tableta', ruta: '/confirmar', tamano: 'tableta' },

  // Galería de la boda: tableros de 390×844 y 1440×900, 1:1, con las muestras de /prueba/ (sólo dev).
  ...GALERIA_BODA.flatMap(([estado, celular, computadora]) => [
    { nombre: `galeria-boda-${estado}-celular`, ruta: `/prueba/${estado}/galeria-de-la-boda`, tamano: 'celular', tablero: celular },
    { nombre: `galeria-boda-${estado}-computadora`, ruta: `/prueba/${estado}/galeria-de-la-boda`, tamano: 'computadora', tablero: computadora },
  ]),
  { nombre: 'galeria-boda-historias-celular', ruta: HISTORIAS, tamano: 'celular', tablero: 'GaleriaBoda-carrusel-c', accion: HISTORIA_QUIETA },
  { nombre: 'galeria-boda-historias-computadora', ruta: HISTORIAS, tamano: 'computadora', tablero: 'GaleriaBoda-historias-escritorio', accion: HISTORIA_QUIETA },
  { nombre: 'galeria-boda-subiendo-iphoneSE', ruta: '/prueba/subiendo/galeria-de-la-boda', tamano: 'iphoneSE' },
  { nombre: 'galeria-boda-rechazo-iphoneSE', ruta: '/prueba/rechazo/galeria-de-la-boda', tamano: 'iphoneSE' },
  { nombre: 'galeria-boda-antes-iphoneSE', ruta: '/prueba/antes/galeria-de-la-boda', tamano: 'iphoneSE' },
  { nombre: 'galeria-boda-historias-iphoneSE', ruta: HISTORIAS, tamano: 'iphoneSE', accion: HISTORIA_QUIETA },
  { nombre: 'galeria-boda-listo-monitor', ruta: '/prueba/listo/galeria-de-la-boda', tamano: 'monitorIvan' },
  { nombre: 'galeria-boda-cerrada-monitor', ruta: '/prueba/cerrada/galeria-de-la-boda', tamano: 'monitorIvan' },
  { nombre: 'galeria-boda-historias-monitor', ruta: HISTORIAS, tamano: 'monitorIvan', accion: HISTORIA_QUIETA },
  { nombre: 'galeria-boda-fallo-tableta', ruta: '/prueba/fallo/galeria-de-la-boda', tamano: 'tableta' },

  // 404 (pantalla general): tableros de 390×844 y 1440×900, 1:1, con una ruta que no existe.
  { nombre: '404-celular', ruta: '/i/NOEXISTE', tamano: 'celular', tablero: 'General404' },
  { nombre: '404-computadora', ruta: '/i/NOEXISTE', tamano: 'computadora', tablero: 'General404-escritorio' },
  { nombre: '404-iphoneSE', ruta: '/i/NOEXISTE', tamano: 'iphoneSE' },
  { nombre: '404-monitor', ruta: '/i/NOEXISTE', tamano: 'monitorIvan' },
];
