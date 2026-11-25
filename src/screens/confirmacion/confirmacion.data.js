// Pantalla aparte · Confirmación: datos de diseño de los tableros ConfirmacionD2 (390×844),
// ConfirmacionEscritorio (1440×900) y ConfEstado-* (docs/pantallas.md § 6.7).

/** Personas de una invitación: hasta 12 (de 7 a 12, las sillas van en dos filas; lienzo del 24 nov). */
export const LUGARES_MAX = 12;

/** Longitud máxima del mensaje (el servidor la revalida cuando exista la Action). */
export const MENSAJE_MAX = 500;

/** Código impreso: 8 caracteres en dos bloques de 4 (K7M2-PQ9X). */
export const CODIGO_LARGO = 8;

/**
 * Destellos de "gracias": [izquierda % celular, izquierda % computadora, retraso s, tamaño px].
 * Suben y se apagan detrás de la palabra (cf-spark del lienzo).
 */
export const destellos = [
  [22, 18, 0.5, 5],
  [34, 30, 1.1, 7],
  [47, 44, 0.2, 4],
  [58, 56, 0.8, 6],
  [69, 68, 1.4, 5],
  [79, 80, 0.4, 7],
  [40, 38, 1.8, 5],
  [63, 62, 2.1, 4],
];

/**
 * Familia y respuesta de muestra del lienzo ("Familia García", 4 lugares, 3 confirmados). Sólo las usan las
 * páginas de muestra de desarrollo (pages/prueba/) mientras no existe el backend; nunca la web publicada.
 */
/** Personas de ejemplo del lienzo (en orden, una por silla): las mismas de los tableros, para compararlos. */
const ejemplo = [
  ['Roberto', 'García'], ['Guadalupe', 'Ruiz'], ['Sofía', 'García'], ['Mateo', 'García'], ['Valentina', 'Torres'],
  ['Emiliano', 'García'], ['Fernanda', 'López'], ['Diego', 'García'], ['Ximena', 'Ortega'], ['Andrés', 'García'],
  ['Lucía', 'Morales'], ['Tomás', 'García'],
];
/** Nombres largos del lienzo (ConfNombres4/6/12): prueban cómo se achica el renglón que no cabe. */
const largos = [
  ['Constantiniano', 'Santamarina'], ['Hermenegildo', 'Covarrubias'], ['Maximiliano', 'Bustamante'], ['Lupita', ''],
  ['Purificación', 'Valenzuela'], ['Bartolomé', 'Echeverría'], ['Encarnación', 'Santibáñez'], ['Guadalupe', 'Altamirano'],
  ['Leonardo', 'Castañeda'], ['Concepción', 'Villaseñor'], ['Ximena', 'Ortega'], ['Emiliano', 'Garza'],
];
/** Pareja con un nombre de invitación largo (ConfEtiqueta-*). */
const pareja = [['Jonathan', 'Medina'], ['Jessica', 'Rodriguez']];
const conId = (lista, clave) => lista.map(([nombre, apellido], i) => ({ id: `${clave}-${i + 1}`, nombre, apellido }));

export const muestra = {
  familia: 'Familia García',
  lugares: 4,
  personas: { ejemplo: conId(ejemplo, 'e'), largos: conId(largos, 'l'), pareja: conId(pareja, 'p') },
  etiquetaLarga: 'Jonathan Medina y Jessica Rodriguez',
  codigoValido: 'K7M2PQ9X',
  codigoInvalido: 'K7N2PQ9X',
  respuesta: {
    asiste: true,
    invitados: 3,
    mensaje: '¡Ahí estaremos! Felicidades, los queremos mucho.',
    recibida: '2026-12-12T12:00:00-06:00',
  },
};
