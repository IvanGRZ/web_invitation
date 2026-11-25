// Vitest con la configuración de Vite de Astro (alias @/, astro/zod). Sólo dominio y servicios (CLAUDE.md § 7).
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/server/**/*.test.js'],
  },
});
