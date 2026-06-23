import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

/**
 * Welcome card for brand-new users who have never logged anything and
 * (optionally) haven't completed the assessment yet. Two CTAs:
 *   - Start Assessment → /onboarding/assessment
 *   - Add Today's Activity → scrolls to the trackers below
 *
 * Hidden once `hasAnyLogs` flips true.
 */
const EmptyDashboardState = ({ name = 'there', assessmentCompleted = false, onScrollToTrackers }) => {
  const navigate = useNavigate()

  return (
    <motion.section
      className="dash-empty"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dash-empty__icon" aria-hidden="true">
        <Heart size={26} strokeWidth={1.8} />
      </div>
      <h1 className="dash-empty__title">
        Welcome to Healix, <strong>{name}</strong> <span aria-hidden="true">👋</span>
      </h1>
      <p className="dash-empty__sub">Start your health journey today.</p>
      <p className="dash-empty__detail">
        {assessmentCompleted
          ? 'Log your first activity below to begin tracking your daily progress.'
          : 'Complete your first health assessment and begin tracking your daily progress.'}
      </p>
      <div className="dash-empty__actions">
        {!assessmentCompleted && (
          <button
            type="button"
            className="dash-btn dash-btn--primary"
            onClick={() => navigate('/onboarding/assessment')}
          >
            <Sparkles size={14} strokeWidth={2.2} style={{ marginRight: 6 }} />
            Start Assessment
          </button>
        )}
        <button
          type="button"
          className="dash-btn dash-btn--ghost"
          onClick={onScrollToTrackers}
        >
          Add Today&rsquo;s Activity
        </button>
      </div>
    </motion.section>
  )
}

export default EmptyDashboardState
