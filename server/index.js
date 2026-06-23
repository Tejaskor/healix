import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import authRouter from './routes/auth.js'
import oauthRouter from './routes/oauth.js'
import passport from './lib/passport.js'

// ---------------------------------------------------------------------------
// Keep the process alive if something throws asynchronously.
// Without these, a single bad await can crash the whole server and the
// frontend proxy will respond with 502 Bad Gateway on every call after that.
// ---------------------------------------------------------------------------
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err)
})
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason)
})

const app = express()

// Permissive CORS for dev — reflect whichever origin called us.
// `credentials: true` is required for the session cookie to be sent on
// cross-origin fetches from the frontend.
const configuredOrigin = process.env.CLIENT_URL
app.use(cors({
  origin: configuredOrigin || true,
  credentials: true,
}))
app.use(express.json({ limit: '100kb' }))

// Sessions — needed by Passport to persist the logged-in OAuth user.
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}))

app.use(passport.initialize())
app.use(passport.session())

// Request logger — prints every incoming request + response status.
app.use((req, res, next) => {
  const start = Date.now()
  const bodyPreview = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
    ? JSON.stringify(req.body).replace(/"(password|newPassword)":"[^"]*"/g, '"$1":"***"')
    : ''
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms) ${bodyPreview}`
    )
  })
  next()
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Current session user — the OAuth success page calls this to know who we are.
app.get('/api/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
  const { email, fullName, provider } = req.user
  return res.json({ user: { email, fullName, provider } })
})

app.post('/api/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => res.json({ ok: true }))
  })
})

app.use('/api', authRouter)
app.use('/api/auth', oauthRouter)

// Unknown route → JSON 404 so the frontend can show a real message.
app.use((req, res) => {
  res.status(404).json({ error: `No route ${req.method} ${req.originalUrl}` })
})

// Error handler — always return JSON so the client never sees an HTML error page.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err)
  res.status(500).json({ error: err.message || 'Server error' })
})

const PORT = Number(process.env.PORT) || 4000
app.listen(PORT, () => {
  console.log(`[healix-server] listening on http://localhost:${PORT}`)
  console.log(`[healix-server] CORS origin: ${configuredOrigin || '(reflect)'}`)
})
