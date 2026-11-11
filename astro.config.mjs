// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: netlify({
    // Sin Edge Functions en este proyecto (CLAUDE.md § 7): no emular Deno en astro dev.
    devFeatures: { edgeFunctions: false, images: true, environmentVariables: false }
  }),
  // Sin sesiones: el RSVP es idempotente y no necesita Post/Redirect/Get (CLAUDE.md § 7).
  // Evita la configuración de Netlify Blobs y deja el runtime de sesiones fuera del bundle.
  session: false
});