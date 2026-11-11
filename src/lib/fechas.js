// Formato de fechas en español de México (CLAUDE.md § 4):
// "sábado 20 de febrero de 2027" (sin coma tras el día) y "18:00 hrs".
// Utilidad pura: sirve en servidor y en cliente.

const ZONA = 'America/Mexico_City';

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: ZONA,
});

const formatoHora = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: ZONA,
});

/**
 * @param {string | Date} instante
 * @param {{ mayuscula?: boolean }} [opciones] mayuscula: capitaliza la primera letra (inicio de frase)
 * @returns {string} p. ej. "sábado 20 de febrero de 2027"
 */
export function fechaLarga(instante, { mayuscula = false } = {}) {
  /** @type {Record<string, string>} */
  const partes = {};
  for (const { type, value } of formatoFecha.formatToParts(new Date(instante))) {
    partes[type] = value;
  }
  const texto = `${partes.weekday} ${partes.day} de ${partes.month} de ${partes.year}`;
  return mayuscula ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
}

/**
 * @param {string | Date} instante
 * @returns {string} p. ej. "18:00 hrs"
 */
export function hora(instante) {
  return `${formatoHora.format(new Date(instante))} hrs`;
}
