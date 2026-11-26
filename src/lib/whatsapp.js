// Enlace a WhatsApp de los novios ("Pídenoslo / Escríbenos por WhatsApp"). El número viene de la variable de entorno
// WHATSAPP_NOVIOS (astro.config.mjs) para no dejarlo en el repo, que es público.

/**
 * @param {string | undefined} numero formato internacional sin "+" ni espacios (52 + 10 dígitos en México)
 * @returns {string} enlace wa.me; sin un número válido, abre WhatsApp sin destinatario
 */
export function enlaceWhatsapp(numero) {
  const limpio = (numero ?? '').replace(/\D/g, '');
  return `https://wa.me/${/^[1-9]\d{9,14}$/.test(limpio) ? limpio : ''}`;
}
