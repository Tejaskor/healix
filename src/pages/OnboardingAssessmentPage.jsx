import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentContainer from '@/components/assessment/AssessmentContainer'
import healthAssessmentConfig from '@/config/healthAssessmentConfig'
import { useAuth } from '@/contexts/AuthContext'

const OnboardingAssessmentPage = () => {
  const navigate = useNavigate()
  const {
    saveAssessmentProgress,
    completeAssessment,
    assessmentData,
    assessmentStep,
    assessmentCompleted,
  } = useAuth()

  /**
   * Partial save — fires on every answer/step change. NEVER marks the
   * assessment as completed. If the user leaves and returns, this is what
   * lets them resume exactly where they left off.
   *
   * Performance: wrapped in useCallback so its identity is stable across
   * renders. The AssessmentProvider's progress useEffect depends on this
   * function — without useCallback we'd get a fresh `handleProgress` on
   * every render, re-firing the effect (and the localStorage write) on
   * every keystroke instead of only on real answer changes.
   */
  const handleProgress = useCallback(
    (answers, stepId) => {
      saveAssessmentProgress({ answers, step: stepId })
    },
    [saveAssessmentProgress]
  )

  /**
   * Final-submit — the ONE place where `completedAt` gets stamped.
   * Only fires after the engine walks through every applicable question.
   *
   * Performance: navigate FIRST with the answers in route state, then
   * persist the completion. The localStorage write is sync and takes
   * ~1 ms but we still kick the navigation in the same tick so React
   * routes to /onboarding/results before paint, eliminating any blank-
   * screen pause.
   */
  const handleComplete = useCallback(
    (answers) => {
      if (import.meta.env.DEV) {
        performance.mark('assessment:complete-callback')
      }
      // navigate uses { replace: true } so the user can't navigate back
      // into the assessment after seeing the result — also avoids piling
      // assessment URLs into the history stack.
      navigate('/onboarding/results', { state: { answers }, replace: true })
      // Stamp completion AFTER the navigation has been queued. Since
      // completeAssessment is just a setState + localStorage.setItem it
      // doesn't block paint.
      completeAssessment(answers)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.timeEnd('[assessment] finish → result navigate')
      }
    },
    [navigate, completeAssessment]
  )

  // Performance: warm the result-page chunk during idle time, BEFORE the
  // user finishes the last question. Vite emitted /onboarding/results as
  // a lazy chunk, so without this hint the chunk only starts downloading
  // when navigate() resolves to that route — adding 150–500 ms on a cold
  // connection. requestIdleCallback ensures we never compete with the
  // current page's rendering.
  useEffect(() => {
    const prefetch = () => {
      import('@/pages/OnboardingResultPage').catch(() => {})
    }
    if (typeof window === 'undefined') return
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 2000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const t = setTimeout(prefetch, 1500)
    return () => clearTimeout(t)
  }, [])

  // Resume support — only rehydrate if the user hasn't already completed
  // the assessment (otherwise there's nothing to resume to).
  const initialAnswers = !assessmentCompleted ? assessmentData : undefined
  const initialStep = !assessmentCompleted ? assessmentStep : undefined

  return (
    <AssessmentContainer
      config={healthAssessmentConfig}
      initialAnswers={initialAnswers}
      initialStep={initialStep}
      onProgress={handleProgress}
      onComplete={handleComplete}
    />
  )
}

export default OnboardingAssessmentPage
