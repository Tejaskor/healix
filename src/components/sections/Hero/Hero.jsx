import { Link } from 'react-router-dom'
import Container from '@/components/common/Container/Container'
import { heroFeaturedCards, heroCategoryCards } from '@/data/heroCards'
import './Hero.scss'

// Maps each category card slug to the window event that opens its assessment
// modal (handled in Layout.jsx). Slugs without an entry navigate normally.
const CATEGORY_ASSESSMENT_EVENTS = {
  sex: 'open-sex-assessment',
  hair: 'open-hair-assessment',
  testosterone: 'open-testosterone-assessment',
  health: 'open-health-assessment',
}

/**
 * Hero section — background-image cards:
 *
 *  ┌──────────────────────────────────────────────────┐
 *  │  background-image: url(...)                      │
 *  │  background-size: cover                          │
 *  │  background-position: center                     │
 *  │                                                  │
 *  │  ┌─ ::before overlay (z:1) ───────────────────┐  │
 *  │  │  gradient: left solid → right transparent  │  │
 *  │  └────────────────────────────────────────────┘  │
 *  │                                                  │
 *  │  ┌─ content (z:2) ───────────────────────────┐   │
 *  │  │  Lose weight                              │   │
 *  │  │  your way                                 │   │
 *  │  │  from $69/mo*                         (→) │   │
 *  │  └───────────────────────────────────────────┘   │
 *  └──────────────────────────────────────────────────┘
 */

const ArrowIcon = ({ className = '' }) => (
  <span className={`hero__arrow ${className}`}>
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)

const WeightCurve = () => (
  <svg
    className="hero__card-curve"
    viewBox="0 0 80 32"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 28C12 28 18 4 40 4C62 4 68 18 78 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="78" cy="18" r="3" fill="currentColor" />
  </svg>
)

const Hero = () => {
  return (
    <section className="hero">
      <Container>
        <h1 className="hero__heading">
          Where <span className="hero__heading-accent">healing</span>
          <br />
          meets innovation
        </h1>

        <div className="hero__featured">
          {heroFeaturedCards.map((card) => (
            <Link
              key={card.id}
              to={card.href}
              className="hero__card"
              onClick={(e) => {
                e.preventDefault()
                window.dispatchEvent(new Event('open-wegovy-assessment'))
              }}
              style={{
                '--card-bg': `url(${card.bg})`,
                '--card-bg-hover': `url(${card.bgHover})`,
              }}
            >
              <div className="hero__card-content">
                <div className="hero__card-top">
                  <h2 className="hero__card-title">
                    <span className="hero__card-title-line">{card.title}</span>
                    <span className="hero__card-title-bold">{card.titleBold}</span>
                  </h2>
                </div>
                <div className="hero__card-bottom">
                  <div className="hero__card-meta-group">
                    {card.id === 2 && <WeightCurve />}
                    <span className="hero__card-meta">{card.meta}</span>
                  </div>
                  <ArrowIcon className="hero__arrow--card" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="hero__categories">
          {heroCategoryCards.map((cat) => (
            <Link
              key={cat.id}
              to={cat.href}
              className={`hero__cat-card hero__cat-card--${cat.slug}`}
              onClick={(e) => {
                const assessmentEvent = CATEGORY_ASSESSMENT_EVENTS[cat.slug]
                if (assessmentEvent) {
                  e.preventDefault()
                  window.dispatchEvent(new Event(assessmentEvent))
                }
              }}
              style={{ '--hover-bg': cat.hoverBg }}
            >
              <span className="hero__cat-label">
                {cat.title} <strong>{cat.titleBold}</strong>
              </span>
              <div className="hero__cat-right">
                <div className="hero__cat-icon">
                  <img
                    src={cat.iconDefault}
                    alt=""
                    className="hero__cat-icon-img hero__cat-icon-img--default"
                   loading="lazy" decoding="async"/>
                  <img
                    src={cat.iconHover}
                    alt=""
                    className="hero__cat-icon-img hero__cat-icon-img--hover"
                    aria-hidden="true"
                   loading="lazy" decoding="async"/>
                </div>
                <ArrowIcon className="hero__arrow--cat" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Hero
