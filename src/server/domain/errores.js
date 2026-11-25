// Errores de dominio: los lanza el dominio o el servicio y los traduce el transporte
// (Action → ActionError; página → 404 o estado de la pantalla). No saben de HTTP.

/**
 * @typedef {'codigo-inexistente' | 'demasiados-intentos' | 'cerrada' | 'respuesta-invalida'} TipoError
 */

export class ErrorDeDominio extends Error {
  /**
   * @param {TipoError} tipo
   * @param {string} mensaje
   */
  constructor(tipo, mensaje) {
    super(mensaje);
    this.name = 'ErrorDeDominio';
    this.tipo = tipo;
  }
}
