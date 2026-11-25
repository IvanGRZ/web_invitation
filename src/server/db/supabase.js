// Cliente de Supabase con la service key: sólo en el servidor (CLAUDE.md § 7 › Datos).
// Las variables las declara astro.config.mjs (envField, secretas, validateSecrets): si faltan, falla al arrancar.
// `astro:env/server` no se puede importar desde el navegador: si una isla lo importara por error, el build falla.
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from 'astro:env/server';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  // Sin sesiones de usuario: el servidor habla en nombre propio.
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
