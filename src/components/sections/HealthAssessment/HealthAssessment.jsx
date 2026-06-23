import HairAssessment from '../HairAssessment/HairAssessment'
import healthCheckAssessmentConfig from '@/config/healthCheckAssessmentConfig'

// Health Check assessment modal (Hero "Health check" card). Reuses the Hair
// Assessment modal engine (identical layout, transitions, progress bar,
// navigation, state selector and validation flow) driven by its own config.
const HealthAssessment = ({ isOpen, onClose }) => (
  <HairAssessment
    isOpen={isOpen}
    onClose={onClose}
    config={healthCheckAssessmentConfig}
    ariaLabel="Health check assessment"
  />
)

export default HealthAssessment
