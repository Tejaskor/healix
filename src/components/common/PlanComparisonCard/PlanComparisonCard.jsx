import { motion } from 'framer-motion'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import './PlanComparisonCard.scss'

/**
 * Reusable plan card used on the post-assessment results page.
 *
 *   <PlanComparisonCard
 *     plan={{ id, title, blurb, price, pricePeriod, icon, features }}
 *     recommended={true|false}
 *     index={0..2}     // for the stagger animation
 *     onSelect={fn}
 *   />
 *
 * Premium treatment:
 *   - Soft white card; rounded 18px; subtle border + shadow.
 *   - Recommended card gets a gradient border (background-clip trick),
 *     a slight scale-up, a glowing "Most Popular" pill, and a deeper
 *     shadow. The pill pulses gently.
 *   - Features render as a check-mark list with cream-circle icons.
 *   - CTA is a pill button with a sliding arrow on hover.
 *   - Hover lifts the card 4px and sharpens the shadow.
 *
 * Accessibility: button is a proper <button type="button">, the
 * recommended state is signalled by both the visual treatment AND an
 * aria-label note so screen readers announce "Recommended plan".
 */
const PlanComparisonCard = ({ plan, recommended = false, index = 0, onSelect }) => {
  const Icon = plan.icon

  return (
    <motion.article
      className={`plan-card ${recommended ? 'plan-card--recommended' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      aria-label={recommended ? `${plan.title} — recommended` : plan.title}
    >
      {recommended && (
        <span className="plan-card__popular" aria-hidden="true">
          <Sparkles size={11} strokeWidth={2.6} />
          Most Popular
        </span>
      )}

      <div className="plan-card__head">
        <span className="plan-card__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>
        <h3 className="plan-card__title">{plan.title}</h3>
        <p className="plan-card__blurb">{plan.blurb}</p>
      </div>

      <div className="plan-card__price">
        <strong>{plan.price}</strong>
        <span>{plan.pricePeriod}</span>
      </div>

      {plan.features?.length > 0 && (
        <ul className="plan-card__features">
          {plan.features.map((feature) => (
            <li key={feature}>
              <span className="plan-card__feature-icon" aria-hidden="true">
                <Check size={12} strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className={`plan-card__cta ${recommended ? 'plan-card__cta--primary' : 'plan-card__cta--ghost'}`}
        onClick={() => onSelect?.(plan)}
      >
        <span>{recommended ? 'Start with this plan' : 'Choose plan'}</span>
        <ArrowRight size={15} strokeWidth={2.4} className="plan-card__cta-arrow" />
      </button>
    </motion.article>
  )
}

export default PlanComparisonCard
