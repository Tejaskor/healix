import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { updatePassword } from '@/lib/supabaseAuth'
import { supabase } from '@/lib/supabase'
import './ForgotPasswordPage.scss'

/**
 * Reset-password landing page.
 *
 * --------------------------------------------------------------------
 * How the new Supabase recovery flow works
 * --------------------------------------------------------------------
 *  1. User submits their email on /forgot-password.
 *  2. Supabase sends a real email with a link of the form
 *       https://<project>.supabase.co/auth/v1/verify?...&redirect_to=
 *         <our-app>/healix/reset-password
 *  3. User clicks the link. Supabase verifies the token and 302s to
 *     /healix/reset-password with
 *       #access_token=...&refresh_token=...&type=recovery
 *  4. The supabase client (configured with `detectSessionInUrl: true`
 *     in src/lib/supabase.js) auto-parses the hash, persists a recovery
 *     session, and fires `onAuthStateChange('PASSWORD_RECOVERY', ...)`.
 *  5. AuthContext mirrors that into `user`, flipping `isLoggedIn` true.
 *  6. This page renders the new-password form. On submit, we call
 *     `supabase.auth.updateUser({ password })` — which Supabase ONLY
 *     accepts inside a recovery session, so the user can't be redirected
 *     here mid-session to change someone else's password.
 *  7. On success, sign out and bounce to home + open the login panel.
 * --------------------------------------------------------------------
 *
 * No ?token query param is read anymore — the previous custom-token
 * flow has been retired in favour of Supabase's session recovery.
 */

const passwordStrength = (pw) => {
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[!@#$%^&*()_\-+={}[\]:;"'<>,.?/\\|`~]/.test(pw)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score] }
}

const validate = ({ password, confirm }) => {
  const errors = {}
  if (!password) errors.password = 'Password is required'
  else if (password.length < 8) errors.password = 'At least 8 characters'
  else if (!/[A-Z]/.test(password)) errors.password = 'Include an uppercase letter'
  else if (!/\d/.test(password)) errors.password = 'Include a number'
  else if (!/[!@#$%^&*()_\-+={}[\]:;"'<>,.?/\\|`~]/.test(password)) errors.password = 'Include a special character'

  if (!confirm) errors.confirm = 'Please confirm your password'
  else if (confirm !== password) errors.confirm = 'Passwords do not match'

  return errors
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()

  // Three-state machine: while we wait for Supabase to detect the recovery
  // session from the URL hash, show "checking…". If a session arrives we
  // flip to "ready" and render the form. If nothing arrives within 2 s
  // we flip to "invalid" and show the "request a new link" error state.
  const [phase, setPhase] = useState(isLoggedIn ? 'ready' : 'checking')

  const [values, setValues] = useState({ password: '', confirm: '' })
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(false)

  const errors = validate(values)
  const invalid = Object.keys(errors).length > 0
  const strength = useMemo(() => passwordStrength(values.password), [values.password])

  // Phase transitions — driven by Supabase's PASSWORD_RECOVERY event and
  // the existing AuthContext session.
  useEffect(() => {
    if (isLoggedIn) {
      setPhase('ready')
      return
    }
    // Subscribe directly to PASSWORD_RECOVERY in case AuthContext hasn't
    // updated yet on the same tick the hash was parsed.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setPhase('ready')
      }
    })
    // 2-second guard: if we still have no session, show the invalid state.
    const t = setTimeout(() => {
      setPhase((p) => (p === 'ready' ? p : 'invalid'))
    }, 2000)
    return () => {
      clearTimeout(t)
      sub?.subscription?.unsubscribe?.()
    }
  }, [isLoggedIn])

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    if (submitError) setSubmitError('')
  }
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ password: true, confirm: true })
    if (invalid || loading) return
    setSubmitError('')
    setLoading(true)
    try {
      await updatePassword({ newPassword: values.password })
      setDone(true)
      // Sign out the recovery session so the user has to log in with the
      // new password — clean, well-understood UX.
      await logout()
      setTimeout(() => {
        navigate('/')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-auth', { detail: { view: 'login' } }))
        }, 300)
      }, 1500)
    } catch (err) {
      setSubmitError(err.message || 'Could not reset your password')
    } finally {
      setLoading(false)
    }
  }

  // ─── Render states ──────────────────────────────────────────────────

  if (phase === 'invalid') {
    return (
      <div className="forgot">
        <div className="forgot__container">
          <h1 className="forgot__title">Invalid or expired reset link</h1>
          <p className="forgot__sub">
            This reset link is no longer valid. Reset links expire after a short period — please request a new one.
          </p>
          <Link to="/forgot-password" className="forgot__submit">Request new link</Link>
        </div>
      </div>
    )
  }

  if (phase === 'checking') {
    return (
      <div className="forgot">
        <div className="forgot__container">
          <h1 className="forgot__title">Verifying your link…</h1>
          <p className="forgot__sub">Just a moment.</p>
        </div>
      </div>
    )
  }

  // phase === 'ready' — recovery session is active.
  return (
    <div className="forgot">
      <div className="forgot__container">
        <Link to="/" className="forgot__back">&larr; Back to home</Link>
        <h1 className="forgot__title">Set a new password</h1>
        <p className="forgot__sub">Choose a strong password you haven&rsquo;t used before.</p>

        {done ? (
          <div className="forgot__result" role="status">
            <p className="forgot__result-title">Password updated</p>
            <p className="forgot__result-text">Redirecting you to log in…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="forgot__form">
            <label className="forgot__field">
              <span className="forgot__label">New password</span>
              <input
                type="password"
                name="password"
                className={`forgot__input ${touched.password && errors.password ? 'forgot__input--error' : ''}`}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                autoComplete="new-password"
              />
              {values.password && (
                <span className={`forgot__strength forgot__strength--${strength.score}`}>
                  <span className="forgot__strength-bar">
                    <span style={{ width: `${(strength.score / 4) * 100}%` }} />
                  </span>
                  <span>{strength.label}</span>
                </span>
              )}
              {touched.password && errors.password && <span className="forgot__error">{errors.password}</span>}
            </label>

            <label className="forgot__field">
              <span className="forgot__label">Confirm password</span>
              <input
                type="password"
                name="confirm"
                className={`forgot__input ${touched.confirm && errors.confirm ? 'forgot__input--error' : ''}`}
                value={values.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
              {touched.confirm && errors.confirm && <span className="forgot__error">{errors.confirm}</span>}
            </label>

            {submitError && (
              <p className="forgot__banner" role="alert">{submitError}</p>
            )}

            <button type="submit" className="forgot__submit" disabled={loading || invalid}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage
