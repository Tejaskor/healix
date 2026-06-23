import { Heart } from 'lucide-react'

/**
 * Health-score empty state. Used when the user has < 3 activity logs
 * across the week — not enough signal to compute a meaningful score.
 */
const EmptyHealthScore = () => (
  <section className="dash-card dash-score dash-score--empty">
    <header className="dash-card__header">
      <h2 className="dash-card__title">
        <Heart size={16} strokeWidth={2} className="dash-card__title-icon" />
        Health score
      </h2>
    </header>
    <div className="dash-empty-block dash-empty-block--inline">
      <p className="dash-empty-block__title">Not enough data yet</p>
      <p className="dash-empty-block__sub">
        Your health score will appear once enough activity is tracked across
        sleep, water, steps, and workouts.
      </p>
    </div>
  </section>
)

export default EmptyHealthScore
