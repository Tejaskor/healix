import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HealixLogo from '@/components/common/HealixLogo/HealixLogo'
import UserMenu from '@/components/common/UserMenu/UserMenu'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import Footer from '@/components/layout/Footer/Footer'
import './LabsPage.scss'
import './HowItWorksPage.scss'
import './CancerScreeningPage.scss'

const navLinks = [
  { label: 'Health Check', to: '/labs' },
  { label: 'What We Test', to: '/labs/what-we-test' },
  { label: 'How It Works', to: '/labs/how-it-works' },
  { label: 'Action Plan', to: '/labs/action-plan' },
  { label: 'Cancer Screening', to: '/labs/cancer-screening' },
]

const faqs = [
  {
    q: 'What is a multi-cancer screening test?',
    a: [
      'A multi-cancer screening test is an advanced blood test designed to detect potential cancer-related signals across multiple cancer types at an early stage.',
    ],
  },
  {
    q: 'How does the screening process work?',
    a: [
      'The process involves a simple blood draw that is analyzed for specific biological signals associated with certain cancers.',
    ],
  },
  {
    q: 'Why should I consider preventive cancer screening?',
    a: [
      'Early screening may help identify potential health concerns before symptoms appear, supporting proactive healthcare decisions.',
    ],
  },
  {
    q: 'What types of cancer can it screen for?',
    a: [
      'This test is designed to detect signals linked to a wide range of cancer types. However, it does not cover all cancers and should not replace standard screening methods.',
    ],
  },
  {
    q: 'Is this test used to diagnose cancer?',
    a: [
      'No. The screening is intended to identify possible signals that may require additional medical evaluation or follow-up testing.',
    ],
  },
  {
    q: 'How long does it take to receive results?',
    a: [
      'Results are typically delivered digitally after laboratory processing is complete, though timing may vary.',
    ],
  },
  {
    q: 'What happens if a signal is detected?',
    a: [
      'If a signal is identified, healthcare professionals may recommend additional screening or diagnostic steps for further evaluation.',
    ],
  },
  {
    q: 'What does a “No Signal Detected” result mean?',
    a: [
      'It means the screening did not identify concerning signals at the time of testing, though regular preventive care is still important.',
    ],
  },
  {
    q: 'What if no signal is detected?',
    a: [
      'A \u201cno signal detected\u201d result does not guarantee the absence of cancer. Some conditions may not be identified through this test.',
      'Regular checkups and recommended screenings should still be followed.',
    ],
  },
  {
    q: 'How often should I take the test?',
    a: [
      'This screening is typically recommended once a year as part of ongoing health monitoring.',
    ],
  },
  {
    q: 'Is special preparation required before testing?',
    a: [
      'Most screenings require minimal preparation, making the process simple and convenient.',
    ],
  },
  {
    q: 'Where can I complete the screening?',
    a: [
      'Testing may be available through partnered laboratories or approved healthcare locations.',
    ],
  },
]

const CancerScreeningPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [labsOpen, setLabsOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(-1)

  useEffect(() => {
    const handler = () => setLabsOpen(true)
    window.addEventListener('open-labs-offcanvas', handler)
    return () => window.removeEventListener('open-labs-offcanvas', handler)
  }, [])

  return (
    <div className="labs-page">
      <header className="labs-nav">
        <div className="labs-nav__container">
          <Link to="/" className="labs-nav__logo" aria-label="Healix homepage">
            <HealixLogo color="dark" size="md" />
          </Link>

          <div className="labs-nav__center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <button
                  key={link.label}
                  className={`labs-nav__link ${isActive ? 'labs-nav__link--active' : ''}`}
                  onClick={() => navigate(link.to)}
                >
                  {link.label}
                </button>
              )
            })}
          </div>

          <div className="labs-nav__right">
            <UserMenu className="labs-nav__login" />
            <button
              className="labs-nav__hamburger"
              onClick={() => setLabsOpen(true)}
              aria-label="Open menu"
            >
              <span className="labs-nav__hamburger-bar" />
              <span className="labs-nav__hamburger-bar" />
              <span className="labs-nav__hamburger-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero — Screen for 50+ cancer types */}
      <section className="cs-hero" aria-label="Cancer Screening hero">
        <div className="cs-hero__content">
          <h1 className="cs-hero__heading">
            Early cancer detection made simple
          </h1>
          <p className="cs-hero__sub">
            Use a single blood test to screen for multiple cancer signals before symptoms develop.
          </p>
          <button type="button" className="cs-hero__btn" aria-disabled="true">Begin Testing</button>
        </div>
      </section>

      {/* Disclaimer strip */}
      <section className="cs-disclaimer" aria-label="Disclaimer">
        <p className="cs-disclaimer__text">
          Service availability may vary by region. Eligibility and provider approval may be required. Results are for informational purposes only and not intended for diagnosis or treatment.{' '}
          {/* <a href="#" className="cs-disclaimer__link" aria-disabled="true">Learn more</a> */}
        </p>
      </section>

      {/* A heads-up that keeps you in the game */}
      <section className="hiw-step cs-step" aria-label="A heads-up">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <h2 className="hiw-step__heading">
              Stay one step ahead
              <br />
              of potential risks
            </h2>

            <ul className="hiw-step__list">
              <li className="hiw-step__item">
                <span className="hiw-step__check" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span className="hiw-step__item-text">
                  Routine checkups don&rsquo;t always cover every type of cancer, leaving important gaps in early detection.
                </span>
              </li>
              <li className="hiw-step__item">
                <span className="hiw-step__check" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span className="hiw-step__item-text">
                  Many conditions can develop silently, often without noticeable symptoms in the early stages.
                </span>
              </li>
              <li className="hiw-step__item">
                <span className="hiw-step__check" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span className="hiw-step__item-text">
                  Advanced screening can help identify early warning signs across multiple cancer types.
                </span>
              </li>
            </ul>

            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Start Screening</button>
              <button type="button" className="hiw-step__btn hiw-step__btn--outline" aria-disabled="true">See What’s Screened</button>
            </div>

            <div className="cs-step__notes">
              <p className="cs-step__note">
               Screening services are intended for informational and preventive wellness purposes only.{' '}
                {/* <a href="#" className="cs-step__source" aria-disabled="true">Source</a> */}
              </p>
              <p className="cs-step__note">
                Results may vary and should be reviewed with a qualified healthcare professional.{' '}
                {/* <a href="#" className="cs-step__source" aria-disabled="true">Source</a> */}
              </p>
              <p className="cs-step__note">
                Certain screenings may require provider approval and eligibility review.{' '}
                {/* <a href="#" className="cs-step__source" aria-disabled="true">Source</a> */}
              </p>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-signal-stat-D.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Cancer screening that's upfront and uncomplicated */}
      <section className="hiw-step cs-step cs-step2" aria-label="Upfront and uncomplicated">
        <div className="hiw-step__inner">
          {/* Image is first in markup so the grid places it on the LEFT at desktop */}
          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-signal-test-breakdown-2-D.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>

          <div className="hiw-step__left">
            <h2 className="hiw-step__heading">
              Simple, hassle-free
              <br />
              <span className="cs-step2__accent">cancer screening</span>
            </h2>
            <p className="cs-step2__lead">
              Stay on top of your health with one annual blood test and results delivered directly to your app.
            </p>

            <ol className="cs-step2__list">
              <li className="cs-step2__item">
                <span className="cs-step2__num">1</span>
                <div className="cs-step2__body">
                  <h4 className="cs-step2__title">Quick to schedule</h4>
                  <p className="cs-step2__desc">Book your appointment in just a few steps at a time that works for you.</p>
                </div>
              </li>
              <li className="cs-step2__item">
                <span className="cs-step2__num">2</span>
                <div className="cs-step2__body">
                  <h4 className="cs-step2__title">Fast and convenient visit</h4>
                  <p className="cs-step2__desc">Complete your test in a single visit with no special preparation required.</p>
                </div>
              </li>
              <li className="cs-step2__item">
                <span className="cs-step2__num">3</span>
                <div className="cs-step2__body">
                  <h4 className="cs-step2__title">Wide access to testing</h4>
                  <p className="cs-step2__desc">Choose from a large network of lab locations with flexible scheduling options.</p>
                </div>
              </li>
              <li className="cs-step2__item">
                <span className="cs-step2__num">4</span>
                <div className="cs-step2__body">
                  <h4 className="cs-step2__title">Clear and easy-to-understand results</h4>
                  <p className="cs-step2__desc">Receive straightforward results along with guidance and ongoing support when needed.</p>
                </div>
              </li>
            </ol>

            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Begin Testing</button>
              <button type="button" className="hiw-step__btn hiw-step__btn--outline" aria-disabled="true">View Details</button>
            </div>

            <p className="cs-step__note cs-step2__fineprint">
              A Labs subscription is needed to access the multi-cancer test. Subscriptions may be combined and renew together. Adding the test later may change your renewal timeline.
            </p>
          </div>
        </div>
      </section>

      {/* The science behind the test */}
      <section className="cs-science" aria-label="The science behind the test">
        <div className="cs-science__inner">
          <h2 className="cs-science__title">How the test works</h2>
          <button type="button" className="cs-science__btn" aria-disabled="true">Get started</button>

          <div className="cs-science__cards">
            <article
              className="cs-science__card"
              style={{ backgroundImage: 'url(/images/h-labs-signal-card-1-D.webp)' }}
            >
              <h3 className="cs-science__card-title">
                Cells leave
                <br />
                behind clues
              </h3>
              <p className="cs-science__card-text">
                Your body naturally releases tiny DNA fragments into the bloodstream. Certain patterns in these fragments can indicate potential health concerns.
              </p>
            </article>

            <article
              className="cs-science__card"
              style={{ backgroundImage: 'url(/images/h-labs-signal-card-2-D-2.webp)' }}
            >
              <h3 className="cs-science__card-title">
                Signals are
                <br />
                identified
              </h3>
              <p className="cs-science__card-text">
                Advanced screening analyzes these patterns to detect signals that may be linked to different types of cancer.
              </p>
            </article>

            <article
              className="cs-science__card"
              style={{ backgroundImage: 'url(/images/h-labs-signal-card-3-D-2.webp)' }}
            >
              <h3 className="cs-science__card-title">
                Possible origin
                <br />
                is determined
              </h3>
              <p className="cs-science__card-text">
                If a signal is found, advanced analysis helps estimate where it may be coming from, guiding next steps for care.
              </p>
            </article>
          </div>
        </div>
      </section>
      {/* end science section */}

      {/* Whatever the results, a clear path forward */}
      <section className="cs-results" aria-label="A clear path forward">
        <div className="cs-results__inner">
          <h2 className="cs-results__title">
            No matter your results,
            <br />
            <span className="cs-results__accent">know what comes next</span>
          </h2>
          <p className="cs-results__subtext">
            Get a clear overview of your results, what they mean, and the steps you can take moving forward.
          </p>

          <picture>
            <source media="(max-width: 768px)" srcSet="/images/h-labs-signal-gal-M.webp" />
            <img
              src="/images/h-labs-signal-gal-D.webp"
              alt=""
              className="cs-results__image"
             loading="lazy" decoding="async"/>
          </picture>

          <p className="cs-results__disclaimer">
            Your results suggest a follow-up conversation with a healthcare provider may be beneficial.Additional screening or evaluation may help provide deeper health insights.A healthcare professional can help review your results and discuss possible next steps.Your screening identified signals that may require further attention or monitoring.
          </p>

          <button type="button" className="cs-results__btn" aria-disabled="true">Begin Screening</button>
        </div>
      </section>

      {/* FAQs */}
      <section className="cs-faq" aria-label="healix Multi-Cancer Test FAQs">
        <div className="cs-faq__container">
          <div className="cs-faq__left">
            <h2 className="cs-faq__title">
              Multi-cancer blood test FAQs
            </h2>
          </div>

          <div className="cs-faq__right">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={f.q} className={`cs-faq__item ${isOpen ? 'cs-faq__item--active' : ''}`}>
                  <button
                    type="button"
                    className="cs-faq__question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span>{f.q}</span>
                    <svg className="cs-faq__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className="cs-faq__answer">
                    <div className="cs-faq__answer-inner">
                      {f.a.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                      {f.list && (
                        <ul className="cs-faq__list">
                          {f.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {f.after && <p>{f.after}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Soft footer — Take your health further */}
      <section className="labs-sf labs-sf--cs">
        <div className="labs-sf__wrapper">
          <img
            src="/images/h-labs-signal-soft-footer-D.webp"
            alt=""
            className="labs-sf__bg-img"
           loading="lazy" decoding="async"/>
          <div className="labs-sf__content">
            <div className="labs-sf__top-text">
              <h2 className="labs-sf__heading-top">Move forward with confidence</h2>
              <h2 className="labs-sf__heading-bottom">in your health</h2>
            </div>
            <div className="cs-sf__bottom">
              <h3 className="cs-sf__subheading">with Labs</h3>
              <p className="cs-sf__desc">
                Add advanced cancer screening to your plan and gain deeper insights into your overall health. Get comprehensive testing across key health areas along with a personalized action plan.
              </p>
              <button type="button" className="labs-sf__btn" aria-disabled="true">Explore Labs</button>
            </div>
          </div>
        </div>
      </section>

      <LabsOffcanvas isOpen={labsOpen} onClose={() => setLabsOpen(false)} />

      <Footer />
    </div>
  )
}

export default CancerScreeningPage
