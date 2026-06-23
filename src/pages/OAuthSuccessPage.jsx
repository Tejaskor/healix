import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './OAuthPage.scss'

/**
 * OAuth landing page.
 *
 * With the new Supabase flow, by the time the browser lands here:
 *   • Supabase has appended tokens to the URL hash, e.g.
 *       /auth/success#access_token=…&refresh_token=…&expires_in=…
 *   • The Supabase client (detectSessionInUrl: true, see src/lib/supabase.js)
 *     auto-parses that hash, persists the session, and fires
 *     onAuthStateChange('SIGNED_IN', …).
 *   • AuthContext is subscribed to that event and writes the user record.
 *
 * So we just sit and wait for `isLoggedIn` to flip true, then route. A 10s
 * timeout guards against the user navigating here directly with no OAuth
 * payload, or the redirect being blocked.
 */
const OAuthSuccessPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn, assessmentCompleted } = useAuth()
  const [error, setError] = useState('')

  // Once Supabase has set the session and AuthContext has reflected it,
  // route the user to the right next step. `replace: true` so the landing
  // URL with hash tokens doesn't stay in browser history.
  useEffect(() => {
    if (!isLoggedIn) return
    navigate(assessmentCompleted ? '/dashboard' : '/onboarding/assessment', { replace: true })
  }, [isLoggedIn, assessmentCompleted, navigate])

  // Fail-safe: if no session has materialised after 10 s, surface an error.
  // This covers the "navigated here without a real callback" case and any
  // misconfigured-redirect-URL failures.
  useEffect(() => {
    if (isLoggedIn) return
    const t = setTimeout(() => {
      if (!isLoggedIn) setError('Sign-in did not complete. Please try again.')
    }, 10000)
    return () => clearTimeout(t)
  }, [isLoggedIn])

  return (
    <div className="oauth-page">
      <div className="oauth-page__card">
        {error ? (
          <>
            <p className="oauth-page__title">Something went wrong</p>
            <p className="oauth-page__sub">{error}</p>
            <a href="/" className="oauth-page__btn">Back to home</a>
          </>
        ) : (
          <>
            <div className="oauth-page__spinner" aria-hidden="true" />
            <p className="oauth-page__title">Signing you in…</p>
            <p className="oauth-page__sub">Just a moment while we set things up.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default OAuthSuccessPage
