import { useEffect, useState, useCallback } from 'react'
import hairAssessmentConfig from '@/config/hairAssessmentConfig'
import useScrollLock from '@/hooks/useScrollLock'
import AssessmentLoading from './AssessmentLoading'
import AssessmentResult from './AssessmentResult'
import './HairAssessment.scss'

// How long the "Analyzing…" screen shows before the result (2–3s premium feel).
const LOADING_DURATION_MS = 2400

// -------- Icons --------

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5L20 7" />
  </svg>
)

const InfoCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

// -------- Reusable option components --------

const OptionRow = ({ icon, label, description, active, trailing, onClick }) => (
  <button
    type="button"
    className={`ha-option ${active ? 'ha-option--active' : ''}`}
    onClick={onClick}
  >
    {icon && <span className="ha-option__icon" aria-hidden="true">{icon}</span>}
    <span className="ha-option__text">
      <span className="ha-option__label">{label}</span>
      {description && <span className="ha-option__desc">{description}</span>}
    </span>
    <span className="ha-option__trailing">{trailing}</span>
  </button>
)

// -------- Question types --------

const SingleChoice = ({ question, value, onSelect }) => (
  <div className="ha-q">
    <h2 className="ha-q__title">{question.question}</h2>
    {question.subtitle && <p className="ha-q__subtitle">{question.subtitle}</p>}
    <div className="ha-q__options">
      {question.options.map((opt) => (
        <OptionRow
          key={opt.value}
          icon={opt.icon}
          label={opt.label}
          description={opt.description}
          active={value === opt.value}
          onClick={() => onSelect(opt.value)}
          trailing={<ChevronRight />}
        />
      ))}
    </div>
  </div>
)

const MultiSelect = ({ question, value = [], onToggle }) => (
  <div className="ha-q">
    <h2 className="ha-q__title">{question.question}</h2>
    {question.subtitle && <p className="ha-q__subtitle">{question.subtitle}</p>}
    <div className="ha-q__options">
      {question.options.map((opt) => {
        const active = value.includes(opt.value)
        return (
          <OptionRow
            key={opt.value}
            label={opt.label}
            description={opt.description}
            active={active}
            onClick={() => onToggle(opt.value)}
            trailing={
              <span className={`ha-check ${active ? 'ha-check--on' : ''}`}>
                {active && <Check />}
              </span>
            }
          />
        )
      })}
    </div>
  </div>
)

const InfoScreen = ({ question }) => (
  <div className="ha-q ha-q--info">
    {question.heading && <h2 className="ha-q__title">{question.heading}</h2>}
    {question.body && <p className="ha-q__body">{question.body}</p>}
  </div>
)

const InfoBox = ({ box }) => (
  <div className="ha-infobox">
    <div className="ha-infobox__title">
      <InfoCircle />
      <span>{box.title}</span>
    </div>
    <p className="ha-infobox__body">{box.body}</p>
  </div>
)

