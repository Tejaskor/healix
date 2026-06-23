import { Flame } from 'lucide-react'

/**
 * Streak empty state — no fake "8 day" number. Once the user logs
 * activity on consecutive days, the real StreakCard replaces this.
 */
const EmptyStreakCard = () => (
  <section className="dash-card dash-streak dash-streak--empty">
    <div className="dash-streak__icon" aria-hidden="true">
      <Flame size={28} strokeWidth={2} />
    </div>
    <div className="dash-streak__body">
      <p className="dash-streak__count">
        <strong>0</strong>
        <span> Day</span>
      </p>
      <p className="dash-streak__label">Start your first healthy streak 🔥</p>
    </div>
  </section>
)

export default EmptyStreakCard
