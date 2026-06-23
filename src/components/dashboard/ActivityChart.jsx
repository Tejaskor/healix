import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { Activity } from 'lucide-react'

const PALETTE = {
  dark: '#1A362D',
  deep: '#244236',
  soft: '#dbe7e0',
  cream: '#FAEAAC',
  text: '#1A362D',
}

const HEALIX_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="dash-chart__tooltip">
      <p className="dash-chart__tooltip-day">{label}</p>
      <p className="dash-chart__tooltip-row">
        <span>Activity</span>
        <strong>{p.value}%</strong>
      </p>
      {p.calories != null && (
        <p className="dash-chart__tooltip-row">
          <span>Calories</span>
          <strong>{p.calories}</strong>
        </p>
      )}
      {p.sleep != null && (
        <p className="dash-chart__tooltip-row">
          <span>Sleep</span>
          <strong>{p.sleep}h</strong>
        </p>
      )}
    </div>
  )
}

/**
 * Weekly activity bar chart using Recharts. Bars highlight today (the
 * last entry) in cream so the eye is drawn to the current moment.
 */
const ActivityChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <section className="dash-card dash-chart">
        <header className="dash-card__header">
          <h2 className="dash-card__title">
            <Activity size={16} strokeWidth={2} className="dash-card__title-icon" />
            Weekly activity
          </h2>
        </header>
        <div className="dash-chart__empty">No activity logged yet this week.</div>
      </section>
    )
  }

  return (
    <section className="dash-card dash-chart">
      <header className="dash-card__header">
        <h2 className="dash-card__title">
          <Activity size={16} strokeWidth={2} className="dash-card__title-icon" />
          Weekly activity
        </h2>
        <span className="dash-chart__legend" aria-hidden="true">
          <i className="dash-chart__legend-swatch" /> Daily completion
        </span>
      </header>
      <div className="dash-chart__canvas">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e6e0" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: PALETTE.text, fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: PALETTE.text, fontSize: 11 }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(26,54,45,0.05)' }}
              content={<HEALIX_TOOLTIP />}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell
                  key={d.day}
                  fill={i === data.length - 1 ? PALETTE.cream : PALETTE.deep}
                  stroke={i === data.length - 1 ? PALETTE.dark : 'transparent'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default ActivityChart
