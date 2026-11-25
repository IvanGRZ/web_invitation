// Acomodo de las sillas de la confirmación (lienzo del 24 nov: ConfLugares7…12, ConfNombres4/6/12, ConfEtiqueta-*).
// - Hasta 6 personas, una fila; de 7 a 12, dos filas centradas, la de arriba con la silla de más.
// - Cada silla tiene una columna fija (silla + separación) según cuántas van en su fila: hasta 4, 5 o 6.
// - Bajo la silla, nombre y primer apellido en dos renglones; el renglón que no cabe en su columna se achica de
//   medio en medio punto, con piso de 8 px (el lienzo mide con un <canvas>; aquí igual, ya en el navegador).
// - El nombre de la invitación que ocupa más de dos renglones baja de tamaño (52 → 42 en celular, 66 → 52 en
//   computadora).
// Todas las medidas son px del tablero (390 × 844 celular, 1440 × 900 computadora); en pantalla se multiplican
// por --u.

/** Columna de cada silla, en px del tablero, según cuántas van en la fila (hasta 4 / 5 / 6). */
export const COLUMNA = {
  cel: { 4: 78, 5: 64, 6: 56 },
  pc: { 4: 94, 5: 82, 6: 74 },
};

/** Sillas en la fila de arriba (la única hasta 6). */
export const sillasPorFila = (lugares) => (lugares <= 6 ? lugares : Math.ceil(lugares / 2));

/** Tamaño de silla que corresponde a la fila: 4 (hasta 4), 5 o 6. */
export const tamanoDeFila = (porFila) => Math.max(4, porFila);

/**
 * Ancho de una fila de sillitas (w de cada una, g de separación), para que se partan en dos filas. Sólo con
 * dos filas; con una, el ancho es el natural.
 * @param {number} porFila
 * @param {number} w
 * @param {number} g
 */
export const anchoDeSillitas = (porFila, w, g) => porFila * w + (porFila - 1) * g + 1;

/** @type {CanvasRenderingContext2D | null} */
let lienzo = null;
/** Ancho de un texto con su espaciado entre letras (ls en em), como lo mide el lienzo. */
function mide(texto, fuente, px, ls) {
  lienzo ??= document.createElement('canvas').getContext('2d');
  if (!lienzo) return 0;
  lienzo.font = fuente;
  return lienzo.measureText(texto).width + texto.length * px * ls;
}

/**
 * Tamaño de un renglón bajo la silla: base (12 px hasta 4 sillas por fila, 11 con 5 o 6), achicado hasta que
 * quepa en su columna (menos 4 px), con piso de 8 px.
 * @param {string} texto
 * @param {number} columna
 * @param {number} base
 * @returns {{ px: number, ls: number }}
 */
export function tamanoDeRenglon(texto, columna, base) {
  let px = base;
  let ls = base >= 12 ? 0.08 : 0.04;
  while (px > 8 && mide(texto, `400 ${px}px Jost`, px, ls) > columna - 4) {
    px -= 0.5;
    if (px < 12) ls = 0.04;
  }
  return { px, ls };
}

/**
 * ¿Cuántos renglones ocupa el nombre de la invitación (Cormorant 300) en un ancho dado?
 * @param {string} texto
 * @param {number} px
 * @param {number} ancho
 */
export function renglones(texto, px, ancho) {
  let total = 1;
  let linea = '';
  for (const palabra of String(texto).split(/\s+/)) {
    const prueba = linea ? `${linea} ${palabra}` : palabra;
    if (linea && mide(prueba, `300 ${px}px "Cormorant Garamond"`, px, 0) > ancho) {
      total += 1;
      linea = palabra;
    } else linea = prueba;
  }
  return total;
}

/**
 * Medidas que dependen del texto, en celular y en computadora: el tamaño de cada renglón bajo cada silla y si
 * el nombre de la invitación es largo. Sólo en el navegador (después de cargar las fuentes).
 * @param {{ nombre: string, apellido?: string }[]} personas
 * @param {number} lugares
 * @param {string} familia
 */
export function medir(personas, lugares, familia) {
  const tam = tamanoDeFila(sillasPorFila(lugares));
  const base = tam <= 4 ? 12 : 11;
  const renglon = (texto, donde) => (texto ? tamanoDeRenglon(texto, COLUMNA[donde][tam], base) : null);
  return {
    sillas: personas.map((p) => ({
      cel: [renglon(p.nombre, 'cel'), renglon(p.apellido, 'cel')],
      pc: [renglon(p.nombre, 'pc'), renglon(p.apellido, 'pc')],
    })),
    familiaLarga: {
      cel: familia ? renglones(familia, 52, 334) > 2 : false,
      pc: familia ? renglones(familia, 66, 480) > 2 : false,
    },
  };
}
