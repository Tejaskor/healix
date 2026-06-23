import { useState, useEffect } from 'react'
import { useAssessment } from '../AssessmentContext'
import NavigationControls from '../NavigationControls'

const InputQuestion = ({ question }) => {
  const { answers, setAnswer, goNext } = useAssessment()
  const [localValue, setLocalValue] = useState(answers[question.id] ?? '')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    setLocalValue(answers[question.id] ?? '')
  }, [question.id, answers])

  const validate = (v) => {
    if (question.validation?.required && !String(v).trim()) return 'Required'
    if (question.validation?.validate) {
      const r = question.validation.validate(v)
      if (r !== true) return r || 'Invalid'
    }
    return null
  }

  const error = touched ? validate(localValue) : null
  const disabled = !!validate(localValue)

  const handleContinue = () => {
    setAnswer(question.id, localValue)
    goNext({ [question.id]: localValue })
  }

  return (
    <div className="assm-q">
      <h2 className="assm-q__title">{question.question}</h2>
      {question.subtitle && <p className="assm-q__subtitle">{question.subtitle}</p>}
      <div className="assm-q__input-wrap">
        <input
          type={question.inputType || 'text'}
          className={`assm-q__input ${error ? 'assm-q__input--error' : ''}`}
          value={localValue}
          placeholder={question.placeholder || ''}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => setTouched(true)}
          autoFocus
        />
        {question.suffix && <span className="assm-q__input-suffix">{question.suffix}</span>}
      </div>
      {error && <p className="assm-q__error">{error}</p>}
      <NavigationControls onContinue={handleContinue} disabled={disabled} />
    </div>
  )
}

export default InputQuestion
