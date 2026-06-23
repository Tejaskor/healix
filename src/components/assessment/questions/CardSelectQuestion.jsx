import { useAssessment } from '../AssessmentContext'

const CardSelectQuestion = ({ question }) => {
  const { answers, setAnswer, goNext } = useAssessment()
  const value = answers[question.id]

  const handleSelect = (opt) => {
    setAnswer(question.id, opt.value)
    setTimeout(() => goNext({ [question.id]: opt.value }), 200)
  }

  return (
    <div className="assm-q">
      <h2 className="assm-q__title">{question.question}</h2>
      {question.subtitle && <p className="assm-q__subtitle">{question.subtitle}</p>}
      <div className="assm-q__cards">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`assm-q__card ${value === opt.value ? 'assm-q__card--active' : ''}`}
            onClick={() => handleSelect(opt)}
          >
            {opt.image && <img src={opt.image} alt="" className="assm-q__card-img"  loading="lazy" decoding="async"/>}
            {opt.icon && <span className="assm-q__card-icon">{opt.icon}</span>}
            <span className="assm-q__card-label">{opt.label}</span>
            {opt.description && <span className="assm-q__card-desc">{opt.description}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CardSelectQuestion
