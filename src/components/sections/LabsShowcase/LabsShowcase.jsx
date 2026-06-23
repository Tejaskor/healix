import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './LabsShowcase.scss'

const LabsShowcase = () => {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0) // 0 = baseline, 1 = action plan

  const handleScroll = useCallback(() => {
    const el = sectionRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const windowH = window.innerHeight
    const sectionH = el.offsetHeight

    // Calculate scroll progress through the section
    // 0 = section just entered viewport, 1 = section about to leave
    const scrolled = (windowH - rect.top) / (windowH + sectionH)
    const clamped = Math.max(0, Math.min(1, scrolled))

    // Map to 0–1 with a sweet spot in the middle
    // First half of scroll = baseline, second half = action plan
    const mapped = Math.max(0, Math.min(1, (clamped - 0.3) / 0.3))
    setProgress(mapped)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const isActionPlan = progress > 0.5

  return (
    <section ref={sectionRef} className="labs-showcase">
      <div className="labs-showcase__inner">
        {/* Left text */}
        <div
          className={`labs-showcase__text labs-showcase__text--left ${!isActionPlan ? 'labs-showcase__text--active' : ''}`}
        >
          <h3 className="labs-showcase__title">
            Find your
            <br />
            baseline
          </h3>
          <p className="labs-showcase__desc">
            Get a clear picture of your health with a simple lab test.
          </p>
        </div>

        {/* Phone */}
        <div className="labs-showcase__phone">
          <img
            className="labs-showcase__phone-frame"
            src="/images/phone-in-hand.png"
            alt=""
           loading="lazy" decoding="async"/>
          <div className="labs-showcase__phone-display">
            <img
              className="labs-showcase__screen labs-showcase__screen--baseline"
              src="/images/h_screenshot_baseline.png"
              alt="Baseline results"
              style={{ opacity: 1 - progress }}
             loading="lazy" decoding="async"/>
            <img
              className="labs-showcase__screen labs-showcase__screen--actionplan"
              src="/images/h_screenshot_actionplan.png"
              alt="Action plan"
              style={{ opacity: progress }}
             loading="lazy" decoding="async"/>
          </div>
        </div>

        {/* Right text */}
        <div
          className={`labs-showcase__text labs-showcase__text--right ${isActionPlan ? 'labs-showcase__text--active' : ''}`}
        >
          <h3 className="labs-showcase__title">
            Plan your
            <br />
            breakthrough
          </h3>
          <p className="labs-showcase__desc">
            Optimize your health with a doctor‑developed Action Plan.
          </p>
          <Link to="#" className="labs-showcase__cta-link">
            Explore the plan
          </Link>
        </div>
      </div>

      {/* Buttons */}
      <div className="labs-showcase__actions">
        <Link to="#" className="labs-showcase__btn labs-showcase__btn--primary">
          Start my labs
        </Link>
        <Link to="#" className="labs-showcase__btn labs-showcase__btn--secondary">
          Learn more
        </Link>
      </div>
    </section>
  )
}

export default LabsShowcase
