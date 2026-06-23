import { createClient } from '@supabase/supabase-js'

/**
 * Single shared Supabase client for the whole app.
 *
 * --------------------------------------------------------------------------
 * Required env vars (Vite reads any var prefixed with VITE_* into the bundle):
 *   VITE_SUPABASE_URL       Project URL  (e.g. https://xxxx.supabase.co)
 *   VITE_SUPABASE_ANON_KEY  Public anon  key   (safe to ship to the browser)
 *
 * Both are read from Supabase Dashboard → Settings → API.
 *
 * NEVER commit the service-role key here — that one bypasses Row Level
 * Security and is server-only.
 * --------------------------------------------------------------------------
 *
 * Co-exists with the existing client-side demo store in `authStore.js` and
 * the Express auth backend; this client is purely additive. Adopt it
 * incrementally by feature (e.g. start with new tables, then migrate auth).
 *
 * Usage:
 *   import { supabase } from '@/lib/supabase'
 *   const { data, error } = await supabase.from('profiles').select('*')
 */

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Don't crash the whole app at import time — log a clear warning so the
  // dev sees exactly which var is missing. Calls to supabase.* will fail
  // with a network error until both vars are populated and the dev server
  // is restarted (Vite only re-reads env on restart, not HMR).
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing env vars — VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY. ' +
      'Add them to .env.local (see .env.example) and restart `npm run dev`.'
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // handles OAuth + magic-link redirects automatically
    storageKey: 'healix-supabase-auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

export default supabase
