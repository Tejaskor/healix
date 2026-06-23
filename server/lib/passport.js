import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { upsertOAuthUser, findUserByEmail } from './store.js'

/**
 * Configure Passport. Google is only enabled if credentials are present;
 * otherwise the /auth/google route will 501 with an explanatory message.
 */

passport.serializeUser((user, done) => done(null, user.email))
passport.deserializeUser((email, done) => done(null, findUserByEmail(email)))

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env

export const googleEnabled = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET)

if (googleEnabled) {
  passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) return done(new Error('Google account did not return an email'))
        const user = upsertOAuthUser({
          email,
          fullName: profile.displayName || '',
          provider: 'google',
          providerId: profile.id,
        })
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  ))
  console.log('[passport] Google OAuth ready')
} else {
  console.warn('[passport] Google OAuth disabled — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable.')
}

export default passport
