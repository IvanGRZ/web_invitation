// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

/** `astro build` (y la compilación de Netlify): sólo entonces se activa la CSP. */
const esBuild = process.argv.includes('build');

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
    devFeatures: { edgeFunctions: false, images: false, environmentVariables: false },
    // La CSP también como header en las páginas estáticas (no sólo como <meta>), CLAUDE.md § 7 › Seguridad.
    staticHeaders: true
  }),
  // Variables del servidor (CLAUDE.md § 7 › Datos). Se leen con `import … from 'astro:env/server'` y nunca llegan
  // al navegador; validateSecrets revisa también las secretas al arrancar (sin ellas, falla de inmediato).
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: 'server', access: 'secret', url: true }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: 'server', access: 'secret' })
    },
    validateSecrets: true
  },
  security: {
    // checkOrigin (activo por defecto) se queda: las Actions con formulario rechazan POST de otro origen.
    // CSP con hashes de los <script> y <style> que genera Astro. Las pantallas usan atributos style en línea
    // (--u del tablero, retrasos de entrada), que no admiten hashes: sólo style-src-attr permite 'unsafe-inline'.
    // Sólo en el build: en astro dev, Vite inyecta <style> y <script> sin hash y la CSP los bloquearía
    // (las islas no se hidratan). Se revisa con astro build + astro preview.
    csp: esBuild && {
      styleDirective: {
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }]
      }
    }
  },
  // Sin sesiones: el RSVP es idempotente y no necesita Post/Redirect/Get (CLAUDE.md § 7).
  // Evita la configuración de Netlify Blobs y deja el runtime de sesiones fuera del bundle.
  session: false,
  // En astro dev, Vite descubría tarde los módulos de las Actions que usa la isla de la confirmación y los volvía a
  // optimizar en cada visita (504 "Outdated Optimize Dep": la isla no se hidrataba). Se preparan al arrancar.
  vite: {
    optimizeDeps: {
      include: ['@astrojs/react/actions', 'astro/actions/runtime/entrypoints/client.js']
    }
  },
  // Sin la barra de herramientas de Astro en astro dev.
  devToolbar: { enabled: false }
});