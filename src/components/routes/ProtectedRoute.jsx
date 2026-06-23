import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Wraps a private route with auth + onboarding gating.
 *
 * - If not logged in: sends user home and opens the Auth offcanvas via event.
 * - If logged in but assessment not completed (and `requireAssessment`):
 *   redirects to /onboarding/assessment.
 */
const ProtectedRoute = ({ children, requireAssessment = true }) => {
  const { isLoggedIn, assessmentCompleted } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!isLoggedIn) {
      // Open the auth offcanvas once the redirect lands on home.
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-auth', { detail: { view: 'login' } }))
      }, 50)
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  if (requireAssessment && !assessmentCompleted) {
    return <Navigate to="/onboarding/assessment" replace />
  }

  return children
}

export default ProtectedRoute
