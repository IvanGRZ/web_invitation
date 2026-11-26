// Pantalla 6 · Galería (Un paso a la vez): datos de diseño de los tableros del lienzo
// (HistoriaPeliculaOro 390×1042 y HistoriaEscritorio 1440×900). Coordenadas en pixeles del tablero.
import graduacion from './assets/2017-graduacion.jpg';
import mazamitla from './assets/2018-mazamitla.jpg';
import covid from './assets/2020-covid.jpg';
import lavandas from './assets/2023-lavandas.jpg';
import quebec from './assets/2023-quebec.jpg';
import chichen from './assets/2024-chichen-itza.jpg';
import roma from './assets/2025-roma.jpg';
import toledo from './assets/2025-toledo.jpg';
import paris from './assets/2025-paris.jpg';

/**
 * Momentos clave en orden cronológico (Ivan, 25 nov): ya no una foto por año; puede haber varias del mismo año.
 * Cada uno con su título (el momento, donde el lienzo pone el año), su lugar y su año ("Lugar · año" abajo).
 * Fotos en ./assets/ como <año>-<momento>.jpg; las que faltan muestran el marcador del lienzo ("Foto del año").
 * `posicion`: object-position de la foto en su ventana (como el background-position del lienzo).
 *
 * @typedef {Object} Foto
 * @property {number | null} anio
 * @property {string} [titulo] el momento, de 2 a 5 palabras ("Nuestro primer viaje")
 * @property {string} [pie] lugar ("Roma, Italia")
 * @property {ImageMetadata} [imagen]
 * @property {string} [alt]
 * @property {string} [posicion]
 */

/** @type {Foto[]} */
export const fotos = [
  {
    anio: 2017,
    titulo: 'Donde todo empezó',
    pie: 'Guadalajara, Jalisco',
    imagen: graduacion,
    alt: 'Ivan y Emma abrazados, vestidos de gala, la noche de su graduación',
    posicion: '48% 50%',
  },
  {
    anio: 2018,
    titulo: 'Nuestro primer viaje',
    pie: 'Mazamitla, Jalisco',
    imagen: mazamitla,
    alt: 'Ivan y Emma juntos frente a una cabaña de madera en Mazamitla',
    posicion: '70% 50%',
  },
  {
    anio: 2020,
    titulo: 'Generación COVID',
    pie: 'Guadalajara, Jalisco',
    imagen: covid,
    alt: 'Ivan y Emma con cubrebocas negros, en una selfie de noche',
    posicion: '60% 50%',
  },
  {
    anio: 2023,
    titulo: 'Entre lavandas',
    pie: 'Puebla, Puebla',
    imagen: lavandas,
    alt: 'Ivan y Emma dándose un beso en medio de un campo de lavandas al atardecer, en Puebla',
    posicion: '50% 60%',
  },
  {
    anio: 2023,
    titulo: 'Cruzamos el mapa',
    pie: 'Quebec, Canadá',
    imagen: quebec,
    alt: 'Ivan y Emma sentados en el pasto frente al Château Frontenac, en Quebec',
    posicion: '66% 50%',
  },
  {
    anio: 2024,
    titulo: 'Nuestra primera maravilla del mundo',
    pie: 'Chichén Itzá, Yucatán',
    imagen: chichen,
    alt: 'Ivan y Emma abrazados en el pasto frente a la pirámide de Kukulcán, en Chichén Itzá',
    posicion: '55% 50%',
  },
  {
    anio: 2025,
    titulo: 'Una maravilla más',
    pie: 'Roma, Italia',
    imagen: roma,
    alt: 'Ivan y Emma abrazados frente al Coliseo, en Roma',
    posicion: '26% 50%',
  },
  {
    anio: 2025,
    titulo: 'Dijo que sí',
    pie: 'Toledo, España',
    imagen: toledo,
    alt: 'Ivan y Emma dándose un beso en un mirador de Toledo, el día de la propuesta',
    posicion: '50% 70%',
  },
  {
    anio: 2025,
    titulo: 'Siempre nos quedará París',
    pie: 'París, Francia',
    imagen: paris,
    alt: 'Ivan y Emma sentados en el pasto bajo la Torre Eiffel iluminada, de noche',
    posicion: '50% 20%',
  },
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
