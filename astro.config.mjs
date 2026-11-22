// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // URL pública del sitio para las direcciones absolutas (og:image de la vista previa de WhatsApp).
  // Netlify define URL en el build (el dominio propio cuando exista); en local queda sin definir.
  site: process.env.URL,
  integrations: [react()],
  adapter: netlify({
    // Fotos optimizadas en el build con sharp (archivos estáticos con caché larga), no transformadas en la
    // CDN de Netlify en cada petición: el resultado es determinista y se verifica igual en local.
    imageCDN: false,
    // Sin Edge Functions en este proyecto (CLAUDE.md § 7): no emular Deno en astro dev.
    devFeatures: { edgeFunctions: false, images: false, environmentVariables: false }
  }),
  // Sin sesiones: el RSVP es idempotente y no necesita Post/Redirect/Get (CLAUDE.md § 7).
  // Evita la configuración de Netlify Blobs y deja el runtime de sesiones fuera del bundle.
  session: false,
  // Sin la barra de herramientas de Astro en astro dev.
  devToolbar: { enabled: false }
});