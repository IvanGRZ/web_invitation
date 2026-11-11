// Cálculo de la cuenta regresiva. Función pura (sin reloj ni DOM) para poder probarla.

/**
 * @typedef {Object} Desglose
 * @property {number} dias
 * @property {number} horas
 * @property {number} minutos
 * @property {number} segundos
 * @property {boolean} terminado true cuando ya llegó el momento
 */

/**
 * @param {number} objetivoMs instante objetivo en milisegundos (Date.parse)
 * @param {number} ahoraMs instante actual en milisegundos
 * @returns {Desglose}
 */
export function desglosar(objetivoMs, ahoraMs) {
  const total = Math.max(0, Math.floor((objetivoMs - ahoraMs) / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
    terminado: total === 0,
  };
}

/** @param {number} n */
export const dosDigitos = (n) => String(n).padStart(2, '0');
