// Datos de diseño de la galería de la boda (docs/pantallas.md § 6.9): estrellas del cielo, reglas de la subida,
// textos que dependen de números y la muestra del lienzo (sólo para las páginas de prueba y la revisión visual).
// Funciones puras: sirven en servidor y en cliente.

/**
 * Estrellas que titilan, en pixeles del tablero: [left, top, tamaño, retraso (s), duración (s)].
 * El cielo de subir y el del rollo usan juegos distintos en computadora (así vienen en el lienzo).
 */
export const estrellas = {
  celular: [
    [22, 30, 4, 0, 5.0], [120, 16, 3, 1.4, 6.6], [300, 40, 5, 0.6, 8.2], [366, 20, 3, 2.2, 5.0],
    [30, 260, 3, 3.1, 6.6], [360, 240, 4, 1.1, 8.2], [14, 470, 5, 2.6, 5.0], [374, 500, 3, 0.4, 6.6],
    [30, 760, 4, 1.8, 8.2], [356, 780, 5, 3.4, 5.0], [200, 812, 3, 2.9, 6.6], [100, 800, 4, 0.9, 8.2],
  ],
  computadora: [
    [41, 494, 3, 4.2, 5.0], [104, 156, 3, 2.9, 6.6], [83, 692, 3, 0.8, 8.2], [1230, 109, 3, 0.1, 5.0],
    [1213, 692, 5, 0.3, 6.6], [121, 872, 3, 2.0, 8.2], [786, 45, 3, 4.0, 5.0], [100, 283, 4, 1.6, 6.6],
    [1187, 419, 4, 3.6, 8.2], [211, 822, 4, 4.9, 5.0], [1162, 652, 5, 4.6, 6.6], [620, 109, 3, 1.1, 8.2],
    [1247, 397, 3, 3.7, 5.0], [1345, 873, 3, 0.6, 6.6], [430, 833, 4, 2.4, 8.2], [115, 589, 3, 1.5, 5.0],
    [1320, 136, 3, 1.1, 6.6], [134, 524, 5, 4.3, 8.2], [1270, 516, 5, 0.2, 5.0], [245, 511, 3, 4.4, 6.6],
    [1257, 723, 4, 5.4, 8.2], [66, 274, 4, 4.2, 5.0], [502, 25, 3, 2.1, 6.6], [376, 60, 3, 0.7, 8.2],
    [1273, 65, 5, 4.9, 5.0], [411, 854, 4, 3.8, 6.6], [1151, 479, 5, 3.8, 8.2], [1274, 486, 4, 3.9, 5.0],
    [289, 394, 3, 2.9, 6.6], [356, 57, 3, 4.0, 8.2], [1218, 262, 4, 4.0, 5.0], [93, 47, 4, 3.4, 6.6],
    [906, 847, 4, 1.2, 8.2], [84, 851, 4, 2.1, 5.0], [458, 81, 3, 4.9, 6.6], [85, 83, 4, 0.8, 8.2],
    [986, 865, 3, 5.4, 5.0], [1255, 159, 5, 4.2, 6.6], [212, 700, 5, 3.9, 8.2], [58, 396, 5, 2.7, 5.0],
    [1402, 232, 5, 4.9, 6.6], [857, 63, 5, 1.3, 8.2], [506, 63, 4, 3.8, 5.0], [237, 829, 5, 0.3, 6.6],
    [113, 330, 4, 4.4, 8.2], [172, 37, 4, 4.4, 5.0],
  ],
  rollo: [
    [41, 494, 3, 4.2, 5.0], [304, 714, 3, 0.8, 6.6], [246, 562, 3, 3.9, 8.2], [301, 164, 3, 3.6, 5.0],
    [295, 250, 5, 4.0, 6.6], [1093, 436, 3, 5.5, 8.2], [206, 134, 3, 4.2, 5.0], [1213, 692, 5, 0.3, 6.6],
    [121, 872, 3, 2.0, 8.2], [786, 45, 3, 4.0, 5.0], [100, 283, 4, 1.6, 6.6], [1187, 419, 4, 3.6, 8.2],
    [211, 822, 4, 4.9, 5.0], [1162, 652, 5, 4.6, 6.6], [620, 109, 3, 1.1, 8.2], [1247, 397, 3, 3.7, 5.0],
    [1345, 873, 3, 0.6, 6.6], [430, 833, 4, 2.4, 8.2], [115, 589, 3, 1.5, 5.0], [1320, 136, 3, 1.1, 6.6],
    [348, 744, 3, 2.6, 8.2], [1225, 52, 3, 2.7, 5.0], [1257, 723, 4, 5.4, 6.6], [66, 274, 4, 4.2, 8.2],
    [502, 25, 3, 2.1, 5.0], [376, 60, 3, 0.7, 6.6], [1273, 65, 5, 4.9, 8.2], [411, 854, 4, 3.8, 5.0],
    [1151, 479, 5, 3.8, 6.6], [1089, 740, 5, 2.2, 8.2], [1089, 213, 5, 2.5, 5.0], [289, 394, 3, 2.9, 6.6],
    [356, 57, 3, 4.0, 8.2], [1218, 262, 4, 4.0, 5.0], [93, 47, 4, 3.4, 6.6], [1114, 221, 4, 4.5, 8.2],
    [837, 48, 4, 2.1, 5.0], [458, 81, 3, 4.9, 6.6], [85, 83, 4, 0.8, 8.2], [986, 865, 3, 5.4, 5.0],
    [1255, 159, 5, 4.2, 6.6], [212, 700, 5, 3.9, 8.2], [58, 396, 5, 2.7, 5.0], [1402, 232, 5, 4.9, 6.6],
    [857, 63, 5, 1.3, 8.2], [506, 63, 4, 3.8, 5.0],
  ],
};

