import SingleChoiceQuestion from './questions/SingleChoiceQuestion'
import MultiSelectQuestion from './questions/MultiSelectQuestion'
import InputQuestion from './questions/InputQuestion'
import YesNoQuestion from './questions/YesNoQuestion'
import SliderQuestion from './questions/SliderQuestion'
import CardSelectQuestion from './questions/CardSelectQuestion'

const registry = {
  single: SingleChoiceQuestion,
  multi: MultiSelectQuestion,
  input: InputQuestion,
  yesno: YesNoQuestion,
  slider: SliderQuestion,
  card: CardSelectQuestion,
}

const QuestionRenderer = ({ question }) => {
  if (!question) return null
  const Component = registry[question.type]
  if (!Component) {
    return <div className="assm-q__error">Unknown question type: {question.type}</div>
  }
  return <Component question={question} />
}

export default QuestionRenderer
