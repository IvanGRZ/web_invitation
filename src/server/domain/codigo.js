// Código de la invitación (CLAUDE.md § 7 › Datos): 8 caracteres de un alfabeto de 31 sin ambiguos
// (sin 0/O, 1/I/L), aleatorio. Se guarda sin guion y se imprime en dos bloques: K7M2-PQ9X.
import { z } from 'astro/zod';

export const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const CODIGO_LARGO = 8;

/**
 * Deja sólo letras y números en mayúsculas: acepta minúsculas, guion y espacios ("k7m2-pq9x").
 * @param {unknown} texto
 */
export function normalizarCodigo(texto) {
  return String(texto ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

/**
 * ¿Tiene el formato de un código? (no dice si existe)
 * @param {string} codigo ya normalizado
 */
export function tieneFormatoDeCodigo(codigo) {
  return codigo.length === CODIGO_LARGO && [...codigo].every((c) => ALFABETO.includes(c));
}

/** Código de una ruta o de un formulario: normalizado y con formato válido. */
export const CodigoSchema = z
  .string()
  .max(32)
  .transform(normalizarCodigo)
  .refine(tieneFormatoDeCodigo, { message: 'Código con formato inválido' });
