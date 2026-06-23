import { Footprints, Flame, Droplet, Moon } from 'lucide-react'

const ICONS = {
  steps: Footprints,
  calories: Flame,
  water: Droplet,
  sleep: Moon,
}

/**
 * Reusable single-metric "stat" tile used in the daily metrics row.
 * Hover lifts the card; the icon sits in a tinted soft-green pill.
 *
 * Props:
 *   kind     — one of: steps | calories | water | sleep (affects icon)
 *   label    — display label, e.g. "Steps"
 *   value    — main value, e.g. 6240
 *   unit     — optional unit string ("kcal", "L", "h")
 *   sublabel — optional second line ("Goal: 10,000")
 */
const ProgressCard = ({ kind, label, value, unit = '', sublabel }) => {
  const Icon = ICONS[kind] || Footprints
  return (
    <article className={`dash-stat dash-stat--${kind}`}>
      <span className="dash-stat__icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="dash-stat__body">
        <p className="dash-stat__label">{label}</p>
        <p className="dash-stat__value">
          <strong>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </strong>
          {unit && <span className="dash-stat__unit">{unit}</span>}
        </p>
        {sublabel && <p className="dash-stat__sub">{sublabel}</p>}
      </div>
    </article>
  )
}

export default ProgressCard
