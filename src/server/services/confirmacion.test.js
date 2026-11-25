import { beforeEach, describe, expect, it, vi } from 'vitest';
import { abrirInvitacion, confirmarAsistencia, entrarConCodigo, registrarApertura } from './confirmacion.js';
import { ErrorDeDominio } from '@/server/domain/errores.js';
import { INTENTOS_MAX } from '@/server/domain/aperturas.js';

const LIMITE = '2027-01-15T23:59:59-06:00';
const ANTES = new Date('2026-12-15T12:00:00-06:00');
const DESPUES = new Date('2027-01-16T00:00:00-06:00');
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';

/** Repositorio en memoria con la misma forma que repositorioInvitados. */
function repositorioFalso() {
  const persona = (id) => ({ id, nombre: id, primerApellido: 'García', rol: 'titular' });
  /** @type {Map<string, any>} */
  const invitados = new Map([
    ['K7M2PQ9X', { id: 'g1', codigo: 'K7M2PQ9X', etiqueta: 'Familia García', personas: ['p1', 'p2', 'p3', 'p4'].map(persona), respuesta: null }],
    ['VACIA222', { id: 'g2', codigo: 'VACIA222', etiqueta: 'Familia Vacía', personas: [], respuesta: null }],
  ]);
  /** @type {{ huella: string, cuando: Date }[]} */
  const intentos = [];
  return {
    invitados,
    intentos,
    buscarPorCodigo: vi.fn(async (codigo) => invitados.get(codigo) ?? null),
    guardarRespuesta: vi.fn(async (id, { asistentes, mensaje, recibida }) => {
      const respuesta = { asiste: asistentes.length > 0, invitados: asistentes.length, asistentes, mensaje, recibida: recibida.toISOString() };
      for (const g of invitados.values()) if (g.id === id) g.respuesta = respuesta;
      return respuesta;
    }),
    registrarApertura: vi.fn(async () => {}),
    contarIntentos: vi.fn(async (huella, desde) => intentos.filter((i) => i.huella === huella && i.cuando >= desde).length),
    registrarIntento: vi.fn(async (huella) => {
      intentos.push({ huella, cuando: new Date() });
    }),
  };
}

/** @type {ReturnType<typeof repositorioFalso>} */
let repo;
/** @type {any} */
let deps;
beforeEach(() => {
  repo = repositorioFalso();
  deps = { repositorio: repo, ahora: ANTES, limite: LIMITE };
});

describe('confirmarAsistencia', () => {
  it('guarda quiénes asisten con la hora de recepción', async () => {
    const r = await confirmarAsistencia({ codigo: 'k7m2-pq9x', asiste: true, asistentes: ['p1', 'p2', 'p3'], mensaje: ' Felicidades ' }, deps);
    expect(r).toEqual({ asiste: true, invitados: 3, asistentes: ['p1', 'p2', 'p3'], mensaje: 'Felicidades', recibida: ANTES.toISOString() });
    expect(repo.guardarRespuesta).toHaveBeenCalledWith('g1', { asistentes: ['p1', 'p2', 'p3'], mensaje: 'Felicidades', recibida: ANTES });
  });
  it('reenviar deja la última respuesta (cambiar la respuesta)', async () => {
    await confirmarAsistencia({ codigo: 'K7M2PQ9X', asiste: true, asistentes: ['p1', 'p2', 'p3'] }, deps);
    await confirmarAsistencia({ codigo: 'K7M2PQ9X', asiste: false, asistentes: [] }, deps);
    expect(repo.invitados.get('K7M2PQ9X').respuesta.asiste).toBe(false);
  });
  it('no acepta personas de otra invitación', async () => {
    await expect(confirmarAsistencia({ codigo: 'K7M2PQ9X', asiste: true, asistentes: ['p1', 'otra'] }, deps)).rejects.toMatchObject({ tipo: 'respuesta-invalida' });
    expect(repo.guardarRespuesta).not.toHaveBeenCalled();
  });
  it('código inexistente o con formato inválido', async () => {
    await expect(confirmarAsistencia({ codigo: 'K7N2PQ9X', asiste: false, asistentes: [] }, deps)).rejects.toMatchObject({ tipo: 'codigo-inexistente' });
    await expect(confirmarAsistencia({ codigo: 'hola', asiste: false, asistentes: [] }, deps)).rejects.toMatchObject({ tipo: 'codigo-inexistente' });
    expect(repo.buscarPorCodigo).toHaveBeenCalledTimes(1);
  });
  it('después de la fecha límite, cerrada', async () => {
    await expect(confirmarAsistencia({ codigo: 'K7M2PQ9X', asiste: true, asistentes: ['p1', 'p2'] }, { ...deps, ahora: DESPUES })).rejects.toMatchObject({ tipo: 'cerrada' });
    expect(repo.guardarRespuesta).not.toHaveBeenCalled();
  });
});

