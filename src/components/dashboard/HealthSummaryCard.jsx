const ScaleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="7" width="18" height="14" rx="3" />
    <path d="M8 7V5a4 4 0 018 0v2" />
    <path d="M12 12v4" />
  </svg>
)

const HealthSummaryCard = ({ currentWeight, targetWeight, startWeight, bmi, category }) => {
  // Progress: distance between start and target, relative to how far user has come.
  const total = Math.max(1, Math.abs((startWeight ?? currentWeight) - targetWeight))
  const done = Math.max(0, (startWeight ?? currentWeight) - currentWeight)
  const progressPct = Math.min(100, Math.round((done / total) * 100))

  return (
    <section className="dash-card dash-summary">
      <header className="dash-card__header">
        <span className="dash-card__icon"><ScaleIcon /></span>
        <h2 className="dash-card__title">Health summary</h2>
      </header>

      <div className="dash-summary__grid">
        <div className="dash-summary__stat">
          <span className="dash-summary__stat-label">Current</span>
          <span className="dash-summary__stat-value">{currentWeight}<span>kg</span></span>
        </div>
        <div className="dash-summary__stat">
          <span className="dash-summary__stat-label">Target</span>
          <span className="dash-summary__stat-value">{targetWeight}<span>kg</span></span>
        </div>
        <div className="dash-summary__stat">
          <span className="dash-summary__stat-label">BMI</span>
          <span className="dash-summary__stat-value">{bmi ?? '—'}</span>
          {category && <span className="dash-summary__stat-sub">{category}</span>}
        </div>
      </div>

      <div className="dash-summary__progress">
        <div className="dash-summary__progress-head">
          <span>Progress</span>
          <strong>{progressPct}%</strong>
        </div>
        <div className="dash-summary__progress-track">
          <div className="dash-summary__progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </section>
  )
}

export default HealthSummaryCard
