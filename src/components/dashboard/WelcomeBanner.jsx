import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

/**
 * Personalised welcome strip at the top of the dashboard.
 * Pulls name + weekly progress %, no internal state.
 */
const WelcomeBanner = ({ name = 'there', weeklyPercent = 0 }) => {
  const pct = Math.max(0, Math.min(100, Math.round(weeklyPercent)))
  return (
    <motion.section
      className="dash-welcome"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dash-welcome__inner">
        <div className="dash-welcome__text">
          <h1 className="dash-welcome__greeting">
            Welcome back, <strong>{name}</strong> <span aria-hidden="true">👋</span>
          </h1>
          <p className="dash-welcome__sub">
            You completed <strong>{pct}%</strong> of your weekly goals.
          </p>
        </div>
        <div className="dash-welcome__icon" aria-hidden="true">
          <Sparkles size={22} strokeWidth={1.8} />
        </div>
      </div>
    </motion.section>
  )
}

export default WelcomeBanner
