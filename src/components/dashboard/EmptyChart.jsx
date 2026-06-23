import { BarChart3 } from 'lucide-react'

/**
 * Empty state shown in place of the weekly activity chart when the
 * user has zero activity rows logged this week. Includes a CTA that
 * the parent can wire to scroll to the trackers.
 */
const EmptyChart = ({ onLogFirstActivity }) => (
  <section className="dash-card dash-chart dash-chart--empty">
    <header className="dash-card__header">
      <h2 className="dash-card__title">Weekly activity</h2>
    </header>
    <div className="dash-empty-block">
      <span className="dash-empty-block__icon" aria-hidden="true">
        <BarChart3 size={28} strokeWidth={1.6} />
      </span>
      <p className="dash-empty-block__title">No activity tracked this week.</p>
      <p className="dash-empty-block__sub">
        Once you start logging water, sleep, and steps, your weekly chart will appear here.
      </p>
      {onLogFirstActivity && (
        <button
          type="button"
          className="dash-btn dash-btn--ghost"
          onClick={onLogFirstActivity}
        >
          Log your first activity
        </button>
      )}
    </div>
  </section>
)

export default EmptyChart