/* ─── Reglas de la subida (§ 6.9 › Almacenamiento y › Límite) ─────────────── */

/** Límite por archivo original, antes de comprimir. */
export const LIMITE_MB = 25;
export const LIMITE_BYTES = LIMITE_MB * 1024 * 1024;
/** Compresión en el navegador antes de subir: lado largo, formato y calidad. */
export const LADO_LARGO = 2000;
export const CALIDAD = 0.8;
/** Miniatura para la tira, el fondo desenfocado de las historias y la precarga. */
export const LADO_MINIATURA = 320;
/** Lugares de "Tus fotos". */
export const LUGARES_TUS_FOTOS = 5;
/** Barras de avance visibles a la vez en las historias (con muchas fotos se recorre con la actual). */
export const VENTANA_BARRAS = 30;
/** Duración de cada historia (s) y umbral entre toque y presión (ms). */
export const DURACION_HISTORIA_S = 5;
export const UMBRAL_TOQUE_MS = 250;

/**
 * Estado de la galería según la hora (el servidor valida las mismas dos horas al recibir una foto).
 * @param {number} ahoraMs
 * @param {{ apertura: string, cierre: string }} horario
 * @returns {'antes' | 'abierta' | 'cerrada'}
 */
export function estadoDe(ahoraMs, { apertura, cierre }) {
  if (ahoraMs < Date.parse(apertura)) return 'antes';
  return ahoraMs < Date.parse(cierre) ? 'abierta' : 'cerrada';
}

/** @param {number} n @param {string} uno @param {string} varios */
const contar = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

/**
 * Cuánto falta para que se abra la galería: "Faltan 93 días y 4 horas"; sin horas sueltas cuando son cero,
 * en singular cuando toca ("Falta 1 día") y, el mismo día, en horas o minutos.
 * @param {number} segundos
 */
export function faltan(segundos) {
  const s = Math.max(0, Math.floor(segundos));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const t =
    d > 0
      ? contar(d, 'día', 'días') + (h > 0 ? ` y ${contar(h, 'hora', 'horas')}` : '')
      : h > 0
        ? contar(h, 'hora', 'horas')
        : contar(Math.max(m, 1), 'minuto', 'minutos');
  return (/^1 /.test(t) ? 'Falta ' : 'Faltan ') + t;
}

/** "312" → "312", 1024 → "1,024" (es-MX). @param {number} n */
export const cifra = (n) => n.toLocaleString('es-MX');

/** @param {number} n */
export const recuerdos = (n) => `${cifra(n)} ${n === 1 ? 'recuerdo compartido' : 'recuerdos compartidos'}`;

/* ─── Textos de la subida que dependen de los números ─────────────────────── */

export const textos = {
  /** @param {number} k @param {number} n */
  subiendo: (k, n) => `Subiendo ${k} de ${n}`,
  /** @param {number} k @param {number} n */
  enPausa: (k, n) => `En pausa · ${k} de ${n}`,
  /** @param {number} k @param {number} n */
  compartidas: (k, n) => `${k} de ${n} ${k === 1 ? 'compartida' : 'compartidas'}`,
  /** @param {number} k */
  listas: (k) => contar(k, 'foto compartida', 'fotos compartidas'),
  /** @param {number} k */
  rechazadas: (k) => (k === 1 ? '1 archivo no se pudo compartir' : `${k} archivos no se pudieron compartir`),
  /** @param {number} k */
  fallidas: (k) => (k === 1 ? 'Una foto no se pudo guardar' : `${k} fotos no se pudieron guardar`),
  razones: {
    video: 'es un video',
    tamano: `pesa más de ${LIMITE_MB} MB`,
    tipo: 'no es una foto',
    lectura: 'no se pudo abrir',
  },
};

