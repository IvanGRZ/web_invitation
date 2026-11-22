// Pantalla 2 · Bienvenida: datos de diseño de los tableros del lienzo
// (BienvenidaPostal 390×844 y BienvenidaD 1440×900). Coordenadas en pixeles del tablero.

/** Destellos del tablero de celular: 3 en la franja de noche y 8 sobre la foto. */
export const destellosCelular = [
  { left: 30, top: 30, size: 7, color: '#e8cf9c', blur: 1.5, opacity: 0.5 },
  { left: 344, top: 70, size: 12, color: '#e8cf9c', blur: 3, opacity: 0.4, duration: 14, delay: -4 },
  { left: 300, top: 22, size: 6, color: '#e8cf9c', blur: 1, opacity: 0.5, duration: 13, delay: -2 },
  { left: 12, top: 210, size: 11, color: '#f6e3b4', blur: 2, opacity: 0.8, duration: 12, delay: -3, glow: true },
  { left: 64, top: 300, size: 7, color: '#fbefd2', blur: 1, opacity: 0.9, duration: 10, delay: -6, glow: true },
  { left: 22, top: 420, size: 15, color: '#f6e3b4', blur: 3, opacity: 0.65, duration: 15, delay: -1, glow: true },
  { left: 86, top: 500, size: 8, color: '#f3d2d4', blur: 1.2, opacity: 0.85, duration: 13, delay: -8, glow: true },
  { left: 352, top: 180, size: 10, color: '#fbefd2', blur: 1.5, opacity: 0.85, duration: 11, delay: -5, glow: true },
  { left: 360, top: 330, size: 14, color: '#f6e3b4', blur: 3, opacity: 0.7, duration: 14, delay: -2, glow: true },
  { left: 338, top: 470, size: 7, color: '#fbefd2', blur: 1, opacity: 0.9, duration: 9, delay: -4, glow: true },
  { left: 188, top: 96, size: 8, color: '#f6e3b4', blur: 1.2, opacity: 0.8, duration: 16, delay: -7, glow: true },
];

/** Destellos del tablero de computadora: 12 en el cielo y las orillas. */
export const destellosComputadora = [
  { left: 90, top: 70, size: 9, color: '#e8cf9c', blur: 1.5, opacity: 0.6, duration: 12, delay: -3, glow: true },
  { left: 1310, top: 110, size: 14, color: '#e8cf9c', blur: 3, opacity: 0.45, duration: 14, delay: -6, glow: true },
  { left: 720, top: 40, size: 7, color: '#e8cf9c', blur: 1, opacity: 0.55, duration: 16, delay: -2, glow: true },
  { left: 60, top: 250, size: 12, color: '#f6e3b4', blur: 2, opacity: 0.8, duration: 13, delay: -5, glow: true },
  { left: 210, top: 520, size: 8, color: '#fbefd2', blur: 1.2, opacity: 0.85, duration: 10, delay: -8, glow: true },
  { left: 560, top: 210, size: 10, color: '#f6e3b4', blur: 1.5, opacity: 0.8, duration: 15, delay: -1, glow: true },
  { left: 620, top: 470, size: 16, color: '#f6e3b4', blur: 3, opacity: 0.65, duration: 12, delay: -4, glow: true },
  { left: 380, top: 560, size: 7, color: '#f3d2d4', blur: 1, opacity: 0.9, duration: 9, delay: -7, glow: true },
  { left: 1250, top: 300, size: 11, color: '#fbefd2', blur: 2, opacity: 0.8, duration: 11, delay: -3, glow: true },
  { left: 1360, top: 470, size: 15, color: '#f6e3b4', blur: 3, opacity: 0.65, duration: 14, delay: -9, glow: true },
  { left: 1200, top: 560, size: 7, color: '#fbefd2', blur: 1, opacity: 0.9, duration: 10, delay: -2, glow: true },
  { left: 960, top: 120, size: 8, color: '#f6e3b4', blur: 1.2, opacity: 0.8, duration: 13, delay: -6, glow: true },
];

/** Olas marfil que cubren la base de la foto. viewBox empieza donde empieza el velo y baja 2 px más
 *  que la foto, para que el borde inferior del SVG nunca deje asomar una línea de la foto. */
export const olas = {
  celular: {
    viewBox: '0 430 390 152',
    velo: { y: 430, width: 390, height: 110 },
    curva: 'M0 536 C 110 498 250 572 390 512 V582 H0Z',
  },
  computadora: {
    viewBox: '0 520 1440 142',
    velo: { y: 520, width: 1440, height: 110 },
    curva: 'M0 634 C 360 572 900 676 1440 600 V662 H0Z',
  },
};
