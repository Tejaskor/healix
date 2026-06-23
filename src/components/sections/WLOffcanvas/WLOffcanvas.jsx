import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollLock from '@/hooks/useScrollLock'
import './WLOffcanvas.scss'

const exploreLinks = [
  'Weight Loss Treatments',
  'Membership',
  'The Science',
  'Calculate Your Body Mass Index',
]

const treatments = [
  { name: 'GLP-1 Pill', rx: true, isNew: true },
  { name: 'GLP-1 Pen', rx: true, isNew: true },
  { name: 'Ozempic®', rx: true },
  { name: 'Generic Liraglutide®', rx: true },
  { name: 'Zepbound®', rx: true },
  { name: 'Mounjaro®', rx: true },
  { name: 'Meal Replacement Kits' },
]

const throughHealix = [
  "See If You're Eligible",
  'Calculate Your Body Mass Index',
  'Calculate Your Daily Calories Burned',
  'Calculate Your Caloric Deficit',
  'Calculate Your Daily Water Intake',
]

const learnLinks = [
  'Pricing',
  'FSA/HSA Reimbursements',
  'Healix Benefits',
]

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WLOffcanvas = ({ isOpen, onClose, from }) => {
  const [view, setView] = useState('main')
  const navigate = useNavigate()

  const handleBack = () => {
    if (view !== 'main') {
      setView('main')
      return
    }
    onClose()
    // Close the underlying sidebar at the same time so both layered
    // panels slide out together rather than in two visible steps.
    if (from) {
      window.dispatchEvent(new Event('close-sidebar'))
    }
  }

  // Lock background scroll while open (scrollbar-width compensated, no flicker).
  useScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('main'), 350)
    }
  }, [isOpen])

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
      {/* Overlay */}
      <div className={`wl-oc__overlay ${isOpen ? 'wl-oc__overlay--visible' : ''}`} onClick={onClose} />

      {/* Panel */}
      <div className={`wl-oc ${isOpen ? 'wl-oc--open' : ''}`}>

        {/* Header */}
        <div className="wl-oc__header">
          {(view !== 'main' || from) && (
            <button className="wl-oc__icon-btn" onClick={handleBack} aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
          <span className="wl-oc__title">Weight Loss</span>
          <div className="wl-oc__header-right">
            <button className="wl-oc__icon-btn" aria-label="Profile" aria-disabled="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <button className="wl-oc__icon-btn" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="wl-oc__body">

          {/* ── MAIN VIEW ── */}
          <div className={`wl-oc__view ${view === 'main' ? 'wl-oc__view--active' : ''}`}>

            {/* Hero Card */}
            <div className="wl-oc__hero">
              <img src="/images/h-Nav-WL.webp" alt="" className="wl-oc__hero-img"  loading="lazy" decoding="async"/>
              <div className="wl-oc__hero-overlay">
                <p className="wl-oc__hero-text">Ready to lose weight?</p>
                <p className="wl-oc__hero-cta">Start here</p>
                <button className="wl-oc__hero-btn" aria-disabled="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Explore */}
            <div className="wl-oc__section">
              <span className="wl-oc__label">EXPLORE</span>
              <div className="wl-oc__card">
                {exploreLinks.map((item) => (
                  <button
                    key={item}
                    className="wl-oc__item"
                    aria-disabled={item === 'Calculate Your Body Mass Index' ? 'true' : undefined}
                    onClick={() => {
                      // Close BOTH layered offcanvases in the SAME
                      // synchronous tick so they slide out in lock-step.
                      // navigate() is called last so the route-change
                      // watcher sees both layers already mid-exit.
                      const goTo = (path) => {
                        if (from) {
                          window.dispatchEvent(new Event('close-sidebar'))
                        }
                        onClose()
                        navigate(path)
                      }
                      if (item === 'Weight Loss Treatments') {
                        goTo('/weight-loss')
                      } else if (item === 'Membership') {
                        goTo('/membership')
                      } else if (item === 'The Science') {
                        goTo('/science')
                      }
                    }}
                  >
                    <span>{item}</span>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </div>

            {/* Treatments */}
            <div className="wl-oc__section">
              <span className="wl-oc__label">TREATMENTS</span>
              <div className="wl-oc__card">
                {treatments.map((t) => (
                  <button key={t.name} className="wl-oc__item" aria-disabled="true">
                    <span className="wl-oc__item-text">
                      {t.name}
                      {t.rx && <span className="wl-oc__tag wl-oc__tag--rx">Rx</span>}
                      {t.isNew && <span className="wl-oc__tag wl-oc__tag--new">New</span>}
                    </span>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </div>

            {/* Through Healix */}
            <div className="wl-oc__section">
              <span className="wl-oc__label">THROUGH HEALIX</span>
              <div className="wl-oc__card">
                {throughHealix.map((item) => (
                  <button key={item} className="wl-oc__item" aria-disabled="true">
                    <span>{item}</span>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </div>

            {/* Learn */}
            <div className="wl-oc__section">
              <span className="wl-oc__label">LEARN</span>
              <div className="wl-oc__card">
                {learnLinks.map((item) => (
                  <button key={item} className="wl-oc__item" aria-disabled="true">
                    <span>{item}</span>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default WLOffcanvas
