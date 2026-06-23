import { useAssessment } from './AssessmentContext'

const ProgressBar = () => {
  const { progress, goBack, history, status } = useAssessment()
  const canBack = history.length > 1 && status === 'running'

  return (
    <div className="assm__progress">
      <button
        type="button"
        className="assm__progress-back"
        onClick={goBack}
        disabled={!canBack}
        aria-label="Previous question"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="assm__progress-track">
        <div className="assm__progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
