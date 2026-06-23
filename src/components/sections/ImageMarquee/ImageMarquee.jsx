import { useEffect, useRef, useState, useCallback } from 'react'
import './ImageMarquee.scss'

const ImageMarquee = () => {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Reveal animation — fires once
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Scroll tracking — switch image when card passes midpoint
  const handleScroll = useCallback(() => {
    const el = cardRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const midpoint = window.innerHeight * 0.4
    setScrolled(rect.top < midpoint)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section ref={sectionRef} className={`marquee ${visible ? 'marquee--visible' : ''}`}>
      <div className="marquee__wrapper">
        {/* Layer 0: Marquee cards */}
        {/* <div className="marquee__tilt">
          <div className="marquee__track">
            <img className="marquee__img marquee__img--first" src="/images/blood-hedge-section_canvas_11.png" alt=""  loading="lazy" decoding="async"/>
            <img className="marquee__img marquee__img--second" src="/images/blood-hedge-section_canvas_2.png" alt=""  loading="lazy" decoding="async"/>
            <img className="marquee__img" src="/images/blood-hedge-section_canvas_1.png" alt=""  loading="lazy" decoding="async"/>
            <img className="marquee__img marquee__img--third" src="/images/blood-hedge-section_canvas_3.png" alt=""  loading="lazy" decoding="async"/>
          </div>
        </div> */}

        {/* Layer 1: Person foreground */}
        <img
          src="/images/bento_person.png"
          alt=""
          className="marquee__person"
         loading="lazy" decoding="async"/>
        <div className="marquee__person-fade" />

        {/* Layer 2: Hero text */}
        <div className="marquee__hero">
          <span className="marquee__label">powered by healix</span>
          <h2 className="marquee__heading">
            Get tested.
            <br />
            Feel your best.
          </h2>
        </div>

        {/* Layer 3: CTA buttons + Feature card */}
        <div className="marquee__overlay">
          <div className="marquee__overlay-actions">
            <a href="#" className="marquee__btn marquee__btn--primary" aria-disabled="true">Start Testing</a>
            <a href="#" className="marquee__btn marquee__btn--secondary" aria-disabled="true">Learn more</a>
          </div>
          <div ref={cardRef} className="marquee__overlay-card">
            <div className={`marquee__overlay-col ${!scrolled ? 'marquee__overlay-col--active' : ''}`}>
              <h3 className="marquee__overlay-title">
                Know your
                <br />
                health
              </h3>
              <p className="marquee__overlay-text">
                Get simple insights with easy at-home testing.
              </p>
            </div>

            <div className="marquee__overlay-phone">
              <img className="marquee__overlay-phone-frame" src="/images/phone-in-hand.png" alt=""  loading="lazy" decoding="async"/>
              <div className="marquee__overlay-phone-display">
                <img className={`marquee__overlay-screen ${!scrolled ? 'marquee__overlay-screen--visible' : ''}`} src="/images/h_screenshot_baseline.webp" alt=""  loading="lazy" decoding="async"/>
                <img className={`marquee__overlay-screen ${scrolled ? 'marquee__overlay-screen--visible' : ''}`} src="/images/h_screenshot_breakthrough.webp" alt=""  loading="lazy" decoding="async"/>
              </div>
            </div>

            <div className={`marquee__overlay-col marquee__overlay-col--right ${scrolled ? 'marquee__overlay-col--active' : ''}`}>
              <h3 className="marquee__overlay-title">
                Build your
                <br />
                wellness plan
              </h3>
              <p className="marquee__overlay-text">
                Personalized guidance designed for your health goals.
              </p>
              {/* Commented out until a real destination is wired up.
                  Restore by removing this comment block:
              <a href="#" className="marquee__overlay-btn" aria-disabled="true">Explore Care</a>
              */}
            </div>
          </div>
        </div>
      </div>

      {/* Bento cards — normal flow, below wrapper */}
      <div className="marquee__bottom">
        <div className="marquee__bento">
          <div className="marquee__bento-card marquee__bento-card--markers">
            <div className="marquee__bg-layer" aria-hidden="true">
              <div className="marquee__bg-row marquee__bg-row--left">
                <span>Cholesterol</span><span className="marquee__bg-pill">Heart</span><span>LDL Cholesterol</span><span>HDL Cholesterol</span><span>Apolipoprotein B</span>
                <span>Cholesterol</span><span className="marquee__bg-pill">Heart</span><span>LDL Cholesterol</span><span>HDL Cholesterol</span><span>Apolipoprotein B</span>
              </div>
              <div className="marquee__bg-row marquee__bg-row--right">
                <span>Hemoglobin A1c</span><span>Fasting Insulin</span><span>Uric Acid</span><span className="marquee__bg-pill">Glucose</span><span className="marquee__bg-pill">Metabolism</span><span>Hemoglobin A1c</span>
                <span>Hemoglobin A1c</span><span>Fasting Insulin</span><span>Uric Acid</span><span className="marquee__bg-pill">Glucose</span><span className="marquee__bg-pill">Metabolism</span><span>Hemoglobin A1c</span>
              </div>
              <div className="marquee__bg-row marquee__bg-row--left">
                <span>Luteinizing Hormone</span><span>Follicle Stimulating</span><span className="marquee__bg-pill">Hormone</span><span className="marquee__bg-pill">Hormones</span><span>SHBG</span><span>Sulfate</span>
                <span>Luteinizing Hormone</span><span>Follicle Stimulating</span><span className="marquee__bg-pill">Hormone</span><span className="marquee__bg-pill">Hormones</span><span>SHBG</span><span>Sulfate</span>
              </div>
              <div className="marquee__bg-row marquee__bg-row--right">
                <span>DHEA-Sulfate</span><span>Cortisol</span><span className="marquee__bg-pill">Inflammation</span><span>DHEA-Sulfate</span><span>Cortisol</span><span>DHEA-Sulfate</span>
                <span>DHEA-Sulfate</span><span>Cortisol</span><span className="marquee__bg-pill">Inflammation</span><span>DHEA-Sulfate</span><span>Cortisol</span><span>DHEA-Sulfate</span>
              </div>
              <div className="marquee__bg-row marquee__bg-row--left">
                <span className="marquee__bg-pill">Thyroid</span><span>Thyroxine (T4)</span><span>Free Triiodothyronine (T3)</span><span>Thyroid-Stimulating</span>
                <span className="marquee__bg-pill">Thyroid</span><span>Thyroxine (T4)</span><span>Free Triiodothyronine (T3)</span><span>Thyroid-Stimulating</span>
              </div>
              <div className="marquee__bg-row marquee__bg-row--right">
                <span>Alanine Transaminase</span><span>Albumin</span><span>Alkaline Phosphatase</span><span className="marquee__bg-pill">Liver</span><span>Total Protein</span>
                <span>Alanine Transaminase</span><span>Albumin</span><span>Alkaline Phosphatase</span><span className="marquee__bg-pill">Liver</span><span>Total Protein</span>
              </div>
              <div className="marquee__bg-row marquee__bg-row--left">
                <span>Basophils</span><span className="marquee__bg-pill">Immune Defense</span><span>Lymphocytes</span><span>White Blood Cell Count</span><span>Eosinophils</span>
                <span>Basophils</span><span className="marquee__bg-pill">Immune Defense</span><span>Lymphocytes</span><span>White Blood Cell Count</span><span>Eosinophils</span>
              </div>
              <div className="marquee__bg-row marquee__bg-row--right">
                <span>Vitamin D</span><span>Potassium</span><span>Homocysteine</span><span>Iron</span><span>Sodium</span><span className="marquee__bg-pill">Nutrients</span><span>Magnesium</span>
                <span>Vitamin D</span><span>Potassium</span><span>Homocysteine</span><span>Iron</span><span>Sodium</span><span className="marquee__bg-pill">Nutrients</span><span>Magnesium</span>
              </div>
            </div>
            <h3 className="marquee__bento-title">
              Comprehensive
              <br />
              health testing
            </h3>
            <div className="marquee__bento-visual">
              <img src="/images/h-bento-hp-figure-2.png" alt=""  loading="lazy" decoding="async"/>
            </div>
            <a href="#" className="marquee__bento-btn" aria-disabled="true">See your results</a>
          </div>

          <div className="marquee__bento-card marquee__bento-card--cancer">
            <h3 className="marquee__bento-title">
              Screen for multiple
              <br />
              cancer types
            </h3>
            <div className="marquee__bento-visual marquee__bento-visual--body">
              <img src="/images/h--signal-body--desktop-2x-2.webp" alt=""  loading="lazy" decoding="async"/>
            </div>
            <a href="#" className="marquee__bento-btn" aria-disabled="true">Learn more</a>
          </div>
        </div>
      </div>

      <p className="marquee__disclaimer">
        Availability may vary by location. Eligibility and prescription may be required. Results are for informational purposes only and are not intended to diagnose or treat any condition.
      </p>
    </section>
  )
}

export default ImageMarquee
