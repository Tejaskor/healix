import HairAssessment from '../HairAssessment/HairAssessment'
import sexAssessmentConfig from '@/config/sexAssessmentConfig'

// Sexual Wellness assessment modal. Reuses the Hair Assessment modal engine
// (identical layout, transitions, progress bar, navigation, state selector
// and validation flow) driven by its own config.
const SexAssessment = ({ isOpen, onClose }) => (
  <HairAssessment
    isOpen={isOpen}
    onClose={onClose}
    config={sexAssessmentConfig}
    ariaLabel="Sexual wellness assessment"
  />
)

export default SexAssessment
