import { useMemo, useState } from 'react'
import { signUpWithEmail } from '@/lib/supabaseAuth'

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.06 10.06 0 0112 20c-7 0-11-8-11-8a20.15 20.15 0 014.22-5.18" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a19.7 19.7 0 01-3.22 4.19" />
        <path d="M1 1l22 22" />
      </>
    )}
  </svg>
)

const validate = (values) => {
  const errors = {}
  if (!values.fullName) errors.fullName = 'Full name is required'
  else if (values.fullName.trim().length < 3) errors.fullName = 'Must be at least 3 characters'
  else if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(values.fullName.trim())) errors.fullName = 'Only letters are allowed'

  if (!values.email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email'

  if (!values.password) errors.password = 'Password is required'
  else {
    if (values.password.length < 8) errors.password = 'At least 8 characters'
    else if (!/[A-Z]/.test(values.password)) errors.password = 'Include an uppercase letter'
    else if (!/\d/.test(values.password)) errors.password = 'Include a number'
    else if (!/[!@#$%^&*()_\-+={}[\]:;"'<>,.?/\\|`~]/.test(values.password)) errors.password = 'Include a special character'
  }

  if (!values.confirm) errors.confirm = 'Please confirm your password'
  else if (values.confirm !== values.password) errors.confirm = 'Passwords do not match'

  if (!values.terms) errors.terms = 'You must accept the terms'

  return errors
}

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

const SignupForm = ({ onSwitchToLogin, onSuccess }) => {
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirm: '', terms: false })
  const [touched, setTouched] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = validate(values)
  const invalid = Object.keys(errors).length > 0
  const strength = useMemo(() => passwordStrength(values.password), [values.password])

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
    if (submitError) setSubmitError('')
  }
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ fullName: true, email: true, password: true, confirm: true, terms: true })
    if (invalid || loading) return
    setSubmitError('')
    setLoading(true)
    try {
      // Supabase handles password hashing (bcrypt, server-side) and creates
      // a row in auth.users. A db trigger then mirrors the full_name into
      // public.profiles — see SETUP block in this file's wrapper for the SQL.
      const user = await signUpWithEmail({
        email: values.email.trim(),
        password: values.password,
        fullName: values.fullName.trim(),
      })
      // Keep the existing onSuccess contract — { email, fullName } —
      // so AuthContext.login() and the post-signup onboarding redirect
      // continue to work without changes downstream.
      onSuccess?.(user)
    } catch (err) {
      setSubmitError(err.message || 'Could not create your account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Create your account</h2>

      <label className="auth-form__field">
        <input
          type="text"
          name="fullName"
          autoComplete="name"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-form__input ${touched.fullName && errors.fullName ? 'auth-form__input--error' : ''}`}
          placeholder="Full name"
        />
        {touched.fullName && errors.fullName && <span className="auth-form__error">{errors.fullName}</span>}
      </label>

      <label className="auth-form__field">
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-form__input ${touched.email && errors.email ? 'auth-form__input--error' : ''}`}
          placeholder="Email"
        />
        {touched.email && errors.email && <span className="auth-form__error">{errors.email}</span>}
      </label>

      <label className="auth-form__field">
        <span className="auth-form__input-wrap">
          <input
            type={showPw ? 'text' : 'password'}
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`auth-form__input ${touched.password && errors.password ? 'auth-form__input--error' : ''}`}
            placeholder="Password"
          />
          <button type="button" className="auth-form__eye" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
            <EyeIcon open={showPw} />
          </button>
        </span>
        {values.password && (
          <span className={`auth-form__strength auth-form__strength--${strength.score}`}>
            <span className="auth-form__strength-bar">
              <span style={{ width: `${(strength.score / 4) * 100}%` }} />
            </span>
            <span className="auth-form__strength-label">{strength.label}</span>
          </span>
        )}
        {touched.password && errors.password && <span className="auth-form__error">{errors.password}</span>}
      </label>

      <label className="auth-form__field">
        <span className="auth-form__input-wrap">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirm"
            autoComplete="new-password"
            value={values.confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`auth-form__input ${touched.confirm && errors.confirm ? 'auth-form__input--error' : ''}`}
            placeholder="Confirm password"
          />
          <button type="button" className="auth-form__eye" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
            <EyeIcon open={showConfirm} />
          </button>
        </span>
        {touched.confirm && errors.confirm && <span className="auth-form__error">{errors.confirm}</span>}
      </label>

      <label className="auth-form__terms">
        <input
          type="checkbox"
          name="terms"
          checked={values.terms}
          onChange={handleChange}
          onBlur={handleBlur}
          className="auth-form__terms-input"
        />
        <span className={`auth-form__terms-box ${values.terms ? 'auth-form__terms-box--on' : ''}`}>
          {values.terms && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          )}
        </span>
        <span className="auth-form__terms-text">
          I agree to the <a href="#" aria-disabled="true">Terms</a> and <a href="#" aria-disabled="true">Privacy Policy</a>
        </span>
      </label>
      {touched.terms && errors.terms && <span className="auth-form__error">{errors.terms}</span>}

      {submitError && (
        <p className="auth-form__error auth-form__error--global" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        className="auth-form__submit"
        disabled={loading || invalid}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="auth-form__footer">
        Already have an account?{' '}
        <button type="button" className="auth-form__link-btn" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  )
}

export default SignupForm
