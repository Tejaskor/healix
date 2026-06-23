import { useAssessment } from '../AssessmentContext'

const SingleChoiceQuestion = ({ question }) => {
  const { answers, setAnswer, goNext } = useAssessment()
  const value = answers[question.id]

  const handleSelect = (opt) => {
    setAnswer(question.id, opt.value)
    setTimeout(() => goNext({ [question.id]: opt.value }), 180)
  }

  return (
    <div className="assm-q">
      <h2 className="assm-q__title">{question.question}</h2>
      {question.subtitle && <p className="assm-q__subtitle">{question.subtitle}</p>}
      <div className="assm-q__options">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`assm-q__option ${value === opt.value ? 'assm-q__option--active' : ''}`}
            onClick={() => handleSelect(opt)}
          >
            <span>{opt.label}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SingleChoiceQuestion
