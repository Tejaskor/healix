import { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Pill, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import HealthSummaryCard from '@/components/dashboard/HealthSummaryCard'
import ProgressTracker from '@/components/dashboard/ProgressTracker'
// The legacy <PlanCard> is intentionally retired here in favour of the
// shared premium card. PlanCard.jsx is still exported but no longer used
// by the dashboard.
import PlanComparisonCard from '@/components/common/PlanComparisonCard/PlanComparisonCard'
import DailyTasks from '@/components/dashboard/DailyTasks'
import DeleteAccount from '@/components/dashboard/DeleteAccount'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner'
import HealthScoreCard from '@/components/dashboard/HealthScoreCard'
import StreakCard from '@/components/dashboard/StreakCard'
import RecommendationCard from '@/components/dashboard/RecommendationCard'
import ProgressCard from '@/components/dashboard/ProgressCard'

// Empty-state variants — used for brand-new users with no logs.
import EmptyDashboardState from '@/components/dashboard/EmptyDashboardState'
import EmptyChart from '@/components/dashboard/EmptyChart'
import EmptyStreakCard from '@/components/dashboard/EmptyStreakCard'
import EmptyHealthScore from '@/components/dashboard/EmptyHealthScore'

// Real Supabase-backed trackers.
import WaterTracker from '@/components/dashboard/WaterTracker'
import SleepTracker from '@/components/dashboard/SleepTracker'
import StepTracker from '@/components/dashboard/StepTracker'
import CaloriesTracker from '@/components/dashboard/CaloriesTracker'

import { useDashboardData } from '@/hooks/useDashboardData'
import { calculateHealthScore, buildRecommendations } from '@/utils/healthScore'
import './DashboardPage.scss'

const computeBmi = (heightCm, weightKg) => {
  const h = Number(heightCm)
  const w = Number(weightKg)
  if (!h || !w) return null
  const m = h / 100
  return +(w / (m * m)).toFixed(1)
}

const bmiCategory = (bmi) => {
  if (bmi == null) return 'N/A'
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Healthy'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

const chooseRecommendedPlan = (answers, bmi) => {
  if (bmi == null) return 'lifestyle'
  if (bmi >= 30) return 'combined'
  if (answers?.openToTreatment === 'no') return 'lifestyle'
  if (bmi >= 25) return 'medication'
  return 'lifestyle'
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, assessmentData, assessmentCompleted, logout } = useAuth()

  const answers = assessmentData || {}
  const bmi = computeBmi(answers.height, answers.weight)
  const category = bmiCategory(bmi)
  const recommended = chooseRecommendedPlan(answers, bmi)

  const showActivityAlert = answers.activity === 'sedentary'

  const currentWeight = Number(answers.weight) || null
  const targetWeight = useMemo(() => {
    if (!currentWeight) return null
    if (answers.targetLoss) {
      const [, highStr] = String(answers.targetLoss).split('-')
      const high = Number(highStr) || (answers.targetLoss === '20+' ? 20 : 10)
      return Math.max(40, Math.round(currentWeight - high))
    }
    return Math.max(40, Math.round(currentWeight - currentWeight * 0.1))
  }, [currentWeight, answers.targetLoss])

  const name = user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  // Real dashboard data, fetched from Supabase.
  //   - `loading` is only true on the FIRST fetch — subsequent refreshes
  //     keep the previous data on screen (stale-while-revalidate).
  //   - `patch` lets trackers apply optimistic updates so button clicks
  //     feel instant; refresh() then reconciles silently in the background.
  const { data: dash, loading: dashLoading, refresh, patch } = useDashboardData()

  // Decide which UI to show. `hasAnyLogs` flips true the moment ANY log
  // row exists for this user — that's the trigger for retiring the
  // empty-state shell.
  const hasAnyLogs = !!dash?.hasAnyLogs

  // Health-score gate: need at least 3 of {water, sleep, steps, calories}
  // dimensions logged before a meaningful score can be shown.
  const dimensionsLogged = useMemo(() => {
    if (!dash) return 0
    let n = 0
    if (dash.waterIntake > 0) n++
    if (dash.sleepHours > 0) n++
    if (dash.steps > 0) n++
    if (dash.caloriesBurned > 0) n++
    return n
  }, [dash])
  const showHealthScore = dimensionsLogged >= 3

  const healthScore = useMemo(
    () => (showHealthScore ? calculateHealthScore(dash) : 0),
    [dash, showHealthScore]
  )

  // Recommendations only show once we have material to recommend on.
  const recommendations = useMemo(
    () => (dimensionsLogged > 0 ? buildRecommendations(dash) : []),
    [dash, dimensionsLogged]
  )

  const weeklyPercent = useMemo(() => {
    if (!dash?.weeklyProgress?.length) return 0
    const total = dash.weeklyProgress.reduce((s, d) => s + d.value, 0)
    return Math.round(total / dash.weeklyProgress.length)
  }, [dash])

  // Smooth-scroll helper for the empty-state "Add Today's Activity" CTA.
  const trackersRef = useRef(null)
  const scrollToTrackers = () => {
    trackersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Shape matches PlanComparisonCard's expected `plan` prop. Same
  // catalogue as the onboarding results page so the two surfaces stay
  // visually consistent. Move this to `src/lib/plans.js` if you ever
  // need a third surface (Settings, Profile, etc.).
  const plans = [
    {
      id: 'lifestyle',
      title: 'Lifestyle Plan',
      blurb: 'Habit coaching, nutrition, and activity guidance to reach your goals.',
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
      blurb: 'Clinically reviewed prescriptions shipped monthly, with provider support.',
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

  // Skeleton ONLY on the very first load (when there's no data yet).
  // After that, `dashLoading` stays false even during background refresh,
  // so logging activity never blanks the page. Returning users skip this
  // entirely because their first fetch resolves with real values.
  if (dashLoading && !dash) {
    return (
      <div className="dash">
        <div className="dash__container">
          <div className="dash-skeleton dash-skeleton--card" />
          <div className="dash-skeleton dash-skeleton--card" />
          <div className="dash-skeleton dash-skeleton--card" />
        </div>
      </div>
    )
  }

  return (
    <div className="dash">
      <div className="dash__container">

        {/* ── First-time user: clean welcome + CTAs only ──────────── */}
        {!hasAnyLogs && (
          <EmptyDashboardState
            name={name}
            assessmentCompleted={assessmentCompleted}
            onScrollToTrackers={scrollToTrackers}
          />
        )}

        {/* ── Returning user: personalised welcome with real weekly % ── */}
        {hasAnyLogs && (
          <WelcomeBanner name={name} weeklyPercent={weeklyPercent} />
        )}

        {showActivityAlert && (
          <div className="dash__alert" role="alert">
            <strong>Try to move more.</strong> Your assessment shows low activity &mdash; even a 20-minute daily walk can help.
          </div>
        )}

        {/* ── Real metric tiles — only shown once logs exist ──────── */}
        {hasAnyLogs && (
          <div className="dash-stat-grid">
            <ProgressCard
              kind="steps"
              label="Steps"
              value={dash.steps}
              sublabel={`Goal ${dash.stepsGoal.toLocaleString()}`}
            />
            <ProgressCard
              kind="calories"
              label="Calories"
              value={dash.caloriesBurned}
              unit="kcal"
              sublabel={`Goal ${dash.caloriesGoal} kcal`}
            />
            <ProgressCard
              kind="water"
              label="Water"
              value={dash.waterIntake}
              unit="L"
              sublabel={`Goal ${dash.waterGoal} L`}
            />
            <ProgressCard
              kind="sleep"
              label="Sleep"
              value={dash.sleepHours}
              unit="h"
              sublabel={`Goal ${dash.sleepGoal} h`}
            />
          </div>
        )}

        {/* ── Summary, Score, Streak — health-score gated by logs ─── */}
        <div className="dash-row--three">
          <HealthSummaryCard
            currentWeight={currentWeight ?? 0}
            targetWeight={targetWeight ?? 0}
            startWeight={currentWeight ?? 0}
            bmi={bmi}
            category={category}
          />
          {showHealthScore ? (
            <HealthScoreCard score={healthScore} />
          ) : (
            <EmptyHealthScore />
          )}
          {dash?.streakDays > 0 ? (
            <StreakCard days={dash.streakDays} />
          ) : (
            <EmptyStreakCard />
          )}
        </div>

        {/* ── Weekly progress tracker OR empty chart ──────────────── */}
        {hasAnyLogs ? (
          <ProgressTracker data={dash} />
        ) : (
          <EmptyChart onLogFirstActivity={scrollToTrackers} />
        )}

        {/* ── Real, Supabase-backed trackers — always available ────
            Each tracker calls patch() for the instant optimistic update
            and refresh() afterwards to reconcile the chart/streak/score
            silently in the background. */}
        <section ref={trackersRef} className="dash-trackers-grid">
          <WaterTracker
            currentMl={Math.round((dash?.waterIntake || 0) * 1000)}
            goalMl={3000}
            onLogged={refresh}
            patch={patch}
          />
          <SleepTracker
            currentHours={dash?.sleepHours || 0}
            goalHours={dash?.sleepGoal || 8}
            onLogged={refresh}
            patch={patch}
          />
          <StepTracker
            currentSteps={dash?.steps || 0}
            goalSteps={dash?.stepsGoal || 10000}
            onLogged={refresh}
            patch={patch}
          />
          <CaloriesTracker
            currentCalories={dash?.caloriesBurned || 0}
            goalCalories={dash?.caloriesGoal || 700}
            onLogged={refresh}
            patch={patch}
          />
        </section>

        {/* ── Recommendations — only when there is data to recommend ── */}
        {recommendations.length > 0 && (
          <section className="dash-card" style={{ marginBottom: 20 }}>
            <header className="dash-card__header">
              <h2 className="dash-card__title">Recommendations</h2>
            </header>
            {recommendations.map((r, i) => (
              <RecommendationCard key={i} {...r} index={i} />
            ))}
          </section>
        )}

        {/* ── Plans (derived from assessment) ────────────────────── */}
        {assessmentCompleted && (
          <section className="dash-plans-section" aria-labelledby="dash-plans-heading">
            <header className="dash-plans-section__head">
              <span className="dash-plans-section__eyebrow">Your personalised plan</span>
              <h2 id="dash-plans-heading" className="dash-plans-section__title">
                Pick the plan that fits your goal
              </h2>
              <p className="dash-plans-section__subtitle">
                Based on your assessment, we&rsquo;ve highlighted the option most likely to help.
                You can switch any time.
              </p>
            </header>

            <div className="dash__plans">
              {plans.map((p, index) => (
                <PlanComparisonCard
                  key={p.id}
                  plan={p}
                  recommended={recommended === p.id}
                  index={index}
                  onSelect={() => { /* TODO: navigate to plan detail */ }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Daily tasks + Support ───────────────────────────────── */}
        <div className="dash__grid dash__grid--two">
          <DailyTasks />
          <section className="dash-card dash-support">
            <header className="dash-card__header">
              <h2 className="dash-card__title">Support</h2>
            </header>
            <p className="dash-support__text">Your care team is here whenever you need them.</p>
            <div className="dash-support__actions">
              <button type="button" className="dash-btn dash-btn--primary" aria-disabled="true">Chat with a doctor</button>
              <button type="button" className="dash-btn dash-btn--ghost" aria-disabled="true">Help &amp; FAQ</button>
            </div>
          </section>
        </div>

        {/* ── Account ────────────────────────────────────────────── */}
        <section className="dash-card dash-account">
          <header className="dash-card__header">
            <h2 className="dash-card__title">Account</h2>
          </header>
          <ul className="dash-account__list">
            <li>
              <span>Profile</span>
              <span className="dash-account__muted">{user?.email || 'Not set'}</span>
            </li>
            <li>
              <span>Edit details</span>
              <button type="button" className="dash-link" aria-disabled="true">Manage</button>
            </li>
            <li>
              <span>Session</span>
              <button
                type="button"
                className="dash-link dash-link--danger"
                onClick={() => { logout(); navigate('/') }}
              >
                Log out
              </button>
            </li>
          </ul>
        </section>

        <DeleteAccount />
      </div>
    </div>
  )
}

export default DashboardPage
