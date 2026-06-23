import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShieldCheck } from 'lucide-react'

/**
 * Premium BMI summary card.
 *
 * - Circular SVG gauge that animates from 0 → the user's BMI on mount.
 * - The arc tone follows the clinical category (good / warn / alert).
 * - Category renders as a coloured pill.
 * - "Clinically reviewed" trust chip sits next to the value.
 *
 * BMI value is presented as the dominant number; the surrounding
 * typography and a soft beige → white card background give it the
 * weight of a "result" rather than a stat tile.
 */

const CATEGORY = {
  low:     { label: 'Underweight', tone: 'low' },
  good:    { label: 'Healthy',     tone: 'good' },
  warn:    { label: 'Overweight',  tone: 'warn' },
  alert:   { label: 'Obese',       tone: 'alert' },
  neutral: { label: 'N/A',         tone: 'neutral' },
}

const categoryFromBmi = (bmi) => {
  if (bmi == null) return CATEGORY.neutral
  if (bmi < 18.5) return CATEGORY.low
  if (bmi < 25)   return CATEGORY.good
  if (bmi < 30)   return CATEGORY.warn
  return CATEGORY.alert
}

const BmiResultCard = ({ bmi, recommendation }) => {
  const cat = categoryFromBmi(bmi)

  // Ring fill — map BMI onto a 15..40 scale so the arc fills meaningfully
  // for any realistic adult value. Underweight users get a partial fill,
  // obese users approach the full arc.
  const target = bmi == null ? 0 : Math.max(0, Math.min(1, (bmi - 15) / 25))
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const duration = 1000
    const step = (t) => {
      const k = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - k, 3) // ease-out cubic
      setShown(target * eased)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])

  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - shown)

  // Animated BMI number (counts up).
  const [shownBmi, setShownBmi] = useState(0)
  useEffect(() => {
    if (bmi == null) return
    let raf
    const start = performance.now()
    const duration = 1000
    const step = (t) => {
      const k = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - k, 3)
      setShownBmi(+(bmi * eased).toFixed(1))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [bmi])

  return (
    <motion.section
      className={`bmi-card bmi-card--${cat.tone}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="BMI result summary"
    >
      <div className="bmi-card__ring" aria-hidden="true">
        <svg width="148" height="148" viewBox="0 0 148 148">
          <circle cx="74" cy="74" r={radius} className="bmi-card__ring-track" />
          <circle
            cx="74"
            cy="74"
            r={radius}
            className="bmi-card__ring-fill"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="bmi-card__ring-value">
          <strong>{bmi == null ? '—' : shownBmi}</strong>
          <span>BMI</span>
        </div>
      </div>

      <div className="bmi-card__body">
        <div className="bmi-card__chips">
          <span className={`bmi-card__chip bmi-card__chip--${cat.tone}`}>
            <Heart size={12} strokeWidth={2.5} />
            {cat.label}
          </span>
          <span className="bmi-card__chip bmi-card__chip--trust">
            <ShieldCheck size={12} strokeWidth={2.5} />
            Clinically reviewed
          </span>
        </div>
        <h2 className="bmi-card__title">Your personalised result</h2>
        {recommendation && (
          <p className="bmi-card__recommendation">{recommendation}</p>
        )}
      </div>
    </motion.section>
  )
}

export default BmiResultCard
