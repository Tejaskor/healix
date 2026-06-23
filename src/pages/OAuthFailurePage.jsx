import { useSearchParams, Link } from 'react-router-dom'
import './OAuthPage.scss'

const REASONS = {
  cancelled: 'Login cancelled.',
  'oauth-error': 'Something went wrong with the sign-in provider.',
  'session-error': 'We could not start your session. Please try again.',
  'google-not-configured': 'Google sign-in is not configured on this server. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to server/.env.',
}

const OAuthFailurePage = () => {
  const [params] = useSearchParams()
  const reason = params.get('reason')
  const message = REASONS[reason] || 'Something went wrong. Please try again.'

  return (
    <div className="oauth-page">
      <div className="oauth-page__card">
        <p className="oauth-page__title">Sign-in failed</p>
        <p className="oauth-page__sub">{message}</p>
        <Link to="/" className="oauth-page__btn">Back to home</Link>
      </div>
    </div>
  )
}

export default OAuthFailurePage
