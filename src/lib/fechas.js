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
 * @param {{ mayuscula?: boolean, diaSemana?: boolean, anio?: boolean }} [opciones] mayuscula: capitaliza la primera
 *   letra (inicio de frase); diaSemana: false omite el día ("15 de enero de 2027", como la fecha límite del cierre);
 *   anio: false omite el año ("sábado 20 de febrero", como en la galería de la boda)
 * @returns {string} p. ej. "sábado 20 de febrero de 2027"
 */
export function fechaLarga(instante, { mayuscula = false, diaSemana = true, anio = true } = {}) {
  /** @type {Record<string, string>} */
  const partes = {};
  for (const { type, value } of formatoFecha.formatToParts(new Date(instante))) {
    partes[type] = value;
  }
  const dia = `${partes.day} de ${partes.month}${anio ? ` de ${partes.year}` : ''}`;
  const texto = diaSemana ? `${partes.weekday} ${dia}` : dia;
  return mayuscula ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
}

/**
 * @param {string | Date} instante
 * @returns {string} p. ej. "18:00 hrs"
 */
export function hora(instante) {
  return `${horaReloj(instante)} hrs`;
}

/**
 * Hora sola, como en un programa impreso (itinerario).
 * @param {string | Date} instante
 * @returns {string} p. ej. "19:30"
 */
export function horaReloj(instante) {
  return formatoHora.format(new Date(instante));
}

const formatoHoja = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', timeZone: ZONA });

/**
 * Día y mes abreviado, como en una hoja de calendario.
 * @param {string | Date} instante
 * @returns {{ dia: string, mes: string }} p. ej. { dia: "15", mes: "ENE" }
 */
export function hojaDeCalendario(instante) {
  /** @type {Record<string, string>} */
  const partes = {};
  for (const { type, value } of formatoHoja.formatToParts(new Date(instante))) {
    partes[type] = value;
  }
  return { dia: partes.day, mes: partes.month.replace('.', '').toUpperCase() };
}
