import crypto from 'crypto'
import express from 'express'
import bcrypt from 'bcryptjs'
import {
  findUserByEmail,
  saveUser,
  updateUserPassword,
  saveResetToken,
  consumeResetToken,
  deleteUser,
} from '../lib/store.js'
import { sendResetEmail } from '../lib/mailer.js'

const router = express.Router()

const RESET_TTL_MS = 15 * 60 * 1000 // 15 minutes
const BCRYPT_ROUNDS = 10

const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || ''))

// -----------------------------
// POST /api/signup
// -----------------------------
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {}
    if (!fullName || !email || !password) return res.status(400).json({ error: 'Missing required fields' })
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email' })
    if (password.length < 8) return res.status(400).json({ error: 'Password too short' })

    const existing = findUserByEmail(email)
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' })

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const user = saveUser({ fullName, email, passwordHash, createdAt: Date.now() })
    return res.status(201).json({ user: { email: user.email, fullName: user.fullName } })
  } catch (err) {
    console.error('[signup]', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// -----------------------------
// POST /api/login
// -----------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Invalid email or password' })

    const user = findUserByEmail(email)
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

    return res.json({ user: { email: user.email, fullName: user.fullName } })
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// -----------------------------
// POST /api/forgot-password
// Always returns a generic success to prevent email enumeration.
// If the email exists, a real reset email is sent via nodemailer.
// -----------------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {}
  const genericResponse = { ok: true }

  try {
    if (!email || !isValidEmail(email)) {
      // Still respond generically so callers can't probe for valid formats.
      return res.json(genericResponse)
    }

    const user = findUserByEmail(email)
    if (!user) return res.json(genericResponse)

    const token = crypto.randomBytes(24).toString('hex')
    const expiresAt = Date.now() + RESET_TTL_MS
    saveResetToken({ token, email: user.email, expiresAt })

    const clientBase = process.env.CLIENT_URL || 'http://localhost:3000'
    const resetLink = `${clientBase.replace(/\/$/, '')}/reset-password?token=${token}`

    // Fire-and-forget: we do not surface send errors to the caller for security.
    // The error is still logged server-side for debugging.
    sendResetEmail({ to: user.email, resetLink }).catch((err) => {
      console.error('[forgot-password] email send failed:', err.message)
    })

    return res.json(genericResponse)
  } catch (err) {
    console.error('[forgot-password]', err)
    // Still return generic success — never leak internal state.
    return res.json(genericResponse)
  }
})

// -----------------------------
// POST /api/reset-password
// -----------------------------
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body || {}
    if (!token || !newPassword) return res.status(400).json({ error: 'Invalid or expired token' })
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password too short' })

    // Atomic one-time-use: consume regardless of outcome.
    const rec = consumeResetToken(token)
    if (!rec) return res.status(400).json({ error: 'Invalid or expired token' })

    const user = findUserByEmail(rec.email)
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' })

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
    updateUserPassword(rec.email, passwordHash)

    return res.json({ ok: true })
  } catch (err) {
    console.error('[reset-password]', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// -----------------------------
// DELETE /api/delete-account
//
// Body: { email, password }
// Requires the user's current password to prevent accidental/unauthorized
// deletion. All account + associated data (reset tokens) is purged.
// In production, authenticate via JWT/session instead of re-sending email.
// -----------------------------
router.delete('/delete-account', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Password is required' })

    const user = findUserByEmail(email)
    // Same generic message whether the user exists or the password is wrong.
    if (!user) return res.status(401).json({ error: 'Incorrect password' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Incorrect password' })

    deleteUser(user.email)
    console.log('[delete-account] deleted', user.email)
    return res.json({ ok: true })
  } catch (err) {
    console.error('[delete-account]', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router
