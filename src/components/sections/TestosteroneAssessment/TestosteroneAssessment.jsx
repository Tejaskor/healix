import HairAssessment from '../HairAssessment/HairAssessment'
import testosteroneAssessmentConfig from '@/config/testosteroneAssessmentConfig'

// Testosterone assessment modal. Reuses the Hair Assessment modal engine
// (identical layout, transitions, progress bar, navigation, state selector
// and validation flow) driven by its own config.
const TestosteroneAssessment = ({ isOpen, onClose }) => (
  <HairAssessment
    isOpen={isOpen}
    onClose={onClose}
    config={testosteroneAssessmentConfig}
    ariaLabel="Testosterone assessment"
  />
)

export default TestosteroneAssessment
