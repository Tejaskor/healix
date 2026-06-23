import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import useScrollLock from '@/hooks/useScrollLock'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import './AuthOffcanvas.scss'

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const OffcanvasAuth = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView)
  const navigate = useNavigate()
  const { login, assessmentCompleted } = useAuth()

  useEffect(() => {
    if (isOpen) setView(initialView)
  }, [isOpen, initialView])

  // Lock background scroll while open (scrollbar-width compensated, no flicker).
  useScrollLock(isOpen)

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  const handleSignupSuccess = (userInfo) => {
    login({ ...userInfo, createdAt: Date.now() })
    onClose()
    // New users always go through onboarding first.
    setTimeout(() => navigate('/onboarding/assessment'), 250)
  }

  const handleLoginSuccess = (userInfo) => {
    login(userInfo)
    onClose()
    // Route based on whether the user has a saved assessment.
    setTimeout(() => {
      navigate(assessmentCompleted ? '/dashboard' : '/onboarding/assessment')
    }, 250)
  }

  return (
    <div className={`auth-oc ${isOpen ? 'auth-oc--open' : ''}`} aria-hidden={!isOpen}>
      <div className="auth-oc__backdrop" onClick={onClose} />
      <aside
        className="auth-oc__panel"
        role="dialog"
        aria-modal="true"
        aria-label={view === 'login' ? 'Login' : 'Create account'}
      >
        <div className="auth-oc__header">
          <button type="button" className="auth-oc__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
          <span className="auth-oc__title">
            {view === 'login' ? 'Login' : 'Create account'}
          </span>
        </div>

        <div className="auth-oc__body">
          {view === 'login' ? (
            <LoginForm
              onSwitchToSignup={() => setView('signup')}
              onSuccess={handleLoginSuccess}
              onForgotPassword={() => { onClose(); setTimeout(() => navigate('/forgot-password'), 250) }}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setView('login')}
              onSuccess={handleSignupSuccess}
            />
          )}
        </div>
      </aside>
    </div>
  )
}

export default OffcanvasAuth
