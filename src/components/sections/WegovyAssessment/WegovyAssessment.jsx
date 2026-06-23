import { useEffect, useState, useCallback } from 'react'
import wegovyAssessmentConfig from '@/config/wegovyAssessmentConfig'
import useScrollLock from '@/hooks/useScrollLock'
import './WegovyAssessment.scss'

// -------- Reusable UI primitives (scoped to this modal) --------

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

// -------- Question components --------

const OptionCard = ({ label, active, onClick, trailing }) => (
  <button
    type="button"
    className={`wa-option ${active ? 'wa-option--active' : ''}`}
    onClick={onClick}
  >
    <span className="wa-option__label">{label}</span>
    <span className="wa-option__trailing">{trailing}</span>
  </button>
)

const SingleChoice = ({ question, value, onSelect }) => (
  <div className="wa-q">
    <h2 className="wa-q__title">{question.question}</h2>
    <div className="wa-q__options">
      {question.options.map((opt) => (
        <OptionCard
          key={opt.value}
          label={opt.label}
          active={value === opt.value}
          onClick={() => onSelect(opt.value)}
          trailing={<ChevronRight />}
        />
      ))}
    </div>
  </div>
)

const MultiSelect = ({ question, value = [], onToggle }) => (
  <div className="wa-q">
    <h2 className="wa-q__title">{question.question}</h2>
    <div className="wa-q__options">
      {question.options.map((opt) => {
        const active = value.includes(opt.value)
        return (
          <OptionCard
            key={opt.value}
            label={opt.label}
            active={active}
            onClick={() => onToggle(opt.value)}
            trailing={
              <span className={`wa-check ${active ? 'wa-check--on' : ''}`}>
                {active && <Check />}
              </span>
            }
          />
        )
      })}
    </div>
  </div>
)

// -------- Loader --------

const Loader = ({ message }) => (
  <div className="wa-loading">
    <div className="wa-loading__blob" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <p className="wa-loading__text">{message}</p>
  </div>
)

// -------- Result --------

const ResultScreen = ({ result, onGetPlan }) => (
  <div className="wa-result">
    <div className="wa-result__hero">
      <div className="wa-result__hero-left">
        <h2 className="wa-result__heading">{result.heading}</h2>
        <ul className="wa-result__list">
          {result.bullets.map((b) => (
            <li key={b}>
              <span className="wa-result__tick"><Check /></span>
              {b}
            </li>
          ))}
        </ul>
        <button type="button" className="wa-btn wa-btn--white" onClick={onGetPlan}>
          {result.ctaLabel}
        </button>
      </div>
      {result.image && (
        <img src={result.image} alt="" className="wa-result__hero-img"  loading="lazy" decoding="async"/>
      )}
    </div>

    <h3 className="wa-result__products-heading">{result.productsHeading}</h3>
    <div className="wa-result__products">
      {result.products.map((p) => (
        <div key={p.name} className="wa-product">
          <div className="wa-product__img-wrap">
            <img src={p.image} alt={p.name} className="wa-product__img"  loading="lazy" decoding="async"/>
          </div>
          <div className="wa-product__body">
            <div className="wa-product__name">{p.name}</div>
            {p.sub && <div className="wa-product__sub">{p.sub}</div>}
            {p.price && <div className="wa-product__price">{p.price}</div>}
            <div className="wa-product__actions">
              <button type="button" className="wa-btn wa-btn--dark wa-btn--sm" aria-disabled="true">Get started</button>
              <button type="button" className="wa-btn wa-btn--outline wa-btn--sm" aria-disabled="true">View details</button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {result.disclaimer && (
      <p className="wa-result__disclaimer">{result.disclaimer}</p>
    )}
  </div>
)

// -------- Modal --------

const WegovyAssessment = ({ isOpen, onClose, config = wegovyAssessmentConfig }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [status, setStatus] = useState('running') // running | loading | done
  const [direction, setDirection] = useState('forward')

  // Reset modal state whenever it opens
  useEffect(() => {
    if (isOpen) {
      setStepIndex(0)
      setAnswers({})
      setStatus('running')
      setDirection('forward')
    }
  }, [isOpen])

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

  const currentQuestion = config.questions[stepIndex]
  const totalSteps = config.questions.length
  const progress = status === 'done' ? 1 : Math.min(1, (stepIndex + (status === 'loading' ? 1 : 0)) / totalSteps)

  const advance = (nextAnswers = answers) => {
    setDirection('forward')
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setStatus('loading')
      setTimeout(() => setStatus('done'), 2400)
    }
    if (nextAnswers !== answers) setAnswers(nextAnswers)
  }

  const handleBack = () => {
    setDirection('backward')
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const handleSingleSelect = (id, value) => {
    const next = { ...answers, [id]: value }
    setAnswers(next)
    setTimeout(() => advance(next), 180)
  }

  const handleMultiToggle = (id, value) => {
    const existing = answers[id] || []
    const next = {
      ...answers,
      [id]: existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value],
    }
    setAnswers(next)
  }

  const multiCanContinue =
    currentQuestion?.type === 'multi' &&
    (answers[currentQuestion.id]?.length || 0) >= (currentQuestion.validation?.min ?? 1)

  if (!isOpen) return null

  return (
    <div className="wa-overlay" role="dialog" aria-modal="true" aria-label="Weight loss assessment">
      <div className="wa-overlay__backdrop" onClick={onClose} />
      <div className="wa-modal">
        <div className="wa-modal__header">
          {status === 'running' && stepIndex > 0 ? (
            <button type="button" className="wa-iconbtn" onClick={handleBack} aria-label="Back">
              <BackIcon />
            </button>
          ) : (
            <span className="wa-modal__spacer" />
          )}
          <div className="wa-progress">
            <div className="wa-progress__fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <button type="button" className="wa-iconbtn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="wa-modal__body">
          {status === 'running' && currentQuestion && (
            <div
              key={currentQuestion.id}
              className={`wa-step wa-step--${direction}`}
            >
              {currentQuestion.type === 'single' && (
                <SingleChoice
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onSelect={(v) => handleSingleSelect(currentQuestion.id, v)}
                />
              )}
              {currentQuestion.type === 'multi' && (
                <>
                  <MultiSelect
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    onToggle={(v) => handleMultiToggle(currentQuestion.id, v)}
                  />
                  <div className="wa-modal__footer">
                    <button
                      type="button"
                      className="wa-btn wa-btn--dark"
                      onClick={() => advance()}
                      disabled={!multiCanContinue}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {status === 'loading' && (
            <div className="wa-step wa-step--forward">
              <Loader message={config.loadingMessage || 'Reviewing your options'} />
            </div>
          )}

          {status === 'done' && (
            <div className="wa-step wa-step--forward">
              <ResultScreen result={config.result} onGetPlan={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WegovyAssessment
