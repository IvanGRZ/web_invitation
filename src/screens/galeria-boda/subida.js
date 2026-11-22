// Subida de fotos desde el navegador (docs/pantallas.md § 6.9 › Almacenamiento). Sólo cliente.
// 1. validar(): antes de subir, en el navegador (el servidor vuelve a validar tipo y tamaño).
// 2. comprimir(): lado largo de ~2000 px en JPEG al 80 % y una miniatura chica. Al redibujar en un canvas se
//    pierden los metadatos (ubicación incluida). La orientación de la cámara se respeta.
// 3. subir(): TODO(backend) Supabase Storage vía nuestro servidor (Action o endpoint), con el código de la familia
//    si lo hay. Mientras no exista, falla como "problema nuestro" (la galería no abre antes del 20 de febrero).
import { CALIDAD, LADO_LARGO, LADO_MINIATURA, LIMITE_BYTES, textos } from './galeria-boda.data.js';

/** Error de red (sin señal): la foto vuelve a la cola y se reintenta sola al volver la conexión. */
export class SinSenal extends Error {}

/**
 * Razón por la que un archivo no se puede compartir, o null si se puede.
 * `accept="image/*"` ya filtra en el selector, pero no al arrastrar ni en todos los navegadores.
 * @param {File} archivo
 */
export function validar(archivo) {
  const tipo = archivo.type || '';
  const nombre = archivo.name.toLowerCase();
  if (tipo.startsWith('video/') || /\.(mov|mp4|m4v|avi|webm|3gp|mkv)$/.test(nombre)) return textos.razones.video;
  if (!tipo.startsWith('image/') && !/\.(heic|heif)$/.test(nombre)) return textos.razones.tipo;
  if (archivo.size > LIMITE_BYTES) return textos.razones.tamano;
  return null;
}

/**
 * @param {ImageBitmap} imagen
 * @param {number} lado lado largo máximo
 * @param {number} calidad
 * @returns {Promise<Blob>}
 */
function redibujar(imagen, lado, calidad) {
  const escala = Math.min(1, lado / Math.max(imagen.width, imagen.height));
  const w = Math.round(imagen.width * escala);
  const h = Math.round(imagen.height * escala);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(imagen, 0, 0, w, h);
  return new Promise((resolver, rechazar) =>
    canvas.toBlob((b) => (b ? resolver(b) : rechazar(new Error('toBlob'))), 'image/jpeg', calidad),
  );
}

/**
 * Comprime la foto y genera su miniatura. Falla si el navegador no puede abrirla (p. ej. HEIC fuera de Safari).
 * @param {File} archivo
 * @returns {Promise<{ foto: Blob, miniatura: Blob }>}
 */
export async function comprimir(archivo) {
  const imagen = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
  try {
    const foto = await redibujar(imagen, LADO_LARGO, CALIDAD);
    const miniatura = await redibujar(imagen, LADO_MINIATURA, 0.7);
    return { foto, miniatura };
  } finally {
    imagen.close();
  }
}

/**
 * @typedef {Object} Envio
 * @property {Blob} foto
 * @property {Blob} miniatura
 * @property {(avance: number) => void} alAvanzar avance de 0 a 1
 */

/**
 * Sube una foto ya comprimida. Resuelve cuando quedó guardada (y publicada: no hay revisión).
 * Rechaza con SinSenal si no hay conexión; con cualquier otro error si falló al guardar.
 * TODO(backend): enviar a nuestro servidor (con el código de /i/<codigo>, si lo hay), que valida la hora de
 * apertura y cierre, el tipo y el tamaño, y guarda en Supabase Storage con caché larga.
 * @param {Envio} envio
 * @returns {Promise<{ id: string }>}
 */
export async function subir(envio) {
  if (!navigator.onLine) throw new SinSenal();
  void envio;
  throw new Error('Subida de fotos pendiente del backend');
}

/**
 * Subida simulada para las páginas de prueba (sólo dev): tarda `demoraMs`, avanza poco a poco y falla las
 * primeras `fallar` veces. Respeta la señal real del navegador (para probar "Sin señal").
 * @param {{ demoraMs?: number, fallar?: number }} [opciones]
 */
export function subidaSimulada({ demoraMs = 1200, fallar = 0 } = {}) {
  let fallas = fallar;
  let n = 0;
  /** @param {Envio} envio */
  return async function subirSimulado({ alAvanzar }) {
    if (!navigator.onLine) throw new SinSenal();
    const pasos = 6;
    for (let i = 1; i <= pasos; i++) {
      await new Promise((r) => setTimeout(r, demoraMs / pasos));
      if (!navigator.onLine) throw new SinSenal();
      alAvanzar(i / pasos);
    }
    if (fallas > 0) {
      fallas -= 1;
      throw new Error('Falla simulada');
    }
    n += 1;
    return { id: `simulada-${n}` };
  };
}
