# Healix auth server

Express API for signup, login, and password reset (with real email via nodemailer).

## Setup

```bash
cd server
npm install
cp .env.example .env
# fill in EMAIL_USER / EMAIL_PASS (Google App Password)
npm run dev
```

Server runs on `http://localhost:4000`.

## Gmail setup

1. Enable 2-Step Verification on your Google account.
2. Visit https://myaccount.google.com/apppasswords and generate an **App Password** (16 chars, no spaces).
3. Put that in `EMAIL_PASS`. Do **not** use your regular Gmail password.

## Routes

- `POST /api/signup` — `{ fullName, email, password }` → `201 { user }` / `409` if email taken
- `POST /api/login` — `{ email, password }` → `{ user }` / `401` on mismatch
- `POST /api/forgot-password` — `{ email }` → `{ ok: true }` (always). Sends a real reset email if the user exists.
- `POST /api/reset-password` — `{ token, newPassword }` → `{ ok: true }` / `400 "Invalid or expired token"`
- `GET  /api/health` — `{ ok: true }`

## Notes

- Passwords are hashed with **bcrypt** (10 rounds).
- Reset tokens: 24 random bytes, hex-encoded, 15-minute expiry, **one-time use**.
- Storage is **in-memory** (Map) — swap `lib/store.js` for a real database in production.
- The forgot-password endpoint always returns `ok: true` regardless of whether the email exists, to prevent account enumeration.
