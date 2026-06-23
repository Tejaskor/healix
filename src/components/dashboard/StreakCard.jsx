import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Streak count tile. Hover lifts the card slightly and the flame
 * pulses, giving the metric a tiny moment of life on the dashboard.
 */
const StreakCard = ({ days = 0 }) => (
  <motion.section
    className="dash-card dash-streak"
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="dash-streak__icon" aria-hidden="true">
      <motion.span
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Flame size={28} strokeWidth={2} fill="#FAEAAC" />
      </motion.span>
    </div>
    <div className="dash-streak__body">
      <p className="dash-streak__count">
        <strong>{days}</strong>
        <span> Day</span>
      </p>
      <p className="dash-streak__label">Healthy streak</p>
    </div>
  </motion.section>
)

export default StreakCard
