import { useState } from 'react'
import InputField from '@/components/common/InputField/InputField'
import Button from '@/components/common/Button/Button'
import './EmailSignup.scss'

const EmailSignup = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validate = (value) => {
    if (!value.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate(email)
    if (err) {
      setError(err)
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <section className="cta">
      <div className="cta__container">
        <div className="cta__content">
          <h2 className="cta__title">
            Start your
            <br />
            wellness
            <br />
            journey
          </h2>
          <p className="cta__description">
            Science-backed guidance for healthier living.
          </p>

          {submitted ? (
            <p className="cta__success">
              You&apos;re in! Check your inbox for your guide.
            </p>
          ) : (
            <form className="cta__form" onSubmit={handleSubmit}>
              <InputField
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                error={error}
              />
              <Button variant="primary" type="submit" size="lg" className="cta__button">
                Access the Guide
              </Button>
            </form>
          )}

          <p className="cta__legal">
            By submitting, you agree to our{' '}
            <a href="/terms" className="cta__link">Terms &amp; Conditions</a>
            {' '}and{' '}
            <a href="/privacy" className="cta__link">Privacy Policy</a>.
            We&apos;ll never share your information.
          </p>
        </div>
      </div>
    </section>
  )
}

export default EmailSignup
