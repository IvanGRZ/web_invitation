import { describe, expect, it } from 'vitest';
import { CodigoSchema, normalizarCodigo, tieneFormatoDeCodigo } from './codigo.js';
import { estaAbierta, estadoDeConfirmacion, limpiarMensaje, MENSAJE_MAX, nombreCorto, paraQuien, validarRespuesta } from './confirmacion.js';
import { cuentaComoApertura, esVistaPrevia, esVistaPreviaDeEnlace } from './aperturas.js';
import { ErrorDeDominio } from './errores.js';
import * as pantalla from '@/screens/confirmacion/confirmacion.data.js';

const LIMITE = '2027-01-15T23:59:59-06:00';

describe('código', () => {
  it('normaliza minúsculas, guion y espacios', () => {
    expect(normalizarCodigo(' k7m2-pq9x ')).toBe('K7M2PQ9X');
    expect(normalizarCodigo('K7M2 PQ9X')).toBe('K7M2PQ9X');
  });
  it('acepta sólo 8 caracteres del alfabeto sin ambiguos', () => {
    expect(tieneFormatoDeCodigo('K7M2PQ9X')).toBe(true);
    expect(tieneFormatoDeCodigo('K7M2PQ9')).toBe(false);
    for (const ambiguo of ['0', 'O', '1', 'I', 'L']) expect(tieneFormatoDeCodigo(`K7M2PQ9${ambiguo}`)).toBe(false);
  });
  it('CodigoSchema normaliza y rechaza formatos inválidos', () => {
    expect(CodigoSchema.parse('k7m2-pq9x')).toBe('K7M2PQ9X');
    expect(CodigoSchema.safeParse('hola').success).toBe(false);
    expect(CodigoSchema.safeParse('K7M2PQ9O').success).toBe(false);
  });
});

describe('fecha límite', () => {
  it('el último segundo del 15 de enero todavía cuenta (hora de Guadalajara)', () => {
    expect(estaAbierta(new Date('2027-01-15T23:59:59-06:00'), LIMITE)).toBe(true);
    expect(estaAbierta(new Date('2027-01-16T00:00:00-06:00'), LIMITE)).toBe(false);
    // Las 00:30 UTC del 16 son todavía las 18:30 del 15 en Guadalajara.
    expect(estaAbierta(new Date('2027-01-16T00:30:00Z'), LIMITE)).toBe(true);
  });
  it('estado: pasos, regreso o cerrada', () => {
    const antes = new Date('2026-12-15T12:00:00-06:00');
    const despues = new Date('2027-02-01T12:00:00-06:00');
    const respuesta = { asiste: true, invitados: 2, asistentes: ['p1', 'p2'], recibida: '2026-12-12T12:00:00-06:00' };
    expect(estadoDeConfirmacion({ respuesta: null, ahora: antes, limite: LIMITE })).toBe('pasos');
    expect(estadoDeConfirmacion({ respuesta, ahora: antes, limite: LIMITE })).toBe('regreso');
    expect(estadoDeConfirmacion({ respuesta, ahora: despues, limite: LIMITE })).toBe('cerrada');
    expect(estadoDeConfirmacion({ respuesta: null, ahora: despues, limite: LIMITE })).toBe('cerrada');
  });
});

describe('respuesta', () => {
  const invitacion = { personas: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }] };
  it('asisten personas de la invitación, sin repetir', () => {
    expect(validarRespuesta({ asiste: true, asistentes: ['p1', 'p3', 'p1'] }, invitacion)).toEqual({ asistentes: ['p1', 'p3'], mensaje: undefined });
  });
  it('rechaza personas de otra invitación o ninguna si asisten', () => {
    expect(() => validarRespuesta({ asiste: true, asistentes: ['p1', 'p9'] }, invitacion)).toThrow(ErrorDeDominio);
    expect(() => validarRespuesta({ asiste: true, asistentes: [] }, invitacion)).toThrow(ErrorDeDominio);
  });
  it('si no asisten, nadie va aunque vengan personas marcadas', () => {
    expect(validarRespuesta({ asiste: false, asistentes: ['p1', 'p2'] }, invitacion).asistentes).toEqual([]);
  });
  it('mensaje: recortado, \r\n cuenta como uno y máximo 500', () => {
    expect(limpiarMensaje('  hola \r\n adiós  ')).toBe('hola \n adiós');
    expect(limpiarMensaje('   ')).toBeUndefined();
    const conSaltos = 'a\r\n'.repeat(250).trim(); // 749 con \r\n, 499 sin \r
    expect(validarRespuesta({ asiste: false, asistentes: [], mensaje: conSaltos }, invitacion).mensaje).toHaveLength(499);
    expect(() => validarRespuesta({ asiste: false, asistentes: [], mensaje: 'x'.repeat(MENSAJE_MAX + 1) }, invitacion)).toThrow(ErrorDeDominio);
  });
  it('el mensaje máximo coincide con el de la pantalla', () => {
    expect(pantalla.MENSAJE_MAX).toBe(MENSAJE_MAX);
  });
  it('nombre bajo la silla y para quién es la invitación', () => {
    expect(nombreCorto({ nombre: 'María Fernanda', primerApellido: 'García' })).toBe('María Fernanda García');
    expect(nombreCorto({ nombre: 'Miriam' })).toBe('Miriam');
    expect(paraQuien('Familia García')).toBe('la Familia García');
    expect(paraQuien('Juan Pérez y Ana Ruiz')).toBe('Juan Pérez y Ana Ruiz');
  });
});

describe('aperturas', () => {
  const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
  it('no cuentan las vistas previas ni los robots', () => {
    expect(esVistaPrevia('WhatsApp/2.23.20.0 A')).toBe(true);
    expect(esVistaPrevia('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)')).toBe(true);
    expect(esVistaPrevia('TelegramBot (like TwitterBot)')).toBe(true);
    expect(esVistaPrevia(undefined)).toBe(true);
    expect(esVistaPrevia(iphone)).toBe(false);
  });
  it('sólo cuenta un GET de una persona', () => {
    expect(cuentaComoApertura({ metodo: 'GET', userAgent: iphone })).toBe(true);
    expect(cuentaComoApertura({ metodo: 'HEAD', userAgent: iphone })).toBe(false);
    expect(cuentaComoApertura({ metodo: 'POST', userAgent: iphone })).toBe(false);
  });
  it('quita el noindex sólo a las vistas previas de los chats, nunca a los buscadores', () => {
    expect(esVistaPreviaDeEnlace('WhatsApp/2.23.20.0 A')).toBe(true);
    expect(esVistaPreviaDeEnlace('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)')).toBe(true);
    expect(esVistaPreviaDeEnlace('TelegramBot (like TwitterBot)')).toBe(true);
    expect(esVistaPreviaDeEnlace('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(false);
    expect(esVistaPreviaDeEnlace('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(false);
    expect(esVistaPreviaDeEnlace('Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML, like Gecko) Applebot/0.1')).toBe(false);
    expect(esVistaPreviaDeEnlace(iphone)).toBe(false);
    expect(esVistaPreviaDeEnlace(undefined)).toBe(false);
  });
});
