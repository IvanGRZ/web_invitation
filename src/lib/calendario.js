// Archivo de calendario (iCalendar, RFC 5545) de la boda para "Agregar al calendario".
// Utilidad pura: recibe los datos ya validados y devuelve el texto del .ics.
// iPhone lo abre directo en Calendario; Android y computadora lo importan desde el archivo.

/**
 * Instante en UTC con el formato de iCalendar: 20270221T000000Z.
 * @param {string | Date} instante
 */
function utc(instante) {
  return new Date(instante).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Escapa un texto para iCalendar (\ ; , y saltos de línea).
 * @param {string} texto
 */
function escapar(texto) {
  return texto.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/**
 * Corta una línea en renglones de 75 octetos como máximo (los siguientes empiezan con un espacio),
 * sin partir caracteres de varios bytes (acentos).
 * @param {string} linea
 */
function doblar(linea) {
  const codificador = new TextEncoder();
  const renglones = [];
  let actual = '';
  let bytes = 0;
  for (const caracter of linea) {
    const n = codificador.encode(caracter).length;
    const limite = renglones.length === 0 ? 75 : 74; // los renglones de continuación llevan un espacio al inicio
    if (bytes + n > limite) {
      renglones.push(actual);
      actual = '';
      bytes = 0;
    }
    actual += caracter;
    bytes += n;
  }
  renglones.push(actual);
  return renglones.join('\r\n ');
}

/**
 * @typedef {Object} EventoCalendario
 * @property {string} uid identificador estable del evento
 * @property {string} titulo
 * @property {string} inicio instante ISO con offset
 * @property {string} fin instante ISO con offset
 * @property {string} lugar
 * @property {string} descripcion
 * @property {string} creado instante ISO fijo (DTSTAMP), para que el archivo no cambie en cada build
 */

/**
 * @param {EventoCalendario} e
 * @returns {string}
 */
export function crearIcs(e) {
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ivan y Emma//Invitacion//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.uid}`,
    `DTSTAMP:${utc(e.creado)}`,
    `DTSTART:${utc(e.inicio)}`,
    `DTEND:${utc(e.fin)}`,
    `SUMMARY:${escapar(e.titulo)}`,
    `LOCATION:${escapar(e.lugar)}`,
    `DESCRIPTION:${escapar(e.descripcion)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lineas.map(doblar).join('\r\n') + '\r\n';
}
