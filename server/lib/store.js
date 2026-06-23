// In-memory store. Swap for a real database (Postgres, Mongo, etc.) in production.
// Data is lost on server restart — intentional for this demo.

const users = new Map() // email -> { email, fullName, passwordHash, createdAt }
const resets = new Map() // token -> { email, expiresAt }

export const findUserByEmail = (email) => users.get(String(email || '').trim().toLowerCase()) || null

/**
 * Create the user if they don't already exist. OAuth users have no local
 * password, so `passwordHash` is null. Returns the resolved user record.
 */
export const upsertOAuthUser = ({ email, fullName, provider, providerId }) => {
  const e = String(email || '').trim().toLowerCase()
  if (!e) throw new Error('Email required')
  const existing = users.get(e)
  if (existing) {
    // Keep the latest provider metadata but don't overwrite an existing
    // password hash (they may have a local password too).
    const merged = { ...existing, provider, providerId }
    users.set(e, merged)
    return merged
  }
  const created = {
    email: e,
    fullName: fullName || '',
    passwordHash: null,
    provider,
    providerId,
    createdAt: Date.now(),
  }
  users.set(e, created)
  return created
}

export const saveUser = (user) => {
  const email = String(user.email || '').trim().toLowerCase()
  users.set(email, { ...user, email })
  return users.get(email)
}

export const updateUserPassword = (email, passwordHash) => {
  const e = String(email || '').trim().toLowerCase()
  const u = users.get(e)
  if (!u) return null
  const next = { ...u, passwordHash }
  users.set(e, next)
  return next
}

export const deleteUser = (email) => {
  const e = String(email || '').trim().toLowerCase()
  const existed = users.delete(e)
  // Also purge any pending reset tokens so they can't be used post-delete.
  for (const [t, rec] of resets) {
    if (rec.email === e) resets.delete(t)
  }
  return existed
}

export const saveResetToken = ({ token, email, expiresAt }) => {
  // Drop any prior tokens for this email so only the newest is valid.
  for (const [t, rec] of resets) {
    if (rec.email === email) resets.delete(t)
  }
  resets.set(token, { email, expiresAt })
}

export const consumeResetToken = (token) => {
  const rec = resets.get(token)
  if (!rec) return null
  // Always delete — tokens are one-time-use, even if expired/invalid.
  resets.delete(token)
  if (Date.now() > rec.expiresAt) return null
  return rec
}

export const cleanupExpiredTokens = () => {
  const now = Date.now()
  for (const [t, rec] of resets) {
    if (now > rec.expiresAt) resets.delete(t)
  }
}