const StateSelect = ({ question, value = {}, onChange }) => {
  const handleStateChange = (e) => onChange({ ...value, state: e.target.value })
  const handleTermsToggle = () => onChange({ ...value, terms: !value.terms })
  return (
    <div className="ha-q">
      <h2 className="ha-q__title">{question.question}</h2>
      <div className="ha-select-wrap">
        <select
          className="ha-select"
          value={value.state || ''}
          onChange={handleStateChange}
        >
          <option value="" disabled>{question.placeholder || 'Select'}</option>
          {question.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="ha-select__chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
      <label className="ha-terms">
        <span className={`ha-terms__box ${value.terms ? 'ha-terms__box--on' : ''}`}>
          {value.terms && <Check />}
        </span>
        <input
          type="checkbox"
          checked={!!value.terms}
          onChange={handleTermsToggle}
          className="ha-terms__input"
        />
        <span className="ha-terms__text">
          I agree to <a href="#" aria-disabled="true">Terms</a> and <a href="#" aria-disabled="true">Privacy Policy</a>
        </span>
      </label>
    </div>
  )
}

// -------- Modal --------

const HairAssessment = ({ isOpen, onClose, config = hairAssessmentConfig, ariaLabel = 'Hair assessment' }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [direction, setDirection] = useState('forward')
  const [status, setStatus] = useState('running') // running | loading | done

  // Reset the flow each time the modal opens (intentional state reset on the
  // isOpen prop edge — same pattern used across the assessment modals).
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStepIndex(0)
      setAnswers({})
      setDirection('forward')
      setStatus('running')
    }
  }, [isOpen])

  // After the final question we show the analyzing screen, then flip to the
  // personalized result. Timer is cleared if the modal closes meanwhile.
  useEffect(() => {
    if (!isOpen || status !== 'loading') return undefined
    const id = setTimeout(() => setStatus('done'), LOADING_DURATION_MS)
    return () => clearTimeout(id)
  }, [isOpen, status])

  // Lock background scroll while open (scrollbar-width compensated, no flicker).
  useScrollLock(isOpen)

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  const totalSteps = config.questions.length
  const currentQuestion = config.questions[stepIndex]
  const progress = status === 'running' ? Math.min(1, (stepIndex + 1) / totalSteps) : 1

  // Result is derived from the user's answers when the flow completes.
  const result =
    status === 'done' && typeof config.getResult === 'function'
      ? config.getResult(answers)
      : null

  const advance = () => {
    setDirection('forward')
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1)
    } else if (typeof config.getResult === 'function') {
      // Last question answered → analyzing screen → personalized result.
      setStatus('loading')
    } else {
      // No result configured for this assessment — preserve prior behavior.
      onClose()
    }
  }

  const handleBack = () => {
    setDirection('backward')
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSingleSelect = (q, value) => {
    setAnswer(q.id, value)
    if (q.autoNext === false) return
    setTimeout(advance, 180)
  }

  const handleMultiToggle = (q, value) => {
    const existing = answers[q.id] || []
    const next = existing.includes(value)
      ? existing.filter((v) => v !== value)
      : [...existing, value]
    setAnswer(q.id, next)
  }

  // Continue button visibility/validity
  const needsContinueButton = (q) => {
    if (!q) return false
    if (q.type === 'multi') return true
    if (q.type === 'info') return true
    if (q.type === 'state-select') return true
    if (q.type === 'single' && q.autoNext === false) return true
    return false
  }

  const continueDisabled = (() => {
    if (!currentQuestion) return true
    const v = answers[currentQuestion.id]
    if (currentQuestion.type === 'multi') {
      return (v?.length || 0) < (currentQuestion.validation?.min ?? 1)
    }
    if (currentQuestion.type === 'state-select') {
      return !(v?.state && v?.terms)
    }
    if (currentQuestion.type === 'single' && currentQuestion.autoNext === false) {
      return v == null
    }
    return false
  })()

  if (!isOpen) return null

  return (
    <div className="ha-overlay" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <div className="ha-overlay__backdrop" onClick={onClose} />
      <div className="ha-modal">
        <div className="ha-modal__header">
          {status === 'running' && stepIndex > 0 ? (
            <button type="button" className="ha-iconbtn" onClick={handleBack} aria-label="Back">
              <BackIcon />
            </button>
          ) : (
            <span className="ha-modal__spacer" />
          )}
          <div className="ha-progress">
            <div className="ha-progress__fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <button type="button" className="ha-iconbtn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="ha-modal__body">
          {status === 'running' && currentQuestion && (
            <div
              key={currentQuestion.id}
              className={`ha-step ha-step--${direction}`}
            >
              {currentQuestion.type === 'single' && (
                <>
                  <SingleChoice
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    onSelect={(v) => handleSingleSelect(currentQuestion, v)}
                  />
                  {currentQuestion.infoBox && <InfoBox box={currentQuestion.infoBox} />}
                </>
              )}
              {currentQuestion.type === 'multi' && (
                <MultiSelect
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onToggle={(v) => handleMultiToggle(currentQuestion, v)}
                />
              )}
              {currentQuestion.type === 'info' && <InfoScreen question={currentQuestion} />}
              {currentQuestion.type === 'state-select' && (
                <StateSelect
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={(v) => setAnswer(currentQuestion.id, v)}
                />
              )}
            </div>
          )}

          {status === 'loading' && (
            <div className="ha-step ha-step--forward">
              <AssessmentLoading config={config.loading} />
            </div>
          )}

          {status === 'done' && (
            <div className="ha-step ha-step--forward">
              <AssessmentResult result={result} onCta={onClose} />
            </div>
          )}
        </div>

        {status === 'running' && needsContinueButton(currentQuestion) && (
          <div className="ha-modal__footer">
            <button
              type="button"
              className="ha-btn ha-btn--dark"
              onClick={advance}
              disabled={continueDisabled}
            >
              {currentQuestion.type === 'info' ? 'Next' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HairAssessment
