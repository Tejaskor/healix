import { supabase } from './supabase'

/**
 * Thin wrapper around Supabase auth.
 *
 * Why a wrapper?
 *   - Keeps Supabase types out of UI components — they import a small,
 *     stable surface (signUpWithEmail / signInWithEmail / etc.) that we
 *     can change later without touching forms.
 *   - Normalises the success shape to `{ email, fullName }`, matching the
 *     existing `authStore.registerUser` contract so the rest of the app
 *     (AuthContext.login, OffcanvasAuth.onSuccess, Onboarding redirect)
 *     keeps working unchanged.
 *   - Centralises error-message translation so the form just shows
 *     `err.message` verbatim.
 *
 * Email-confirmation note:
 *   By default Supabase requires email verification before issuing a
 *   session. If confirmation is ON in Supabase → Authentication → Sign-In
 *   Method, signUp() resolves successfully but `data.session` is null.
 *   The function still returns the user shape — the UI can decide whether
 *   to show a "check your email" message based on `needsConfirmation`.
 *
 * Profile row creation:
 *   The `fullName` is sent inside `options.data` so it lands in
 *   auth.users.raw_user_meta_data. A SQL trigger (see SETUP.md / SQL block
 *   in the deploy notes) auto-inserts a matching row into public.profiles.
 *   That way the profile row is created with elevated privileges and we
 *   don't need to issue an insert from the unauthenticated client.
 */

/**
 * Stable codes consumers can switch on for UX decisions without having
 * to grep error message strings (which change between Supabase versions).
 */
export const AuthErrorCode = Object.freeze({
  INVALID_CREDENTIALS: 'invalid_credentials',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  EMAIL_TAKEN: 'email_taken',
  PASSWORD_TOO_SHORT: 'password_too_short',
  RATE_LIMITED: 'rate_limited',
  NETWORK: 'network',
  UNKNOWN: 'unknown',
})

/**
 * Translate any Supabase / network error into an Error with:
 *   - .message  : user-facing string (kept generic for security)
 *   - .code     : one of AuthErrorCode (stable, decideable in UI)
 *
 * Security note: we deliberately do NOT distinguish "no such email" from
 * "wrong password". Supabase already returns the same `Invalid login
 * credentials` for both — that's the standard anti-enumeration pattern.
 * Surfacing one vs the other would let an attacker probe registered
 * emails. Keep the generic phrasing.
 */
const friendlyError = (err) => {
  if (!err) {
    const e = new Error('Unknown error')
    e.code = AuthErrorCode.UNKNOWN
    return e
  }
  const msg = err.message || String(err)
  const make = (text, code) => {
    const e = new Error(text)
    e.code = code
    return e
  }

  // Network / fetch failure (offline, DNS error, CORS, etc.)
  if (/Failed to fetch|NetworkError|Network request failed|TypeError: fetch/i.test(msg)) {
    return make('Network error. Please check your connection and try again.', AuthErrorCode.NETWORK)
  }

  // Sign-up: email already in use.
  if (/already registered/i.test(msg) || /User already exists/i.test(msg)) {
    return make('An account with this email already exists', AuthErrorCode.EMAIL_TAKEN)
  }

  // Sign-up: weak password.
  if (/Password should be at least/i.test(msg)) {
    return make('Password is too short', AuthErrorCode.PASSWORD_TOO_SHORT)
  }

  // Sign-in: bad credentials (wrong email OR wrong password — see security note).
  if (/Invalid login credentials/i.test(msg)) {
    return make('Invalid email or password', AuthErrorCode.INVALID_CREDENTIALS)
  }

  // Sign-in: account exists but the user hasn't clicked the confirmation
  // link from the signup email yet.
  if (/Email not confirmed/i.test(msg)) {
    return make(
      'Please confirm your email before signing in. Check your inbox for the verification link.',
      AuthErrorCode.EMAIL_NOT_CONFIRMED
    )
  }

  // Rate limiting — Supabase wraps both per-email and per-IP throttles
  // here. Different messages depending on the throttle, all mapped to one
  // user-facing code.
  if (/rate limit|too many requests|over_email_send_rate_limit/i.test(msg)) {
    return make(
      'Too many attempts. Please wait a moment and try again.',
      AuthErrorCode.RATE_LIMITED
    )
  }

  return make(msg, AuthErrorCode.UNKNOWN)
}

