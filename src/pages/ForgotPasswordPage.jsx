import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from '@/lib/supabaseAuth'
import './ForgotPasswordPage.scss'

/**
 * "Forgot password" entry-point.
 *
 * Migrated to Supabase: we hand the email off to
 * `supabase.auth.resetPasswordForEmail()`, which sends a real reset email
 * server-side. The old dev-preview link block (which surfaced a localhost
 * URL because no backend mailer was wired up) is gone.
 *
 * Like the previous implementation, this page resolves to a generic
 * "check your inbox" success regardless of whether the email exists —
 * Supabase prevents account enumeration internally, so we don't surface
 * "email not found" errors back to the form.
 */

const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const invalid = !email || !validateEmail(email.trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (invalid || loading) return
    setError('')
    setLoading(true)
    try {
      await sendPasswordResetEmail({ email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send the reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot">
      <div className="forgot__container">
        <Link to="/" className="forgot__back">&larr; Back to home</Link>

        <h1 className="forgot__title">Reset your password</h1>
        <p className="forgot__sub">
          Enter the email associated with your account and we&rsquo;ll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="forgot__result" role="status">
            <p className="forgot__result-title">Check your inbox</p>
            <p className="forgot__result-text">
              If an account exists for <strong>{email.trim()}</strong>, a reset link has been sent. The link is valid for a limited time — check your spam folder if it does not arrive within a few minutes.
            </p>
            <div className="forgot__after">
              <button
                type="button"
                className="forgot__link-btn"
                onClick={() => { setSent(false) }}
              >
                Resend reset link
              </button>
              <Link to="/" className="forgot__link">Return to login</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="forgot__form">
            <label className="forgot__field">
              <span className="forgot__label">Email</span>
              <input
                type="email"
                className={`forgot__input ${touched && invalid ? 'forgot__input--error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />
              {touched && !email && <span className="forgot__error">Email is required</span>}
              {touched && email && !validateEmail(email.trim()) && (
                <span className="forgot__error">Enter a valid email</span>
              )}
            </label>

            {error && (
              <p className="forgot__banner" role="alert">{error}</p>
            )}

            <button type="submit" className="forgot__submit" disabled={loading || invalid}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>

            <p className="forgot__footer">
              Remember your password?{' '}
              <Link to="/" className="forgot__link">Back to login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
