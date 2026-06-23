import { Link } from 'react-router-dom'
import useInView from '@/hooks/useInView'
import './LabsSection.scss'

const LabsSection = () => {
  const { ref: sectionRef, isInView } = useInView(0.15)
  const vis = isInView ? 'labs--visible' : ''

  return (
    <section className="labs">
      <div className={`labs__wrapper ${vis}`} ref={sectionRef}>
        {/* Layer 0: Background cards strip */}
        <div className="labs__bg-cards">
          <div className="labs__bg-track">
            <img className="labs__bg-img labs__bg-img--1" src="/images/blood-hedge-section_canvas_11.png" alt=""  loading="lazy" decoding="async"/>
            <img className="labs__bg-img labs__bg-img--2" src="/images/blood-hedge-section_canvas_2.png" alt=""  loading="lazy" decoding="async"/>
            <img className="labs__bg-img labs__bg-img--3" src="/images/blood-hedge-section_canvas_1.png" alt=""  loading="lazy" decoding="async"/>
            <img className="labs__bg-img labs__bg-img--4" src="/images/blood-hedge-section_canvas_3.png" alt=""  loading="lazy" decoding="async"/>
          </div>
        </div>

        {/* Layer 1: Person image */}
        <img
          src="/images/person.png"
          alt=""
          className="labs__person"
         loading="lazy" decoding="async"/>

        {/* Layer 2: Content */}
        <div className="labs__content">
          <div className="labs__header">
            <p className="labs__eyebrow">labs by healix</p>
            <h2 className="labs__heading">
              Get tested.
              <br />
              Feel your best.
            </h2>
          </div>

          <div className="labs__actions">
            <Link to="#" className="labs__btn labs__btn--primary">
              Start my labs
            </Link>
            <Link to="#" className="labs__btn labs__btn--secondary">
              Learn more
            </Link>
          </div>

          {/* Middle row: Find baseline + Phone + Plan */}
          <div className="labs__feature-row">
            <div className="labs__feature-card labs__feature-card--left">
              <h3 className="labs__feature-title">Find your<br />baseline</h3>
              <p className="labs__feature-text">
                Get a clear picture of your health with a simple lab test.
              </p>
            </div>

            <div className="labs__phone">
              <img src="/images/bento_person.png" alt="" className="labs__phone-img"  loading="lazy" decoding="async"/>
            </div>

            <div className="labs__feature-card labs__feature-card--right">
              <h3 className="labs__feature-title">Plan your<br />breakthrough</h3>
              <p className="labs__feature-text">
                Optimize your health with a doctor‑developed Action Plan.
              </p>
              <Link to="#" className="labs__feature-btn">
                Explore the plan
              </Link>
            </div>
          </div>

          {/* Bottom bento cards */}
          <div className="labs__bento">
            <div className="labs__bento-card labs__bento-card--markers">
              <h3 className="labs__bento-title">Comprehensive<br />health testing</h3>
              <div className="labs__bento-visual">
                <img src="/images/bento_person.png" alt=""  loading="lazy" decoding="async"/>
              </div>
              <Link to="#" className="labs__bento-btn">
                Meet the markers
              </Link>
            </div>

            <div className="labs__bento-card labs__bento-card--cancer">
              <h3 className="labs__bento-title">Screen for multiple<br />cancer types</h3>
              <div className="labs__bento-visual labs__bento-visual--body">
                <img src="/images/h-hp-science.png" alt=""  loading="lazy" decoding="async"/>
              </div>
              <Link to="#" className="labs__bento-btn">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LabsSection
