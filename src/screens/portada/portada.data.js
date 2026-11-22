// Pantalla 1 · Portada: composición del fondo de velas en los tableros del lienzo
// (Velas 390×844 y PortadaEscritorio 1440×900). Coordenadas en pixeles del tablero.

/** Tablero de celular (Velas). */
export const fondoCelular = {
  forma: '120% 70%',
  luz: { top: -110, size: 540, alpha: 0.36 },
  halos: [{ left: -130, bottom: 140, size: 360, alpha: 0.55 }],
  destellos: [
    { left: 34, top: 250, size: 10, blur: 2, opacity: 0.55 },
    { right: 36, top: 150, size: 16, blur: 4, opacity: 0.4, duration: 12, delay: -3 },
    { right: 56, top: 520, size: 7, color: 'rose', blur: 1.5, opacity: 0.6, duration: 10, delay: -6 },
    { left: 62, top: 92, size: 6, blur: 1, opacity: 0.5, duration: 14, delay: -2 },
    { left: 30, top: 610, size: 12, blur: 3, opacity: 0.35, duration: 11, delay: -8 },
  ],
};

/** Tablero de computadora (PortadaEscritorio): luz, halos y destellos repartidos en todo el ancho. */
export const fondoComputadora = {
  forma: '110% 80%',
  luz: { top: -150, size: 720, alpha: 0.34 },
  halos: [
    { left: 160, top: 380, size: 520, alpha: 0.5 },
    { right: -200, bottom: -200, size: 620, alpha: 0.32 },
  ],
  destellos: [
    { left: 470, top: 70, size: 7, blur: 1, opacity: 0.5, duration: 14, delay: -2 },
    { left: 880, top: 140, size: 16, blur: 4, opacity: 0.45, duration: 12, delay: -3 },
    { left: 420, top: 240, size: 10, blur: 2, opacity: 0.55 },
    { left: 430, top: 630, size: 12, blur: 3, opacity: 0.4, duration: 11, delay: -8 },
    { left: 1000, top: 560, size: 7, color: 'rose', blur: 1.5, opacity: 0.6, duration: 10, delay: -6 },
    { left: 170, top: 380, size: 12, blur: 2.5, opacity: 0.35, duration: 12, delay: -3 },
    { left: 1270, top: 300, size: 9, blur: 2, opacity: 0.4 },
    { left: 1180, top: 720, size: 11, blur: 2.5, opacity: 0.35, duration: 14, delay: -2 },
  ],
};
