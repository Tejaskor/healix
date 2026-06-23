import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const AssessmentContext = createContext(null)

/**
 * Props:
 *  - config: question config
 *  - initialAnswers: resume from a previous partial save
 *  - initialStep: question id to start at (resume)
 *  - onProgress(answers, stepId): fires whenever answers/step change
 */
export const AssessmentProvider = ({ children, config, initialAnswers, initialStep, onProgress }) => {
  const [answers, setAnswers] = useState(() => initialAnswers || {})

  const resolveValidStart = useCallback(() => {
    // If a previous step id was stored, try to resume there; otherwise start
    // at the first question. Bail out if the id is no longer in the config.
    if (initialStep) {
      const idx = config.questions.findIndex((q) => q.id === initialStep)
      if (idx >= 0) return initialStep
    }
    return config.questions[0]?.id
  }, [config.questions, initialStep])

  const [history, setHistory] = useState(() => [resolveValidStart()])
  const [direction, setDirection] = useState('forward')
  const [status, setStatus] = useState('running') // running | loading | done

  const currentId = history[history.length - 1]
  const currentQuestion = useMemo(
    () => config.questions.find((q) => q.id === currentId),
    [config.questions, currentId]
  )

  // Fire progress events on every state change until the flow is done.
  // Completion is signalled separately (status === 'done'); consumers should
  // call their "completeAssessment" API at that moment, not on every save.
  useEffect(() => {
    if (status !== 'running') return
    if (!onProgress) return
    onProgress(answers, currentId)
  }, [answers, currentId, status, onProgress])

  const setAnswer = useCallback((id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }, [])

  const resolveNext = useCallback(
    (question, currentAnswers) => {
      if (!question) return null
      let nextId = null
      if (typeof question.next === 'function') nextId = question.next(currentAnswers)
      else if (question.next) nextId = question.next
      else {
        const idx = config.questions.findIndex((q) => q.id === question.id)
        nextId = config.questions[idx + 1]?.id ?? null
      }
      while (nextId) {
        const q = config.questions.find((x) => x.id === nextId)
        if (!q) return null
        if (!q.condition || q.condition(currentAnswers)) return nextId
        const idx = config.questions.findIndex((x) => x.id === nextId)
        nextId = config.questions[idx + 1]?.id ?? null
      }
      return null
    },
    [config.questions]
  )

  const goNext = useCallback(
    (overrideAnswers) => {
      const merged = overrideAnswers ? { ...answers, ...overrideAnswers } : answers
      if (overrideAnswers) setAnswers(merged)
      const nextId = resolveNext(currentQuestion, merged)
      setDirection('forward')
      if (!nextId) {
        // Performance: previously this branched to a 'loading' state for
        // a hardcoded 2,200 ms before flipping to 'done'. That 2.2 s was
        // pure artificial delay — there's no async work happening here.
        // Going straight to 'done' lets `onComplete` fire on the next
        // tick, which navigates to the result page immediately.
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.time('[assessment] finish → result navigate')
          performance.mark('assessment:finish')
        }
        setStatus('done')
        return
      }
      setHistory((h) => [...h, nextId])
    },
    [answers, currentQuestion, resolveNext]
  )

  const goBack = useCallback(() => {
    setDirection('backward')
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
  }, [])

  const reset = useCallback(() => {
    setAnswers({})
    setHistory([config.questions[0].id])
    setStatus('running')
    setDirection('forward')
  }, [config.questions])

  // Performance: total/current step + progress derived inside useMemo so
  // they don't recompute on every render of the (memoised) context value.
  const { totalSteps, currentStep, progress } = useMemo(() => {
    const total = config.questions.filter(
      (q) => !q.condition || q.condition(answers)
    ).length
    const current = Math.min(history.length, total)
    return {
      totalSteps: total,
      currentStep: current,
      progress: Math.max(0, Math.min(1, total > 0 ? current / total : 0)),
    }
  }, [config.questions, answers, history])

  // Performance: memoise the value object so consumer components that
  // call useAssessment() don't re-render every time AssessmentProvider
  // re-renders for an unrelated reason.
  const value = useMemo(
    () => ({
      config,
      answers,
      history,
      currentQuestion,
      direction,
      status,
      progress,
      currentStep,
      totalSteps,
      setAnswer,
      goNext,
      goBack,
      reset,
    }),
    [
      config,
      answers,
      history,
      currentQuestion,
      direction,
      status,
      progress,
      currentStep,
      totalSteps,
      setAnswer,
      goNext,
      goBack,
      reset,
    ]
  )

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>
}

export const useAssessment = () => {
  const ctx = useContext(AssessmentContext)
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider')
  return ctx
}
