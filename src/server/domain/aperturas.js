// Registro de aperturas (docs/invitaciones.md, tarea 4) y límite de intentos del candado.

/** Intentos fallidos del candado por IP en una hora (docs/invitaciones.md: "p. ej. 10 por hora"). */
export const INTENTOS_MAX = 10;
export const VENTANA_INTENTOS_MS = 60 * 60 * 1000;

// Vistas previas y robots: WhatsApp pide la página al escribir el mensaje, antes de enviarlo.
const VISTA_PREVIA =
  /whatsapp|facebookexternalhit|facebot|meta-externalagent|telegrambot|twitterbot|slackbot|discordbot|linkedinbot|skypeuripreview|applebot|googlebot|bingbot|embedly|preview|bot\b|crawler|spider/i;

/**
 * ¿La petición viene de una vista previa o de un robot? Sin User-Agent también cuenta como robot.
 * @param {string | null | undefined} userAgent
 */
export function esVistaPrevia(userAgent) {
  return !userAgent || VISTA_PREVIA.test(userAgent);
}

/**
 * ¿Cuenta esta visita como apertura del enlace? Sólo GET de una persona (HEAD lo usan los robots).
 * @param {{ metodo: string, userAgent: string | null | undefined }} visita
 */
export function cuentaComoApertura({ metodo, userAgent }) {
  return metodo === 'GET' && !esVistaPrevia(userAgent);
}
