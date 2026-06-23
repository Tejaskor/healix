import { useState, useEffect } from 'react'
import { useAssessment } from '../AssessmentContext'
import NavigationControls from '../NavigationControls'

const SliderQuestion = ({ question }) => {
  const { answers, setAnswer, goNext } = useAssessment()
  const min = question.min ?? 0
  const max = question.max ?? 100
  const step = question.step ?? 1
  const initial = answers[question.id] ?? question.default ?? Math.round((min + max) / 2)
  const [val, setVal] = useState(initial)

  useEffect(() => {
    setVal(answers[question.id] ?? initial)
  }, [question.id, answers, initial])

  const handleContinue = () => {
    setAnswer(question.id, val)
    goNext({ [question.id]: val })
  }

  const pct = ((val - min) / (max - min)) * 100

  return (
    <div className="assm-q">
      <h2 className="assm-q__title">{question.question}</h2>
      {question.subtitle && <p className="assm-q__subtitle">{question.subtitle}</p>}
      <div className="assm-q__slider-value">
        {val}
        {question.suffix && <span>{question.suffix}</span>}
      </div>
      <div className="assm-q__slider-wrap">
        <div className="assm-q__slider-track" style={{ '--pct': `${pct}%` }}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            className="assm-q__slider"
          />
        </div>
        <div className="assm-q__slider-labels">
          <span>{min}{question.suffix || ''}</span>
          <span>{max}{question.suffix || ''}</span>
        </div>
      </div>
      <NavigationControls onContinue={handleContinue} />
    </div>
  )
}

export default SliderQuestion
