/**
 * Demo auth store (client-side).
 *
 * Passwords are hashed with SHA-256 + a per-user random salt via Web Crypto,
 * and stored in localStorage. This lets the demo app run without a backend.
 *
 * For real email and bcrypt-hashed passwords, switch this file over to call
 * the Express API in /server (signatures already match: registerUser,
 * authenticateUser, requestPasswordReset, resetPasswordWithToken).
 */

const USERS_KEY = 'healix_users'
const RESETS_KEY = 'healix_resets'
const RESET_TTL_MS = 15 * 60 * 1000 // 15 minutes

// ---- hashing helpers ----

const toHex = (bytes) =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')

const randomSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)))

const hashPassword = async (password, salt) => {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return toHex(new Uint8Array(buf))
}

// Constant-time-ish string compare to avoid leaking length via early-exit.
const safeEquals = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// ---- storage ----

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users))

const readResets = () => {
  try { return JSON.parse(localStorage.getItem(RESETS_KEY) || '[]') } catch { return [] }
}
const writeResets = (list) => localStorage.setItem(RESETS_KEY, JSON.stringify(list))

// ---- public API ----

export const registerUser = async ({ email, password, fullName }) => {
  const e = String(email || '').trim().toLowerCase()
  if (!e || !password) throw new Error('Email and password are required')

  const users = readUsers()
  if (users.some((u) => u.email === e)) {
    throw new Error('An account with this email already exists')
  }

  const salt = randomSalt()
  const passwordHash = await hashPassword(password, salt)
  const user = { email: e, fullName, salt, passwordHash, createdAt: Date.now() }
  writeUsers([...users, user])

  return { email: user.email, fullName: user.fullName }
}

/**
 * Delete the account after re-verifying the password. Purges any pending
 * reset tokens for this user so they can't be used after deletion.
 */
/**
 * OAuth happens entirely on the backend origin. The buttons full-page
 * navigate to the backend; the backend redirects to the provider, then
 * back to the frontend with a one-time exchange code in the URL.
 *
 * VITE_SERVER_URL lets you point at a different backend in deployment.
 */
const SERVER_URL = (import.meta.env.VITE_SERVER_URL || 'http://localhost:4000').replace(/\/$/, '')
export const googleLoginUrl = `${SERVER_URL}/api/auth/google`
export const appleLoginUrl = `${SERVER_URL}/api/auth/apple`

/**
 * Exchange the one-time code returned in the OAuth redirect for the user.
 * Goes through the Vite proxy (same-origin) so we don't depend on the
 * backend session cookie being readable from the frontend origin.
 */
export const exchangeOAuthCode = async (code) => {
  let res
  try {
    res = await fetch('/api/auth/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
  } catch (err) {
    console.error('[oauth] exchange network error', err)
    throw new Error('Cannot reach the server. Start the Express API in /server.')
  }
  let data = null
  try { data = await res.json() } catch { /* non-JSON */ }
  if (!res.ok) {
    console.error('[oauth] exchange failed', { status: res.status, body: data })
    throw new Error(data?.error || `Exchange failed (${res.status})`)
  }
  return data?.user || null
}

export const deleteAccount = async ({ email, password }) => {
  const e = String(email || '').trim().toLowerCase()
  if (!e || !password) throw new Error('Password is required')

  const users = readUsers()
  const user = users.find((u) => u.email === e)
  if (!user) throw new Error('Incorrect password')

  const candidate = await hashPassword(password, user.salt)
  if (!safeEquals(candidate, user.passwordHash)) {
    throw new Error('Incorrect password')
  }

  // Remove user + any pending reset tokens tied to this email.
  writeUsers(users.filter((u) => u.email !== e))
  writeResets(readResets().filter((r) => r.email !== e))
  return { ok: true }
}

export const authenticateUser = async ({ email, password }) => {
  const e = String(email || '').trim().toLowerCase()
  if (!e || !password) throw new Error('Invalid email or password')

  const user = readUsers().find((u) => u.email === e)
  if (!user) throw new Error('Invalid email or password')

  const candidate = await hashPassword(password, user.salt)
  if (!safeEquals(candidate, user.passwordHash)) {
    throw new Error('Invalid email or password')
  }

  return { email: user.email, fullName: user.fullName }
}

/**
 * Request a reset token. Always resolves with `{ ok: true }` so callers
 * cannot probe for registered emails. The dev link is logged to the console
 * and returned for testing — there is no backend to email it.
 */
export const requestPasswordReset = async (email) => {
  const e = String(email || '').trim().toLowerCase()
  if (!e) throw new Error('Email is required')

  const user = readUsers().find((u) => u.email === e)
  let devLink = null

  if (user) {
    const token = toHex(crypto.getRandomValues(new Uint8Array(24)))
    const expiresAt = Date.now() + RESET_TTL_MS

    // Drop expired + prior tokens for this email; only the newest is valid.
    const pruned = readResets().filter((r) => r.email !== e && r.expiresAt > Date.now())
    pruned.push({ token, email: e, expiresAt })
    writeResets(pruned)

    devLink = `${window.location.origin}/reset-password?token=${token}`
    // eslint-disable-next-line no-console
    console.info('[Healix] Password reset link:', devLink)
    window.__healixLastResetLink = devLink
  }

  return { ok: true, devLink }
}

/**
 * Consume a reset token and set a new password. Tokens are single-use and
 * expire after RESET_TTL_MS. All failure modes return the same error to
 * avoid leaking state.
 */
export const resetPasswordWithToken = async ({ token, newPassword }) => {
  if (!token || !newPassword) throw new Error('Invalid or expired token')

  const resets = readResets()
  const entry = resets.find((r) => r.token === token)

  if (!entry || Date.now() > entry.expiresAt) {
    writeResets(resets.filter((r) => r.expiresAt > Date.now() && r.token !== token))
    throw new Error('Invalid or expired token')
  }

  const users = readUsers()
  const idx = users.findIndex((u) => u.email === entry.email)
  if (idx === -1) throw new Error('Invalid or expired token')

  const salt = randomSalt()
  const passwordHash = await hashPassword(newPassword, salt)
  users[idx] = { ...users[idx], salt, passwordHash }
  writeUsers(users)

  // One-time use: drop this token + any other pending tokens for the user.
  writeResets(resets.filter((r) => r.token !== token && r.email !== entry.email))

  return { email: entry.email }
}
