import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Pill, Sparkles, ChevronLeft, RotateCcw } from 'lucide-react'
import BmiResultCard from '@/components/onboarding/BmiResultCard'
import PlanComparisonCard from '@/components/common/PlanComparisonCard/PlanComparisonCard'
import './OnboardingResultPage.scss'

// ─────────────────────────────────────────────────────────────────
// Helpers — same recommendation logic as before, untouched.
// ─────────────────────────────────────────────────────────────────

const computeBmi = (heightCm, weightKg) => {
  const h = Number(heightCm)
  const w = Number(weightKg)
  if (!h || !w) return null
  const m = h / 100
  return +(w / (m * m)).toFixed(1)
}

const recommendationFor = (bmi, answers) => {
  if (bmi == null) {
    return 'Based on your answers, we recommend a tailored lifestyle program with provider support.'
  }
  if (bmi < 25) {
    return 'You’re in a healthy BMI range. A lifestyle plan should help you maintain and feel your best.'
  }
  if (bmi < 30) {
    return 'You may benefit from lifestyle changes alongside clinical support to reach your goal.'
  }
  if (answers?.openToTreatment === 'no') {
    return 'A structured lifestyle plan with close provider guidance is the right place to start.'
  }
  return 'A combined plan with medication and lifestyle support typically produces the best outcomes.'
}

const pickPlan = (bmi, answers) => {
  if (bmi == null) return 'lifestyle'
  if (bmi < 25) return 'lifestyle'
  if (answers?.openToTreatment === 'no') return 'lifestyle'
  if (bmi >= 30) return 'combined'
  return 'medication'
}

// ─────────────────────────────────────────────────────────────────
// Plan catalogue — single source of truth on this page. Each card
// gets an icon, a price + period, and 3-4 feature bullets so the
// cards have real content rather than just a blurb.
// ─────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'lifestyle',
    title: 'Lifestyle Plan',
    blurb: 'Habit coaching, nutrition guidance, and daily progress tracking.',
    price: 'From $29',
    pricePeriod: '/month',
    icon: Heart,
    features: [
      'Personalised habit coaching',
      'Nutrition + meal guidance',
      'Weekly progress check-ins',
      'In-app expert support',
    ],
  },
  {
    id: 'medication',
    title: 'Medication Plan',
    blurb: 'Clinically reviewed prescriptions delivered to your door.',
    price: 'From $249',
    pricePeriod: '/month',
    icon: Pill,
    features: [
      'Provider-reviewed Rx',
      'Free monthly shipping',
      'Async messaging with care team',
      'Refill auto-pilot',
    ],
  },
  {
    id: 'combined',
    title: 'Combined Plan',
    blurb: 'Medication plus lifestyle coaching for the best outcomes.',
    price: 'From $279',
    pricePeriod: '/month',
    icon: Sparkles,
    features: [
      'Everything in the Medication Plan',
      'Plus full habit + nutrition coaching',
      'Twice-monthly video check-ins',
      'Priority care team access',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

const OnboardingResultPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  // Prefer navigated state, fall back to localStorage so refresh still works.
  // Wrapped in useMemo so the values don't reparse on every render.
  const answers = useMemo(() => {
    if (state?.answers) return state.answers
    try {
      const raw = localStorage.getItem('healix_assessment')
      if (!raw) return {}
      const parsed = JSON.parse(raw)
      // Handle both shapes the app has used historically:
      //   - { answers: {...}, step, completedAt }   (current)
      //   - {...answers}                            (legacy)
      return parsed?.answers || parsed || {}
    } catch {
      return {}
    }
  }, [state?.answers])

  const bmi = useMemo(
    () => computeBmi(answers.height, answers.weight),
    [answers.height, answers.weight]
  )

  const recommendation = useMemo(
    () => recommendationFor(bmi, answers),
    [bmi, answers]
  )

  const recommendedPlanId = useMemo(
    () => pickPlan(bmi, answers),
    [bmi, answers]
  )

  return (
    <div className="onb-result">
      {/* Soft beige → white gradient backdrop, anchored to the whole
          viewport so the page never reads "raw". */}
      <div className="onb-result__bg" aria-hidden="true" />

      <div className="onb-result__container">
        <motion.header
          className="onb-result__header"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="onb-result__eyebrow">Your personalised plan</span>
          <h1 className="onb-result__title">Based on your answers</h1>
          <p className="onb-result__subtitle">
            We&rsquo;ve matched you with the plan most likely to help you
            reach your goal. You can switch any time.
          </p>
        </motion.header>

        <BmiResultCard bmi={bmi} recommendation={recommendation} />

        <section className="onb-result__plans" aria-label="Plan options">
          {PLANS.map((plan, index) => (
            <PlanComparisonCard
              key={plan.id}
              plan={plan}
              recommended={recommendedPlanId === plan.id}
              index={index}
              onSelect={() => { /* TODO: navigate to plan detail / checkout */ }}
            />
          ))}
        </section>

        <motion.div
          className="onb-result__cta"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className="onb-result__primary"
            onClick={() => navigate('/dashboard')}
          >
            Continue to my dashboard
          </button>
          <button
            type="button"
            className="onb-result__ghost"
            onClick={() => navigate('/onboarding/assessment')}
          >
            <RotateCcw size={14} strokeWidth={2.2} />
            Retake assessment
          </button>
          <button
            type="button"
            className="onb-result__back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ChevronLeft size={14} strokeWidth={2.2} />
            Back
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default OnboardingResultPage