/* ─── Muestra del lienzo (páginas de prueba y revisión visual; nunca en producción) ── */

// "Fotos" de muestra: los degradados con que el lienzo dibuja las miniaturas y las historias.
const g = [
  'radial-gradient(circle at 22% 30%, rgba(255,214,150,.9) 0 3%, transparent 9%), radial-gradient(circle at 72% 22%, rgba(255,190,120,.75) 0 4%, transparent 12%), radial-gradient(circle at 46% 64%, rgba(214,163,166,.6) 0 7%, transparent 20%), radial-gradient(130% 90% at 50% 100%, #5a3a4a 0%, #2a2338 55%, #141a2a 100%)',
  'radial-gradient(circle at 64% 34%, rgba(255,226,170,.85) 0 5%, transparent 14%), radial-gradient(circle at 26% 58%, rgba(159,180,218,.6) 0 6%, transparent 18%), radial-gradient(circle at 80% 76%, rgba(255,200,130,.5) 0 3%, transparent 10%), linear-gradient(170deg, #2b3a5c 0%, #1a2238 60%, #10151f 100%)',
  'radial-gradient(circle at 50% 40%, rgba(255,232,190,.9) 0 8%, rgba(255,200,130,.35) 20%, transparent 42%), radial-gradient(circle at 18% 18%, rgba(255,214,150,.6) 0 3%, transparent 9%), linear-gradient(160deg, #4a3326 0%, #2a1f22 55%, #141a2a 100%)',
  'radial-gradient(circle at 30% 70%, rgba(214,163,166,.7) 0 5%, transparent 15%), radial-gradient(circle at 70% 40%, rgba(232,207,156,.8) 0 4%, transparent 12%), radial-gradient(circle at 54% 18%, rgba(255,240,210,.6) 0 2%, transparent 7%), linear-gradient(180deg, #3a2e4a 0%, #1d2033 70%, #0f1522 100%)',
  'radial-gradient(circle at 40% 30%, rgba(255,214,150,.8) 0 3%, transparent 10%), radial-gradient(circle at 62% 62%, rgba(255,226,170,.7) 0 9%, transparent 24%), linear-gradient(150deg, #2f4a78 0%, #1f2d44 50%, #121826 100%)',
];

/**
 * @typedef {Object} Foto
 * @property {string} id
 * @property {string} [src] foto comprimida (lado largo ~2000 px)
 * @property {string} [miniatura] miniatura (tira, fondo desenfocado, precarga)
 * @property {string} [fondo] sólo en la muestra: el degradado que el lienzo usa en lugar de una foto
 * @property {string | null} [familia] quién la compartió (null con el enlace general)
 * @property {string} [subida] instante ISO en que llegó
 */

/** @type {(i: number) => Foto} */
const deMuestra = (i) => ({ id: `muestra-${i + 1}`, fondo: g[i] });

export const muestra = {
  familia: 'Familia García',
  total: 128,
  totalCerrada: 312,
  /** "Tus fotos" en el orden del lienzo. */
  mias: [0, 1, 2, 3, 4].map(deMuestra),
  /** Éxito: las tres nuevas primero (con palomita), luego las de antes. */
  miasListo: [2, 3, 4, 0, 1].map(deMuestra),
  nuevasListo: ['muestra-3', 'muestra-4', 'muestra-5'],
  /** La foto que falló al guardar. */
  fallida: deMuestra(2),
  rechazadas: [
    { nombre: 'IMG_4022.MOV', razon: textos.razones.video },
    { nombre: 'IMG_4021.JPG', razon: textos.razones.tamano },
  ],
  /** Historias del lienzo: la primera es una foto real, las demás sus degradados. */
  historias: /** @type {Foto[]} */ ([
    { id: 'h1', familia: 'Familia García', subida: '2027-02-20T18:42:00-06:00' },
    { id: 'h2', fondo: g[0], familia: 'Familia Munguía Ruiz', subida: '2027-02-20T21:07:00-06:00' },
    { id: 'h3', fondo: g[1], familia: 'Tía Lupita', subida: '2027-02-20T21:43:00-06:00' },
    { id: 'h4', fondo: g[2], familia: 'Familia Ascencio', subida: '2027-02-20T22:31:00-06:00' },
    { id: 'h5', fondo: g[3], familia: 'Sr. y Sra. López', subida: '2027-02-20T22:58:00-06:00' },
    { id: 'h6', fondo: g[4], familia: 'Familia Guerrero', subida: '2027-02-20T23:15:00-06:00' },
  ]),
};
