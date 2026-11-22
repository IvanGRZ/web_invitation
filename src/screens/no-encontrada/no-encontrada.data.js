// Pantalla general · 404 (código inexistente o ruta que no existe): composición del fondo de velas en los
// tableros del lienzo (General404 390×844 y General404-escritorio 1440×900). Coordenadas en pixeles del tablero.

/** Tablero de celular (General404). */
export const fondoCelular = {
  forma: '120% 70%',
  luz: { top: -119, size: 540, alpha: 0.34 },
  halos: [{ left: -117, bottom: 84, size: 351, alpha: 0.5 }],
  destellos: [
    { left: 35, top: 253, size: 10, blur: 2, opacity: 0.55 },
    { right: 35, top: 152, size: 16, blur: 4, opacity: 0.4, duration: 12, delay: -3 },
    { right: 55, top: 523, size: 7, color: 'rose', blur: 1.5, opacity: 0.6, duration: 10, delay: -6 },
    { left: 62, top: 93, size: 6, blur: 1, opacity: 0.5, duration: 14, delay: -2 },
    { left: 31, top: 608, size: 12, blur: 3, opacity: 0.35, duration: 11, delay: -8 },
  ],
};

/** Tablero de computadora (General404-escritorio). El halo del lienzo mide 1296 con tope de 640: queda en 640. */
export const fondoComputadora = {
  forma: '120% 70%',
  luz: { top: -190, size: 864, alpha: 0.34 },
  halos: [{ left: -432, bottom: 90, size: 640, alpha: 0.5 }],
  destellos: [
    { left: 130, top: 270, size: 10, blur: 2, opacity: 0.55 },
    { right: 130, top: 162, size: 16, blur: 4, opacity: 0.4, duration: 12, delay: -3 },
    { right: 202, top: 558, size: 7, color: 'rose', blur: 1.5, opacity: 0.6, duration: 10, delay: -6 },
    { left: 230, top: 99, size: 6, blur: 1, opacity: 0.5, duration: 14, delay: -2 },
    { left: 115, top: 648, size: 12, blur: 3, opacity: 0.35, duration: 11, delay: -8 },
  ],
};
