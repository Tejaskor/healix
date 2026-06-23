import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

/**
 * Circular SVG gauge showing the user's 0–100 health score. Number
 * animates up to the target on mount; arc length follows.
 */
const HealthScoreCard = ({ score = 0 }) => {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const duration = 900
    const from = 0
    const to = Math.max(0, Math.min(100, Math.round(score)))
    const step = (t) => {
      const k = Math.min(1, (t - start) / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - k, 3)
      setShown(Math.round(from + (to - from) * eased))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [score])

  const r = 52
  const c = 2 * Math.PI * r
  const offset = c - (shown / 100) * c

  const tone =
    shown >= 80 ? 'good' : shown >= 60 ? 'warn' : 'alert'

  return (
    <section className={`dash-card dash-score dash-score--${tone}`}>
      <header className="dash-card__header">
        <h2 className="dash-card__title">
          <Heart size={16} strokeWidth={2} className="dash-card__title-icon" />
          Health score
        </h2>
      </header>

      <div className="dash-score__body">
        <div className="dash-score__ring" aria-hidden="true">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={r} className="dash-score__ring-track" />
            <circle
              cx="70"
              cy="70"
              r={r}
              className="dash-score__ring-fill"
              style={{ strokeDasharray: c, strokeDashoffset: offset }}
            />
          </svg>
          <div className="dash-score__value">
            <strong>{shown}</strong>
            <span>/ 100</span>
          </div>
        </div>
        <p className="dash-score__label">
          {tone === 'good' && 'Excellent — keep it up.'}
          {tone === 'warn' && 'Good — a few small wins will push you higher.'}
          {tone === 'alert' && 'Room to improve — start with sleep and steps.'}
        </p>
      </div>
    </section>
  )
}

export default HealthScoreCard