describe('abrirInvitacion', () => {
  it('null si el código no existe o la invitación no tiene personas', async () => {
    expect(await abrirInvitacion('K7N2PQ9X', deps)).toBeNull();
    expect(await abrirInvitacion('VACIA222', deps)).toBeNull();
  });
  it('pasos → regreso → cerrada', async () => {
    expect((await abrirInvitacion('K7M2PQ9X', deps))?.estado).toBe('pasos');
    await confirmarAsistencia({ codigo: 'K7M2PQ9X', asiste: true, asistentes: ['p1', 'p2'] }, deps);
    const abierta = await abrirInvitacion('K7M2PQ9X', deps);
    expect(abierta?.estado).toBe('regreso');
    expect(abierta?.invitacion.respuesta?.asistentes).toEqual(['p1', 'p2']);
    expect((await abrirInvitacion('K7M2PQ9X', { ...deps, ahora: DESPUES }))?.estado).toBe('cerrada');
  });
});

describe('entrarConCodigo (el candado)', () => {
  it('normaliza y devuelve el código', async () => {
    expect(await entrarConCodigo({ codigo: 'k7m2 pq9x', huella: 'ip1' }, deps)).toEqual({ codigo: 'K7M2PQ9X' });
    expect(repo.registrarIntento).not.toHaveBeenCalled();
  });
  it('una invitación sin personas cuenta como código que no existe', async () => {
    await expect(entrarConCodigo({ codigo: 'VACIA222', huella: 'ip1' }, deps)).rejects.toMatchObject({ tipo: 'codigo-inexistente' });
  });
  it('un código que no existe cuenta como intento fallido', async () => {
    await expect(entrarConCodigo({ codigo: 'K7N2PQ9X', huella: 'ip1' }, deps)).rejects.toBeInstanceOf(ErrorDeDominio);
    expect(repo.registrarIntento).toHaveBeenCalledWith('ip1');
  });
  it(`después de ${INTENTOS_MAX} fallidos en una hora, bloquea esa IP aunque el código exista`, async () => {
    for (let i = 0; i < INTENTOS_MAX; i++) {
      await expect(entrarConCodigo({ codigo: 'K7N2PQ9X', huella: 'ip1' }, { ...deps, ahora: new Date() })).rejects.toMatchObject({ tipo: 'codigo-inexistente' });
    }
    await expect(entrarConCodigo({ codigo: 'K7M2PQ9X', huella: 'ip1' }, { ...deps, ahora: new Date() })).rejects.toMatchObject({ tipo: 'demasiados-intentos' });
    // Otra IP sigue entrando.
    expect(await entrarConCodigo({ codigo: 'K7M2PQ9X', huella: 'ip2' }, { ...deps, ahora: new Date() })).toEqual({ codigo: 'K7M2PQ9X' });
  });
});

describe('registrarApertura', () => {
  const invitado = { id: 'g1', codigo: 'K7M2PQ9X', etiqueta: 'Familia García', personas: [], respuesta: null };
  it('registra la visita de una persona', async () => {
    await registrarApertura(invitado, { metodo: 'GET', userAgent: IPHONE }, deps);
    expect(repo.registrarApertura).toHaveBeenCalledWith('g1');
  });
  it('no registra la vista previa de WhatsApp', () => {
    expect(registrarApertura(invitado, { metodo: 'GET', userAgent: 'WhatsApp/2.23.20.0 A' }, deps)).toBeNull();
    expect(repo.registrarApertura).not.toHaveBeenCalled();
  });
  it('si Supabase falla, no lanza', async () => {
    repo.registrarApertura.mockRejectedValueOnce(new Error('caída'));
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(registrarApertura(invitado, { metodo: 'GET', userAgent: IPHONE }, deps)).resolves.toBeUndefined();
    error.mockRestore();
  });
});
