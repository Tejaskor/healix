import crypto from 'crypto'
import express from 'express'
import passport, { googleEnabled } from '../lib/passport.js'
import { upsertOAuthUser } from '../lib/store.js'

const router = express.Router()

// ---------------------------------------------------------------------------
// One-time exchange codes
//
// OAuth happens on the backend origin (:4000). The frontend lives on a
// different origin (:3000), so the session cookie cannot be shared with it.
// Instead, after a successful provider login we issue a short-lived,
// single-use exchange code and redirect to the frontend carrying that code.
// The frontend POSTs it back via the Vite proxy (same-origin fetch) to
// /api/auth/exchange and receives the user payload, which it stores locally.
// ---------------------------------------------------------------------------
const EXCHANGE_TTL_MS = 2 * 60 * 1000 // 2 minutes
const exchangeCodes = new Map() // code -> { email, fullName, provider, expiresAt }

const issueExchangeCode = (user) => {
  const code = crypto.randomBytes(24).toString('hex')
  exchangeCodes.set(code, {
    email: user.email,
    fullName: user.fullName,
    provider: user.provider,
    expiresAt: Date.now() + EXCHANGE_TTL_MS,
  })
  return code
}

const consumeExchangeCode = (code) => {
  const rec = exchangeCodes.get(code)
  if (!rec) return null
  exchangeCodes.delete(code)
  if (Date.now() > rec.expiresAt) return null
  return rec
}

const clientBase = () => (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '')

const redirectWithCode = (res, user) => {
  const code = issueExchangeCode(user)
  const url = new URL(`${clientBase()}/auth/success`)
  url.searchParams.set('code', code)
  return res.redirect(url.toString())
}

const redirectWithFailure = (res, reason) => {
  const url = new URL(`${clientBase()}/auth/failure`)
  url.searchParams.set('reason', reason)
  return res.redirect(url.toString())
}

// ---------------------------------------------------------------------------
// Google
// ---------------------------------------------------------------------------
router.get('/google', (req, res, next) => {
  if (!googleEnabled) {
    // Explicit JSON so a curl/test shows the real cause instead of a 502.
    return res.status(501).json({
      error: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env.',
    })
  }
  // session: false — we don't need Passport's session; we hand back a code.
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next)
})

router.get('/google/callback', (req, res, next) => {
  if (!googleEnabled) return redirectWithFailure(res, 'google-not-configured')
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) return redirectWithFailure(res, 'oauth-error')
    if (!user) return redirectWithFailure(res, 'cancelled')
    return redirectWithCode(res, user)
  })(req, res, next)
})

// ---------------------------------------------------------------------------
// Apple (mock)
//
// Real Apple Sign-In requires a paid Apple Developer account, a Services ID,
// a Key ID + private key, and JWT-based client_secret generation. The spec
// allows a mock; swap for `passport-apple` once you have credentials.
// ---------------------------------------------------------------------------
router.get('/apple', (_req, res) => {
  const user = upsertOAuthUser({
    email: 'apple.user@example.com',
    fullName: 'Apple Demo',
    provider: 'apple-mock',
    providerId: 'demo',
  })
  return redirectWithCode(res, user)
})

// ---------------------------------------------------------------------------
// POST /api/auth/exchange
//
// Frontend -> Backend via Vite proxy. Consumes the one-time code and
// returns the user info the frontend stores in AuthContext.
// ---------------------------------------------------------------------------
router.post('/exchange', express.json(), (req, res) => {
  const { code } = req.body || {}
  if (!code) return res.status(400).json({ error: 'Missing code' })
  const rec = consumeExchangeCode(code)
  if (!rec) return res.status(400).json({ error: 'Invalid or expired code' })
  return res.json({
    user: { email: rec.email, fullName: rec.fullName, provider: rec.provider },
  })
})

export default router