/**
 * Create a new account.
 *
 * @param   {{ email: string, password: string, fullName: string }} input
 * @returns {Promise<{ email: string, fullName: string, needsConfirmation: boolean, userId: string }>}
 * @throws  {Error} with a UI-friendly message on failure.
 */
export const signUpWithEmail = async ({ email, password, fullName }) => {
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanName = String(fullName || '').trim()

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      // Goes into auth.users.raw_user_meta_data, where the
      // handle_new_user() trigger picks it up to populate profiles.full_name.
      data: { full_name: cleanName },
    },
  })

  if (error) throw friendlyError(error)
  if (!data?.user) throw new Error('Sign-up did not return a user')

  return {
    email: cleanEmail,
    fullName: cleanName,
    userId: data.user.id,
    // `session` is null when email confirmation is enabled in the
    // Supabase dashboard. The form can use this to show a "check your
    // email" hint, but it's not required for the existing flow.
    needsConfirmation: !data.session,
  }
}

/**
 * Sign in with email + password. Kept here for the next migration step
 * (login form) so consumers have a single import path for both flows.
 */
export const signInWithEmail = async ({ email, password }) => {
  const cleanEmail = String(email || '').trim().toLowerCase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  })
  if (error) throw friendlyError(error)
  if (!data?.user) throw new Error('Sign-in failed')
  const fullName =
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.fullName ||
    ''
  return { email: cleanEmail, fullName, userId: data.user.id }
}

/**
 * Compute the absolute URL we want Supabase to redirect the user back to
 * after the OAuth handshake completes. Must:
 *   1. Be absolute (Supabase requires absolute URLs).
 *   2. Include the Vite `base` prefix so it works on GitHub Pages
 *      (where the app lives under /healix/) AND locally (where base
 *      may also be /healix/ — see vite.config.js).
 *   3. Be whitelisted in Supabase Dashboard → Authentication → URL
 *      Configuration → Redirect URLs. (See the SETUP notes below.)
 */
const oauthRedirectUrl = () => {
  // window.location.origin = http://localhost:3000 (dev)
  //                       OR https://your-deploy-host
  // import.meta.env.BASE_URL = "/healix/" (configured in vite.config.js)
  const origin = window.location.origin
  const base = import.meta.env.BASE_URL || '/'
  // Trim any duplicate slashes that arise from joining "/healix/" with "auth/..."
  return `${origin}${base}auth/success`.replace(/(?<!:)\/{2,}/g, '/')
}

/**
 * Kick off a Google OAuth sign-in. Triggers a full-page redirect to
 * Google's consent screen. After the user approves, Supabase will redirect
 * them back to `oauthRedirectUrl()` with the access/refresh tokens in the
 * URL hash. The Supabase client (with detectSessionInUrl: true, configured
 * in src/lib/supabase.js) automatically picks those up, persists the
 * session, and fires `onAuthStateChange('SIGNED_IN', ...)`. AuthContext is
 * subscribed to that event and updates the user state — so the OAuth
 * landing page only needs to wait for `isLoggedIn` to flip and route.
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: oauthRedirectUrl(),
      // Defensive: Supabase's default scopes already cover email + profile.
      // Explicit list avoids surprises if the default ever changes.
      scopes: 'openid email profile',
    },
  })
  if (error) throw friendlyError(error)
  // signInWithOAuth navigates the page away — control rarely returns here
  // unless the call was blocked. `data.url` is the Google consent URL if
  // you wanted to render it manually instead of redirecting.
  return data
}

/**
 * Compose an absolute URL inside the deployed app, honouring Vite's
 * `base` setting. Reused for OAuth + password-reset redirects.
 */
const callbackUrl = (suffix) => {
  const origin = window.location.origin
  const base = import.meta.env.BASE_URL || '/'
  return `${origin}${base}${suffix}`.replace(/(?<!:)\/{2,}/g, '/')
}

