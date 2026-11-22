// Utilidades compartidas de la revisión visual (sólo desarrollo; no forman parte del sitio).
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = dirname(fileURLToPath(import.meta.url));
export const REF_DIR = join(RAIZ, '.ref'); // tableros del lienzo convertidos (privado: ignorado en git)
export const SALIDA = join(RAIZ, 'salida'); // capturas y reportes (ignorado en git)
export const WEB = process.env.QA_WEB || 'http://localhost:4321';
export const REF = process.env.QA_REF || 'http://localhost:4400';

/** Chrome o Edge instalados en la máquina (playwright-core no descarga navegadores). */
function navegador() {
  const candidatos = [
    process.env.QA_CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ].filter(Boolean);
  const ruta = candidatos.find((c) => existsSync(c));
  if (!ruta) throw new Error('No encontré Chrome ni Edge. Define QA_CHROME con la ruta del ejecutable.');
  return ruta;
}

export async function abrirNavegador() {
  mkdirSync(SALIDA, { recursive: true });
  return chromium.launch({ executablePath: navegador(), headless: true });
}

/** Tamaños de prueba: los de los tableros, pantallas cortas, el monitor de Ivan y tableta. */
export const TAMANOS = {
  celular: { width: 390, height: 844, movil: true },
  celularAlto: { width: 390, height: 1056, movil: true }, // tableros de celular de 1056 a escala 1:1 (ceremonia)
  celularCorto: { width: 390, height: 670, movil: true }, // tableros de celular de 670 a escala 1:1 (itinerario)
  celularMedio: { width: 390, height: 740, movil: true }, // tableros de celular de 740 a escala 1:1 (vestimenta)
  celularGaleria: { width: 390, height: 1042, movil: true }, // tableros de celular de 1042 a escala 1:1 (galería)
  iphoneSE: { width: 375, height: 667, movil: true },
  tableta: { width: 768, height: 1024, movil: true },
  computadora: { width: 1440, height: 900, movil: false },
  monitorIvan: { width: 1863, height: 972, movil: false },
};

/** @param {import('playwright-core').Browser} browser @param {{width:number,height:number,movil:boolean}} t */
export function contexto(browser, t, extra = {}) {
  return browser.newContext({
    viewport: { width: t.width, height: t.height },
    deviceScaleFactor: t.movil ? 2 : 1,
    isMobile: t.movil,
    hasTouch: t.movil,
    ...extra,
  });
}

export const espera = (ms) => new Promise((r) => setTimeout(r, ms));
