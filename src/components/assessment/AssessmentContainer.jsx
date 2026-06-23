import { useEffect } from 'react'
import { AssessmentProvider, useAssessment } from './AssessmentContext'
import QuestionRenderer from './QuestionRenderer'
import ProgressBar from './ProgressBar'
import LoadingScreen from './LoadingScreen'
import ResultScreen from './ResultScreen'
import './assessment.scss'

const AssessmentInner = ({ onComplete }) => {
  const { currentQuestion, direction, status, answers } = useAssessment()

  useEffect(() => {
    if (status === 'done' && onComplete) onComplete(answers)
  }, [status, onComplete, answers])

  return (
    <div className="assm">
      <div className="assm__container">
        {status === 'running' && <ProgressBar />}
        <div className="assm__stage">
          {status === 'running' && (
            <div
              key={currentQuestion?.id}
              className={`assm__step assm__step--${direction}`}
            >
              <QuestionRenderer question={currentQuestion} />
            </div>
          )}
          {status === 'loading' && <LoadingScreen />}
          {status === 'done' && !onComplete && <ResultScreen />}
        </div>
      </div>
    </div>
  )
}

const AssessmentContainer = ({
  config,
  onComplete,
  onProgress,
  initialAnswers,
  initialStep,
}) => (
  <AssessmentProvider
    config={config}
    initialAnswers={initialAnswers}
    initialStep={initialStep}
    onProgress={onProgress}
  >
    <AssessmentInner onComplete={onComplete} />
  </AssessmentProvider>
)

export default AssessmentContainer