/**
 * Send a password-reset email. Supabase sends the actual mail server-side
 * via its own SMTP — no nodemailer / Gmail-app-password setup required.
 *
 * The email's reset link points at our `redirectTo` URL with a recovery
 * token. When the user clicks it, Supabase verifies the token and
 * redirects them back to that URL with `access_token` + `refresh_token`
 * + `type=recovery` in the URL hash. Our supabase client
 * (`detectSessionInUrl: true`) auto-parses the hash, establishes a
 * recovery session, and fires `onAuthStateChange('PASSWORD_RECOVERY', …)`.
 *
 * IMPORTANT: the redirectTo URL must be on Supabase's allowlist:
 *   Dashboard → Authentication → URL Configuration → Redirect URLs.
 *
 * Returns a generic success even when the email doesn't exist — Supabase
 * already prevents email enumeration internally.
 */
export const sendPasswordResetEmail = async ({ email }) => {
  const cleanEmail = String(email || '').trim().toLowerCase()
  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: callbackUrl('reset-password'),
  })
  if (error) throw friendlyError(error)
  return { ok: true }
}

/**
 * Update the currently-signed-in user's password.
 *
 * Only works when the user is in an authenticated session — typically a
 * password-recovery session created by clicking a reset email link.
 * Supabase enforces the recovery context server-side, so calling this
 * without a valid session will return an "Auth session missing" error.
 */
export const updatePassword = async ({ newPassword }) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw friendlyError(error)
  return { ok: true }
}

/**
 * Permanently delete the currently-signed-in user's account.
 *
 * --------------------------------------------------------------------
 * Why this isn't a one-liner
 * --------------------------------------------------------------------
 * Supabase's anon key cannot delete from auth.users — that operation
 * requires either the service-role key (server-only) or a Postgres
 * function with `security definer`. We use the latter so this stays a
 * pure browser-side flow with no Express server in the loop.
 *
 * The companion SQL function `public.delete_my_account()` (see the SQL
 * block in the deploy notes) runs as the postgres role and deletes the
 * caller's row from both `public.profiles` and `auth.users`. Because
 * RLS-elevated `security definer` is a sharp tool, the function does
 * exactly one thing: `delete where id = auth.uid()`. There is no way
 * for it to delete a different user.
 *
 * --------------------------------------------------------------------
 * Reauthentication
 * --------------------------------------------------------------------
 * For email/password users we re-verify the password before deletion
 * (matches the UX of every password manager and bank). For OAuth users
 * (Google) we can't ask for a password — they don't have one — so the
 * caller just needs an active session, which itself is proof of
 * identity. The form upstream handles which path applies.
 *
 * @param {{ password?: string }} input
 *   - password: required for email/password users. Omitted for OAuth.
 */
export const deleteCurrentAccount = async ({ password } = {}) => {
  // 1. Resolve the current user. Without a session there's nothing to delete.
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr) throw friendlyError(userErr)
  if (!user) throw new Error('You are not signed in')

  // 2. If a password was supplied, verify it BEFORE the destructive op.
  //    signInWithPassword re-issues a session as a side effect — fine.
  if (password) {
    if (!user.email) throw new Error('Account has no email — please contact support')
    const { error: pwErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    })
    if (pwErr) {
      // Supabase returns 'Invalid login credentials' here. Translate.
      throw new Error('Incorrect password')
    }
  }

  // 3. Call the security-definer RPC that wipes the user out.
  const { error: rpcErr } = await supabase.rpc('delete_my_account')
  if (rpcErr) throw friendlyError(rpcErr)

  // 4. Sign out locally. The remote session is already invalid (the row
  //    we authenticated against no longer exists), but signOut() also
  //    clears the localStorage session record under 'healix-supabase-auth'.
  //    Ignore signOut errors — the account is already gone.
  try { await supabase.auth.signOut() } catch { /* noop */ }

  return { ok: true }
}

/**
 * Sign out the current Supabase session. Does NOT clear the legacy
 * AuthContext localStorage record — call AuthContext.logout() for that.
 */
export const signOutSupabase = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw friendlyError(error)
}

/**
 * Fetch the current user's profile row (the public-facing data, separate
 * from auth.users). Returns null if no profile exists or no user is
 * signed in.
 */
export const getCurrentProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at')
    .eq('id', user.id)
    .maybeSingle()
  if (error) throw friendlyError(error)
  return data
}
