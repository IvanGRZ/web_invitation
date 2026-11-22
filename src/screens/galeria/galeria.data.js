// Pantalla 6 · Galería (Un paso a la vez): datos de diseño de los tableros del lienzo
// (HistoriaPeliculaOro 390×1042 y HistoriaEscritorio 1440×900). Coordenadas en pixeles del tablero.
import toledo from './assets/toledo-propuesta.jpg';

/**
 * Una foto por año, de la más antigua a la más reciente (doce). La web empieza en la primera.
 * Pendiente de Ivan: las once fotos que faltan y sus años. Mientras, cada cuadro muestra el marcador del
 * lienzo ("Foto del año", año "20··"). Sólo está la de Toledo (2025), en el lugar donde la pone el lienzo.
 * `posicion`: object-position de la foto en su ventana (como el background-position del lienzo).
 *
 * @typedef {Object} Foto
 * @property {number | null} anio
 * @property {string} [pie] pie de foto opcional
 * @property {ImageMetadata} [imagen]
 * @property {string} [alt]
 * @property {string} [posicion]
 */

/** @type {Foto[]} */
export const fotos = [
  { anio: null },
  { anio: null },
  { anio: null },
  { anio: null },
  { anio: null },
  { anio: null },
  { anio: null },
  { anio: null },
  { anio: null },
  { anio: null },
  {
    anio: 2025,
    pie: 'Toledo, España',
    imagen: toledo,
    alt: 'Ivan y Emma en Toledo, con el Alcázar al fondo, el día de la propuesta',
    posicion: '76% 40%',
  },
  { anio: null },
];

/** Año que se muestra mientras Ivan no confirma el de una foto (el marcador del lienzo). */
export const ANIO_PENDIENTE = '20··';

/** Perforaciones de un lado de la película: 15 ventanitas de 10×14 con esquinas de 2, cada 22 px. */
const perforaciones = (/** @type {number} */ x) =>
  Array.from({ length: 15 }, (_, k) => `M${x} ${11 + 22 * k}h6q2 0 2 2v10q0 2-2 2h-6q-2 0-2-2v-10q0-2 2-2z`).join('');

/**
 * La película en línea dorada (viewBox 0 0 236 332). Cada trazo se dibuja una vez al entrar la pantalla.
 * `duracion` y `retraso` en s; `opacidad` del trazo.
 */
export const pelicula = [
  { clave: 'contorno', d: 'M3 1.5H233Q234.5 1.5 234.5 3V329Q234.5 330.5 233 330.5H3Q1.5 330.5 1.5 329V3Q1.5 1.5 3 1.5Z', trazo: 1, duracion: 2.2, retraso: 0.9, opacidad: 0.9 },
  { clave: 'perforaciones', d: perforaciones(12) + perforaciones(218), trazo: 0.8, duracion: 2.6, retraso: 1.3, opacidad: 0.7 },
  { clave: 'vecinos', d: 'M36 0V30H200V0M36 332V302H200V332', trazo: 0.8, duracion: 1.8, retraso: 1.6, opacidad: 0.55 },
  { clave: 'ventana', d: 'M35.5 41.5H200.5V290.5H35.5Z', trazo: 1, duracion: 1.6, retraso: 1.1, opacidad: 1 },
];

/**
 * Estrellas que titilan. [x, y, tamaño, retraso (s), duración (s)] en coordenadas del tablero.
 */
export const estrellas = {
  celular: [
    [20, 30, 4, 0.0, 5.0],
    [352, 26, 3, 1.4, 6.6],
    [12, 340, 3, 2.2, 8.2],
    [370, 360, 4, 0.6, 5.0],
    [24, 922, 4, 3.1, 6.6],
    [360, 972, 5, 1.0, 8.2],
    [190, 1028, 3, 2.5, 5.0],
    [60, 1036, 4, 1.7, 6.6],
  ],
  computadora: [
    [60, 60, 4, 0.0, 5.0],
    [420, 40, 3, 1.3, 6.6],
    [700, 90, 5, 2.2, 8.2],
    [1330, 70, 4, 0.6, 5.0],
    [1390, 300, 3, 2.9, 6.6],
    [90, 520, 3, 1.8, 8.2],
    [640, 470, 4, 0.9, 5.0],
    [1360, 620, 5, 3.4, 6.6],
    [80, 840, 4, 2.4, 8.2],
    [520, 860, 3, 0.4, 5.0],
    [1250, 860, 4, 1.6, 6.6],
    [720, 700, 3, 2.7, 8.2],
  ],
};
