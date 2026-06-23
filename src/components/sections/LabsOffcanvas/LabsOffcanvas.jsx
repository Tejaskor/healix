import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollLock from '@/hooks/useScrollLock'
import './LabsOffcanvas.scss'

const exploreLinks = [
  'Labs',
  'Key Health Metrics',
  'What We Analyze',
  'Advanced Cancer Screening',
]

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LabsOffcanvas = ({ isOpen, onClose, from }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    onClose()
    // Close the underlying sidebar at the same time so both layered
    // panels slide out together rather than in two visible steps.
    if (from) {
      window.dispatchEvent(new Event('close-sidebar'))
    }
  }

  // Lock background scroll while open (scrollbar-width compensated, no flicker).
  useScrollLock(isOpen)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  return (
    <>
      <div className={`labs-oc__overlay ${isOpen ? 'labs-oc__overlay--visible' : ''}`} onClick={onClose} />

      <div className={`labs-oc ${isOpen ? 'labs-oc--open' : ''}`}>
        <div className="labs-oc__header">
          <button
            type="button"
            className="labs-oc__icon-btn labs-oc__back-btn"
            onClick={handleBack}
            aria-label={from ? 'Back' : 'Close menu'}
          >
            <BackIcon />
          </button>
          <span className="labs-oc__title">Labs</span>
          <div className="labs-oc__header-right">
            <button className="labs-oc__icon-btn" aria-label="Profile" aria-disabled="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className="labs-oc__icon-btn" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="labs-oc__body">
          {/* Hero Card */}
          <div className="labs-oc__hero">
            <img src="/images/h-Labs-Nav-D.webp" alt="" className="labs-oc__hero-img"  loading="lazy" decoding="async"/>
            <button type="button" className="labs-oc__hero-text" aria-disabled="true">Better Health Starts Here</button>
            <button type="button" className="labs-oc__hero-btn" aria-label="Start testing today" aria-disabled="true">
              <ArrowRight />
            </button>
          </div>

          {/* Explore */}
          <div className="labs-oc__section">
            <span className="labs-oc__label">EXPLORE</span>
            <div className="labs-oc__card">
              {exploreLinks.map((item) => {
                // Synchronous helper — runs every state flip in the
                // SAME React batch so the labs offcanvas slide-out and
                // the underlying sidebar slide-out start in the SAME
                // animation frame. `navigate()` is called last so the
                // route change effect (`prevPathRef`) sees both layers
                // already closing and doesn't re-trigger them.
                const goTo = (path) => {
                  if (from) {
                    window.dispatchEvent(new Event('close-sidebar'))
                  }
                  onClose()
                  navigate(path)
                }
                return (
                  <button
                    key={item}
                    className="labs-oc__item"
                    onClick={() => {
                      if (item === 'Labs') goTo('/labs')
                      else if (item === 'Key Health Metrics' || item === 'What We Analyze') goTo('/labs/what-we-test')
                      else if (item === 'Advanced Cancer Screening') goTo('/labs/cancer-screening')
                    }}
                  >
                    <span>{item}</span>
                    <ChevronRight />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LabsOffcanvas
