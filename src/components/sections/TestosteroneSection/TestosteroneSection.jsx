import { Link } from 'react-router-dom'
import useInView from '@/hooks/useInView'
import './TestosteroneSection.scss'

const TestosteroneSection = () => {
  // Fires ONCE when 20% visible — never resets
  const { ref: sectionRef, isInView } = useInView(0.2)

  return (
    <section className="testo">
      <div className="testo__wrapper" ref={sectionRef}>
        {/* Layer 0: Background image with fade mask */}
        <div className="testo__bg-image" />

        {/* Layer 0.5: Dotted curve — reveals once, stays forever */}
        <div className={`testo__curve ${isInView ? 'testo__curve--visible' : ''}`}>
          <img
            src="/images/dotted.png"
            alt=""
            className="testo__curve-img"
           loading="lazy" decoding="async"/>
        </div>

        {/* Layer 1: Person image — above curve, below content */}
        <img
          src="/images/person.png"
          alt=""
          className={`testo__person ${isInView ? 'testo__person--visible' : ''}`}
         loading="lazy" decoding="async"/>

        {/* Layer 2: Content — on top of everything */}
        <div className="testo__content">
          <div className="testo__header">
            <h2 className="testo__heading">
              Support your strength,
              <br />
              energy, and drive
            </h2>
          </div>

          <div className="testo__actions">
            <Link to="#" className="testo__btn testo__btn--primary" aria-disabled="true">
              Get tested
            </Link>
            <Link to="#" className="testo__btn testo__btn--secondary" aria-disabled="true">
              Know your T Levels
            </Link>
          </div>

          <div className="testo__cards">
            <div className="testo__card">
              <div className="testo__card-top">
                <h3 className="testo__card-title">Testosterone plan</h3>
                <p className="testo__card-subtitle">Boost your T</p>
              </div>
              <div
                className="testo__card-image"
                style={{ backgroundImage: "url('/images/h-tmnt-hp-bento-01-D.png')" }}
              />
              <Link to="#" className="testo__card-btn" aria-disabled="true">
                Learn more
              </Link>
            </div>

            <div className="testo__card">
              <div className="testo__card-top">
                <h3 className="testo__card-title">Smart testing at home</h3>
                <p className="testo__card-subtitle">for better health insights</p>
              </div>
              <div
                className="testo__card-image"
                style={{ backgroundImage: "url('/images/h-tmnt-hp-bento-02-D.webp')" }}
              />
              <Link to="#" className="testo__card-btn" aria-disabled="true">
                Explore Care
              </Link>
            </div>
          </div>

          <div className="testo__disclaimer">
            <p>
              These treatments are compounded and are not FDA approved.
            </p>
            <p className="testo__disclaimer-small">
              Images are used for visual representation only.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestosteroneSection
