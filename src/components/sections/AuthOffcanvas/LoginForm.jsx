import { useState } from 'react'
// Password + Google login go through Supabase. The AuthErrorCode export
// gives us a stable enum to switch on without grepping error strings.
import { signInWithEmail, signInWithGoogle, AuthErrorCode } from '@/lib/supabaseAuth'
// Apple TODO — re-add this import once supabase.auth.signInWithOAuth({
// provider: 'apple' }) is wired up and the Apple Developer credentials
// are configured in the Supabase dashboard:
// import { appleLoginUrl } from '@/lib/authStore'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000" aria-hidden="true">
    <path d="M17.564 13.015c-.024-2.515 2.055-3.723 2.148-3.781-1.171-1.712-2.995-1.946-3.643-1.972-1.552-.157-3.027.915-3.817.915-.79 0-2.006-.893-3.297-.868-1.697.025-3.262.987-4.137 2.506-1.765 3.055-.452 7.576 1.267 10.055.839 1.213 1.838 2.573 3.147 2.524 1.264-.051 1.742-.821 3.268-.821 1.527 0 1.957.821 3.29.796 1.358-.025 2.222-1.238 3.055-2.454.963-1.407 1.36-2.77 1.384-2.84-.03-.013-2.654-1.019-2.681-4.037zM15.089 5.44c.701-.851 1.174-2.03 1.045-3.207-1.01.041-2.232.672-2.957 1.521-.65.754-1.22 1.956-1.066 3.11 1.125.087 2.275-.572 2.978-1.424z" />
  </svg>
)

const CheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#000" />
    <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Single-stroke alert icon for the inline error banner.
const AlertIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12.5" />
    <circle cx="12" cy="16.2" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const validate = (values) => {
  const errors = {}
  if (!values.email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email'
  if (!values.password) errors.password = 'Password is required'
  return errors
}

const LoginForm = ({ onSwitchToSignup, onSuccess, onForgotPassword }) => {
  const [values, setValues] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [submitError, setSubmitError] = useState('')
  // Stable code so the JSX can branch UX (Sign Up CTA, "resend
  // confirmation" link, retry hint) without string-matching messages.
  const [submitErrorCode, setSubmitErrorCode] = useState(null)
  // Bumps on every new failure. React uses this as a `key` on the error
  // banner, which forces a remount → the CSS shake animation replays.
  // Without this, a second consecutive failure with the same error code
  // would only re-render the existing banner (no animation).
  const [errorKey, setErrorKey] = useState(0)
  // Persistent "the last auth attempt failed" flag. Highlights the email
  // (and password) fields with the existing error class until the user
  // edits either of them, providing a clear visual anchor for the error.
  const [authFailed, setAuthFailed] = useState(false)
  const [loading, setLoading] = useState(false)

  const errors = validate(values)
  const invalid = Object.keys(errors).length > 0

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    if (submitError) setSubmitError('')
    if (submitErrorCode) setSubmitErrorCode(null)
    if (authFailed) setAuthFailed(false)
  }
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (invalid || loading) return
    setSubmitError('')
    setSubmitErrorCode(null)
    setAuthFailed(false)
    setLoading(true)
    try {
      // Supabase validates the email + password server-side, issues a
      // refresh-able session, and persists it to localStorage under the
      // 'healix-supabase-auth' key (configured in src/lib/supabase.js).
      // The AuthContext listens for that session change and mirrors it
      // into its own user state — but we ALSO call onSuccess() here so
      // OffcanvasAuth's existing handler (which routes to dashboard or
      // onboarding based on assessmentCompleted) fires immediately
      // instead of waiting for the next auth-state-change tick.
      const user = await signInWithEmail({
        email: values.email.trim(),
        password: values.password,
      })
      onSuccess?.(user)
    } catch (err) {
      // Both fields go into the error visual state for INVALID_CREDENTIALS
      // (we can't tell which one was wrong — see the security note in
      // supabaseAuth.js). Other failure modes only highlight if it makes
      // sense (EMAIL_NOT_CONFIRMED → email field).
      const code = err?.code || AuthErrorCode.UNKNOWN
      setSubmitErrorCode(code)
      setSubmitError(err.message || 'Invalid email or password')
      setErrorKey((k) => k + 1) // replay shake animation
      if (
        code === AuthErrorCode.INVALID_CREDENTIALS ||
        code === AuthErrorCode.EMAIL_NOT_CONFIRMED
      ) {
        setAuthFailed(true)
        // Stripe / Notion pattern: clear the password on failure so the
        // user can immediately re-type without selecting first. Email is
        // preserved (90% of failures are a typo'd password, not email).
        setValues((v) => ({ ...v, password: '' }))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Welcome back</h2>

      <label className="auth-form__field">
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-form__input ${
            (touched.email && errors.email) || authFailed ? 'auth-form__input--error' : ''
          }`}
          placeholder="Email"
          aria-invalid={(touched.email && !!errors.email) || authFailed}
          aria-describedby={touched.email && errors.email ? 'login-email-error' : undefined}
        />
        {touched.email && errors.email && (
          <span id="login-email-error" className="auth-form__error">{errors.email}</span>
        )}
      </label>

      <label className="auth-form__field">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-form__input ${
            (touched.password && errors.password) ||
            submitErrorCode === AuthErrorCode.INVALID_CREDENTIALS
              ? 'auth-form__input--error'
              : ''
          }`}
          placeholder="Password"
          aria-invalid={(touched.password && !!errors.password) || submitErrorCode === AuthErrorCode.INVALID_CREDENTIALS}
          aria-describedby={touched.password && errors.password ? 'login-password-error' : undefined}
        />
        {touched.password && errors.password && (
          <span id="login-password-error" className="auth-form__error">{errors.password}</span>
        )}
      </label>

      <div className="auth-form__meta">
        <button
          type="button"
          className="auth-form__link auth-form__link-btn"
          onClick={onForgotPassword}
        >
          Forgot your password?
        </button>
      </div>

      {submitError && (
        <div
          key={errorKey}
          className="auth-form__error auth-form__error--global"
          role="alert"
          aria-live="assertive"
        >
          <span className="auth-form__error-icon"><AlertIcon /></span>
          <div className="auth-form__error-body">
            <p className="auth-form__error-message">{submitError}</p>
            {/* Contextual CTA on its own line. We never claim the email
                is unregistered (anti-enumeration); the CTA simply nudges
                the user to the next sensible step. */}
            {submitErrorCode === AuthErrorCode.INVALID_CREDENTIALS && (
              <p className="auth-form__error-cta">
                Don&rsquo;t have an account?{' '}
                <button
                  type="button"
                  className="auth-form__link-btn"
                  onClick={onSwitchToSignup}
                >
                  Sign up
                </button>
              </p>
            )}
            {submitErrorCode === AuthErrorCode.EMAIL_NOT_CONFIRMED && (
              <p className="auth-form__error-cta">
                Didn&rsquo;t get the email?{' '}
                <button
                  type="button"
                  className="auth-form__link-btn"
                  onClick={onForgotPassword}
                >
                  Resend or reset
                </button>
              </p>
            )}
            {submitErrorCode === AuthErrorCode.NETWORK && (
              <p className="auth-form__error-cta">
                Check your connection, then try again.
              </p>
            )}
            {submitErrorCode === AuthErrorCode.RATE_LIMITED && (
              <p className="auth-form__error-cta">
                Wait a few seconds before retrying.
              </p>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="auth-form__submit"
        disabled={loading || !values.email || !values.password}
      >
        {loading ? 'Logging in…' : 'Log in'}
      </button>

      <p className="auth-form__footer">
        First time here?{' '}
        <button type="button" className="auth-form__link-btn" onClick={onSwitchToSignup}>
          Create an account
        </button>
      </p>

      <div className="auth-form__divider"><span>or</span></div>

      <div className="auth-form__social">
        <button
          type="button"
          className="auth-form__social-btn"
          onClick={async () => {
            // signInWithGoogle() triggers a full-page redirect to Google's
            // consent screen — control normally doesn't return here. If
            // the call throws synchronously (e.g. misconfigured Supabase
            // URL), surface the error in the same global error slot used
            // by the password form so UI styling stays consistent.
            try {
              await signInWithGoogle()
            } catch (err) {
              setSubmitError(err.message || 'Could not start Google sign-in')
            }
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>
        {/* TODO(apple-oauth): Apple Sign-In is disabled.
            -------------------------------------------------------------
            The button below previously redirected the browser to the
            legacy Express bridge at `${SERVER_URL}/api/auth/apple`, but
            no Passport-Apple strategy was ever wired up server-side —
            the URL has always returned 404. Re-enabling requires:
              1. An Apple Developer Program membership ($99/yr).
              2. An App ID + a Services ID + a "Sign in with Apple" key
                 configured at https://developer.apple.com/account.
              3. Pasting the Services ID + Team ID + Key ID + private
                 key file into Supabase Dashboard → Authentication →
                 Providers → Apple.
              4. Adding apple.com to the redirect-URL allowlist in
                 Supabase (Authentication → URL Configuration).
              5. Swapping the onClick body below to call:
                   await signInWithOAuth({ provider: 'apple', ... })
                 (mirrors the existing signInWithGoogle in
                 src/lib/supabaseAuth.js).
            Markup preserved verbatim so a future migration is a one-line
            uncomment-and-re-import.

        <button
          type="button"
          className="auth-form__social-btn"
          onClick={() => { window.location.href = appleLoginUrl }}
        >
          <AppleIcon />
          Continue with Apple
        </button>

        */}
      </div>

      {/* App promo card */}
      <aside className="auth-form__promo">
        <div className="auth-form__promo-left">
          <h3 className="auth-form__promo-title">Get the most out of your care</h3>
          <ul className="auth-form__promo-list">
            <li><CheckCircle /> Manage subscriptions</li>
            <li><CheckCircle /> Track orders</li>
            <li><CheckCircle /> Get 24/7 live support</li>
          </ul>
          <div className="auth-form__promo-qr">
            <span className="auth-form__promo-qr-label">Get the Healix App</span>
            <div className="auth-form__promo-qr-img" aria-hidden="true">
              <div className="auth-form__promo-qr-grid">
                {Array.from({ length: 49 }).map((_, i) => (
                  <span key={i} data-on={(i * 7 + (i % 3)) % 2} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="auth-form__promo-phone" aria-hidden="true">
          <div className="auth-form__promo-phone-inner">
            <span className="auth-form__promo-phone-header">Welcome,<br />Daniel</span>
            <span className="auth-form__promo-phone-line" />
            <span className="auth-form__promo-phone-line auth-form__promo-phone-line--short" />
          </div>
        </div>
      </aside>
    </form>
  )
}

export default LoginForm
