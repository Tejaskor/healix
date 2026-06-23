import { useEffect, useState } from 'react'
import { Droplet, Moon, Dumbbell, Scale } from 'lucide-react'

const ICONS = { water: Droplet, sleep: Moon, workout: Dumbbell, weight: Scale }
const LABELS = {
  water: 'Water',
  sleep: 'Sleep',
  workout: 'Workout',
  weight: 'Weight goal',
}
const UNITS = {
  water: 'L',
  sleep: 'h',
  workout: '',
  weight: 'kg',
}

/**
 * Animated horizontal progress bar for a single goal. The fill bar
 * animates from 0 → percent on mount (and on prop change) using a CSS
 * transition, which keeps the JS bundle tiny.
 *
 * Pass `kind` to pick the icon + colour accent.
 */
const GoalProgress = ({
  kind = 'water',
  current = 0,
  target = 1,
  invert = false, // for weight: lower is better
}) => {
  const Icon = ICONS[kind] || Droplet
  const unit = UNITS[kind] || ''
  const label = LABELS[kind] || kind

  // For weight goals, "progress" means how close current is to target
  // FROM whatever the start was. For UX simplicity we just show the
  // fraction of remaining vs already-covered using a healthy bound.
  let percent
  if (invert) {
    // Weight: assume a 10kg journey; show progress relative to that.
    const span = 10
    const closed = Math.max(0, span - Math.abs(current - target))
    percent = Math.min(100, Math.round((closed / span) * 100))
  } else {
    percent = Math.min(100, Math.round((current / target) * 100))
  }

  const [shown, setShown] = useState(0)
  useEffect(() => {
    // Defer by one frame so the CSS transition catches the change.
    const id = requestAnimationFrame(() => setShown(percent))
    return () => cancelAnimationFrame(id)
  }, [percent])

  return (
    <div className={`dash-goal dash-goal--${kind}`}>
      <div className="dash-goal__row">
        <span className="dash-goal__icon" aria-hidden="true">
          <Icon size={16} strokeWidth={2} />
        </span>
        <span className="dash-goal__label">{label}</span>
        <span className="dash-goal__value">
          {current}
          {unit} <em>/ {target}{unit}</em>
        </span>
      </div>
      <div
        className="dash-goal__track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} progress`}
      >
        <span
          className="dash-goal__fill"
          style={{ width: `${shown}%` }}
        />
      </div>
    </div>
  )
}

export default GoalProgress
