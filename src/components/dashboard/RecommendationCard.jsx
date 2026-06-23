import { motion } from 'framer-motion'
import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react'

const ICONS = {
  good: CheckCircle2,
  warn: AlertTriangle,
  info: Lightbulb,
}

/**
 * Single AI-flavoured recommendation tile. `tone` drives the icon
 * + accent colour (good / warn / info). Stagger-friendly: the wrapper
 * uses a Framer Motion entry so a list of these animates in sequence.
 */
const RecommendationCard = ({ tone = 'info', title, body, index = 0 }) => {
  const Icon = ICONS[tone] || Lightbulb
  return (
    <motion.article
      className={`dash-rec dash-rec--${tone}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <span className="dash-rec__icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="dash-rec__body">
        <p className="dash-rec__title">{title}</p>
        {body && <p className="dash-rec__text">{body}</p>}
      </div>
    </motion.article>
  )
}

export default RecommendationCard
