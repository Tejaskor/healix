import { useAssessment } from '../AssessmentContext'
import NavigationControls from '../NavigationControls'

const MultiSelectQuestion = ({ question }) => {
  const { answers, setAnswer, goNext } = useAssessment()
  const value = answers[question.id] || []

  const toggle = (opt) => {
    const next = value.includes(opt.value)
      ? value.filter((v) => v !== opt.value)
      : [...value, opt.value]
    setAnswer(question.id, next)
  }

  const min = question.validation?.min ?? 0
  const disabled = value.length < min

  return (
    <div className="assm-q">
      <h2 className="assm-q__title">{question.question}</h2>
      {question.subtitle && <p className="assm-q__subtitle">{question.subtitle}</p>}
      <div className="assm-q__options">
        {question.options.map((opt) => {
          const active = value.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              className={`assm-q__option ${active ? 'assm-q__option--active' : ''}`}
              onClick={() => toggle(opt)}
            >
              <span>{opt.label}</span>
              <span className={`assm-q__check ${active ? 'assm-q__check--on' : ''}`}>
                {active && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </span>
            </button>
          )
        })}
      </div>
      <NavigationControls onContinue={() => goNext()} disabled={disabled} />
    </div>
  )
}

export default MultiSelectQuestion
