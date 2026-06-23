import ActivityChart from './ActivityChart'
import GoalProgress from './GoalProgress'

/**
 * Personalised weekly progress tracker. Wraps the activity chart with
 * the four animated goal bars (water / sleep / workouts / weight goal),
 * all driven by the per-user data from useDashboardData.
 *
 * Renders an empty state when no weekly data has been recorded yet.
 */
const ProgressTracker = ({ data }) => {
  if (!data) return null

  const monthlyLoss =
    data.currentWeight && data.targetWeight
      ? +(data.currentWeight - data.targetWeight).toFixed(1)
      : null

  return (
    <section className="dash-card dash-progress">
      <header className="dash-card__header">
        <h2 className="dash-card__title">Progress tracker</h2>
        {monthlyLoss != null && (
          <span className="dash-progress__delta">
            <strong>{monthlyLoss} kg</strong> to your goal
          </span>
        )}
      </header>

      {/* Recharts-powered weekly bar chart with hover tooltips. */}
      <ActivityChart data={data.weeklyProgress} />

      <div className="dash-progress__goals">
        <GoalProgress
          kind="water"
          current={data.waterIntake}
          target={data.waterGoal}
        />
        <GoalProgress
          kind="sleep"
          current={data.sleepHours}
          target={data.sleepGoal}
        />
        {data.currentWeight != null && data.targetWeight != null && (
          <GoalProgress
            kind="weight"
            current={data.currentWeight}
            target={data.targetWeight}
            invert
          />
        )}
      </div>
    </section>
  )
}

export default ProgressTracker
