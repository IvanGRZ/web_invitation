// Pantalla 3 · Ceremonia y recepción: datos de diseño de los tableros del lienzo
// (CeremoniaC 390×1056 y CeremoniaEscritorio 1440×900). Coordenadas en pixeles del tablero.

/** Cortes de línea de los nombres de los lugares, como en el tablero (se valida contra config/evento.js). */
export const nombresEnLineas = {
  ceremonia: ['Templo Expiatorio Eucarístico', 'de Guadalajara'],
  recepcion: ['Mansión Magnolia'],
};

/** Iconos de los medallones (trazos dorados que se dibujan al entrar). */
export const iconos = {
  templo: {
    viewBox: '0 0 48 64',
    trazos: ['M24 2v7M21 5.5h6M24 9l5 12v6l5 5v30H14V32l5-5v-6z', 'M20 62V48q4-7 8 0v14M24 27a3 3 0 1 1 0 .1M14 40H8v22h6M34 40h6v22h-6'],
  },
  mansion: {
    viewBox: '0 0 64 56',
    trazos: ['M6 20L32 6l26 14zM10 20v26M20 20v26M44 20v26M54 20v26M3 48h58M6 53h52', 'M28 46V34q4-6 8 0v12M32 14.5a2 2 0 1 1 0 .1'],
  },
};

/**
 * Ola dorada que une los dos medallones. Alrededor de "y a continuación" la línea sólida se oculta con un
 * degradado radial (elipse `corte`) y una copia punteada aparece sólo en el anillo de transición.
 * `trazo`: grosor de la línea; `revelado`: grosor de la máscara que la va descubriendo.
 */
export const olas = {
  celular: {
    ancho: 390,
    alto: 1056,
    curva: 'M76 330 C 76 430 36 466 50 508 C 62 540 130 551 195 551 C 260 551 328 562 340 594 C 352 632 314 670 314 772',
    corte: { cx: 195, cy: 551, rx: 132, ry: 46 },
    trazo: 1.4,
    revelado: 16,
  },
  computadora: {
    ancho: 1440,
    alto: 900,
    curva: 'M260 402 C 260 474 332 516 470 520 C 560 522 640 520 720 520 C 800 520 880 518 970 520 C 1108 522 1180 530 1180 552',
    corte: { cx: 720, cy: 520, rx: 170, ry: 46 },
    trazo: 1.5,
    revelado: 18,
  },
};
