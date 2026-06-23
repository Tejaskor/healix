import { useAssessment } from '../AssessmentContext'

const YesNoQuestion = ({ question }) => {
  const { answers, setAnswer, goNext } = useAssessment()
  const value = answers[question.id]

  const handle = (v) => {
    setAnswer(question.id, v)
    setTimeout(() => goNext({ [question.id]: v }), 180)
  }

  return (
    <div className="assm-q">
      <h2 className="assm-q__title">{question.question}</h2>
      {question.subtitle && <p className="assm-q__subtitle">{question.subtitle}</p>}
      <div className="assm-q__yesno">
        {[
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            className={`assm-q__option ${value === opt.value ? 'assm-q__option--active' : ''}`}
            onClick={() => handle(opt.value)}
          >
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default YesNoQuestion
