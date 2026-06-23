import { useAssessment } from './AssessmentContext'

const ResultScreen = () => {
  const { answers, reset, config } = useAssessment()
  const result = config.getResult ? config.getResult(answers) : {
    title: 'Your personalized plan is ready',
    description: 'Based on your answers, we have prepared recommendations for you.',
    ctaLabel: 'View my plan',
  }

  return (
    <div className="assm-result">
      <h2 className="assm-result__title">{result.title}</h2>
      {result.description && <p className="assm-result__desc">{result.description}</p>}
      <button type="button" className="assm__btn assm__btn--primary" aria-disabled="true">{result.ctaLabel || 'Continue'}</button>
      <button type="button" className="assm__btn assm__btn--ghost" onClick={reset}>Retake</button>
    </div>
  )
}

export default ResultScreen
