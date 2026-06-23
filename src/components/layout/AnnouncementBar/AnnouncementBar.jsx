import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './AnnouncementBar.scss'

const AnnouncementBar = ({
  iconSrc = '/images/pill-banner.png',
  message = 'New weight loss treatment, coming soon',
  ctaText = 'Join the waitlist',
  ctaHref = '#',
  dismissible = false,
  storageKey = null,
  onDismiss = null,
  className = '',
}) => {
  const [visible, setVisible] = useState(() => {
    if (storageKey) {
      return localStorage.getItem(storageKey) !== 'dismissed'
    }
    return true
  })

  const [isClosing, setIsClosing] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const updateHeight = () => {
      const height = visible && barRef.current ? barRef.current.offsetHeight : 0
      document.documentElement.style.setProperty(
        '--announcement-bar-height',
        `${height}px`
      )
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('resize', updateHeight)
      document.documentElement.style.setProperty(
        '--announcement-bar-height',
        '0px'
      )
    }
  }, [visible])

  const handleDismiss = () => {
    setIsClosing(true)
    setTimeout(() => {
      setVisible(false)
      if (storageKey) {
        localStorage.setItem(storageKey, 'dismissed')
      }
      if (onDismiss) onDismiss()
    }, 300)
  }

  if (!visible) return null

  return (
    <div
      ref={barRef}
      className={`announcement-bar ${isClosing ? 'announcement-bar--closing' : ''} ${className}`}
      role="banner"
      aria-label="Promotional announcement"
    >
      <div className="announcement-bar__content">
        {iconSrc && (
          <img
            src={iconSrc}
            alt=""
            className="announcement-bar__icon"
            aria-hidden="true"
           loading="lazy" decoding="async"/>
        )}
        <span className="announcement-bar__message">{message}</span>
        {ctaText && ctaHref && (
          <Link to={ctaHref} className="announcement-bar__cta">
            <span className="announcement-bar__cta-text">{ctaText}</span>
            <svg
              className="announcement-bar__cta-arrow"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>

      {dismissible && (
        <button
          className="announcement-bar__close"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default AnnouncementBar
