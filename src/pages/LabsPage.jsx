import { Link, useLocation, useNavigate } from 'react-router-dom'
import HealixLogo from '@/components/common/HealixLogo/HealixLogo'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import UserMenu from '@/components/common/UserMenu/UserMenu'
import Footer from '@/components/layout/Footer/Footer'
import DoctorsSection from '@/components/sections/DoctorsSection/DoctorsSection'
import { useEffect, useState } from 'react'
import './LabsPage.scss'

const navLinks = [
  'Health Check',
  'What We Test',
  'How It Works',
  'Action Plan',
  'Cancer Screening',
]

const labsFaqs = [
  {
    id: 1,
    q: 'Can lab testing help detect early health issues?',
    a: "Yes, routine lab testing can help identify potential health concerns before symptoms become serious.",
  },
  {
    id: 2,
    q: 'Are the testing procedures safe and hygienic?',
    a: "Absolutely. All sample collections follow strict medical safety and sanitation standards.",
  },
  {
    id: 3,
    q: 'What should I do before my scheduled test?',
    a: "You may receive preparation guidelines such as hydration, fasting, or medication instructions depending on the selected test.",
  },
  {
    id: 4,
    q: 'Are these lab services suitable for ongoing health monitoring?',
    a: 'Yes, many users regularly use lab testing to track improvements and maintain long-term wellness.',
  },
  {
    id: 5,
    q: 'Is the sample collection process quick?',
    a: 'Most sample collections are completed within a few minutes by trained professionals.',
  },
  {
    id: 6,
    q: 'Can I manage my appointments online?',
    a: "Yes, appointments, reports, and test history can all be managed conveniently through the platform.",
  },
]

const compareRows = [
  { label: 'Tests included annually', healix: '120+', routine: '~20' },
  { label: 'Ongoing health monitoring', healix: true, routine: false },
  { label: 'Personalized wellness insights', healix: true, routine: false },
  { label: 'Digital lab reports', healix: true, routine: false },
  { label: 'Preventive health screening', healix: true, routine: false },
  { label: 'Hormone health analysis', healix: true, routine: false },
  { label: 'Heart health markers', healix: true, routine: false },
  { label: 'Vitamin & nutrient analysis', healix: true, routine: false },
  { label: 'Metabolic wellness testing', healix: true, routine: false },
  { label: 'Thyroid function screening', healix: true, routine: false },
  { label: 'Inflammation tracking', healix: true, routine: false },
]

const LabsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [labsOpen, setLabsOpen] = useState(false)
  const [openFaqId, setOpenFaqId] = useState(null)

  useEffect(() => {
    const handler = () => setLabsOpen(true)
    window.addEventListener('open-labs-offcanvas', handler)
    return () => window.removeEventListener('open-labs-offcanvas', handler)
  }, [])

  return (
    <div className="labs-page">
      {/* Navbar */}
      <header className="labs-nav">
        <div className="labs-nav__container">
          <Link to="/" className="labs-nav__logo" aria-label="Healix homepage">
            <HealixLogo color="dark" size="md" />
          </Link>

          <div className="labs-nav__center">
            {navLinks.map((link) => {
              const linkPath =
                link === 'What We Test' ? '/labs/what-we-test' :
                link === 'How It Works' ? '/labs/how-it-works' :
                link === 'Action Plan' ? '/labs/action-plan' :
                link === 'Cancer Screening' ? '/labs/cancer-screening' :
                '/labs'
              const isActive = location.pathname === linkPath
              return (
              <button
                key={link}
                className={`labs-nav__link ${isActive ? 'labs-nav__link--active' : ''}`}
                onClick={() => navigate(linkPath)}
              >
                {link}
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

      {/* Hero */}
      <section className="labs-hero">
        <div className="labs-hero__content">
          <h1 className="labs-hero__heading">
            Detect early signs of{' '}
            <span className="labs-hero__heading-accent">1,000+</span>
            <br />
            health conditions
          </h1>
          <p className="labs-hero__subtext">
            Stay informed and in control with comprehensive diagnostic testing that supports better health decisions.
          </p>
          <div className="labs-hero__img-wrap">
            {/* Performance: hero image is the LCP candidate on /labs.
                Eager + fetchpriority="high" tells the browser to start
                loading it as early as the HTML is parsed. */}
            <img
              src="/images/h-labs-ATF-graph-T1-D-2.webp"
              alt=""
              className="labs-hero__img"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </div>
          <button className="labs-hero__btn" type="button" aria-disabled="true">Begin Screening</button>
        </div>
      </section>

      {/* Stats */}
      <section className="labs-stats">
        <div className="labs-stats__inner">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/h-Labs-3-up--2D.webp" />
            <img
              src="/images/h-Labs-3-up--2M.webp"
              alt=""
              className="labs-stats__img"
             loading="lazy" decoding="async"/>
          </picture>
          <p className="labs-stats__disclaimer">
            Not offered in all locations. Eligibility criteria and a provider&rsquo;s approval may be required. Test results are for informational purposes only and should not replace professional medical advice.{' '}
            {/* <a href="#" className="labs-stats__more" aria-disabled="true">Learn more</a> */}
          </p>
        </div>
      </section>

      {/* Peace of mind */}
      <section className="labs-peace labs-peace--no-top-sep">
        <div className="labs-peace__inner">
          <h2 className="labs-peace__heading">
            <span className="labs-peace__heading--gradient">Simple steps</span> to better health confidence
          </h2>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/h-Labs-testing-made-simple-3-M%20(1).webp"
            />
            <img
              src="/images/h-Labs-testing-made-simple-3-D.webp"
              alt=""
              className="labs-peace__img"
             loading="lazy" decoding="async"/>
          </picture>
          <div className="labs-peace__actions">
            <button type="button" className="labs-peace__btn labs-peace__btn--primary" aria-disabled="true">Take a Health Test</button>
            <button type="button" className="labs-peace__btn labs-peace__btn--secondary" aria-disabled="true">Explore the Process</button>
          </div>
        </div>
      </section>

      {/* Health Signals */}
      <section className="labs-peace">
        <div className="labs-peace__inner">
          <h2 className="labs-peace__heading">
            Health insights
            <br />
            <span className="labs-peace__heading--gradient">designed around you</span>
          </h2>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/h-Labs-signals-M.webp"
            />
            <img
              src="/images/h-Labs-signals-2-D.webp"
              alt=""
              className="labs-peace__img"
             loading="lazy" decoding="async"/>
          </picture>
          <div className="labs-peace__actions">
            <button type="button" className="labs-peace__btn labs-peace__btn--primary" aria-disabled="true">Track your wellness indicators</button>
          </div>
        </div>
      </section>

      {/* 1000 Conditions */}
      <section className="labs-conditions">
        <div className="labs-conditions__inner">
          <div className="labs-conditions__left">
            <img
              src="/images/h-Labs-1000-conditions-2-D.webp"
              alt=""
              className="labs-conditions__img"
             loading="lazy" decoding="async"/>
          </div>
          <div className="labs-conditions__right">
            <h2 className="labs-conditions__heading">
              Early detection for
              <br />
              <span className="labs-conditions__heading--gradient">better health outcomes</span>
            </h2>
            <p className="labs-conditions__subtext">
              Spot imbalances early&mdash;before noticeable symptoms develop&mdash;through advanced lab analysis.
            </p>
            <div className="labs-conditions__actions">
              <button type="button" className="labs-peace__btn labs-peace__btn--primary" aria-disabled="true">Begin Screening</button>
              <button type="button" className="labs-peace__btn labs-peace__btn--secondary" aria-disabled="true">Discover Our Tests</button>
            </div>
          </div>
        </div>
      </section>

      {/* Action Plan */}
      <section className="labs-action">
        <div className="labs-action__inner">
          <div className="labs-action__left">
            <h2 className="labs-action__heading">Get your personalized care plan</h2>
            <ul className="labs-action__list">
              {[
                'Tailored recommendations based on your test results',
                'Guidance on lifestyle habits, nutrition, and treatment options if appropriate',
                'Ongoing support with access to licensed healthcare professionals',
              ].map((item) => (
                <li key={item} className="labs-action__list-item">
                  <span className="labs-action__tick" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="labs-action__actions">
              <button type="button" className="labs-peace__btn labs-peace__btn--primary" aria-disabled="true">Begin Screening</button>
              <button type="button" className="labs-peace__btn labs-peace__btn--secondary" aria-disabled="true">Explore Your Plan</button>
            </div>
          </div>
          <div className="labs-action__right">
            <img
              src="/images/h-Labs-Action-Plan-submod.webp"
              alt=""
              className="labs-action__img"
             loading="lazy" decoding="async"/>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="labs-compare">
        <div className="labs-compare__inner">
          <h2 className="labs-compare__heading">
            Understand your body better with advanced insights&mdash;
            <br />
            <span className="labs-compare__heading--gradient">without the high cost</span>
          </h2>

          <div className="labs-compare__table" role="table" aria-label="Labs by healix vs routine labwork">
            <div className="labs-compare__headrow" role="row">
              <div className="labs-compare__cell labs-compare__cell--label" role="columnheader" />
              <div className="labs-compare__cell labs-compare__cell--healix" role="columnheader">Labs by Healix</div>
              <div className="labs-compare__cell labs-compare__cell--routine" role="columnheader">Routine labwork</div>
            </div>

            {compareRows.map((row) => (
              <div key={row.label} className="labs-compare__row" role="row">
                <div className="labs-compare__cell labs-compare__cell--label" role="cell">{row.label}</div>
                <div className="labs-compare__cell labs-compare__cell--healix" role="cell">
                  {typeof row.healix === 'string' ? (
                    <span className="labs-compare__value">{row.healix}</span>
                  ) : (
                    <span className="labs-compare__check" aria-label="Included">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                    </span>
                  )}
                </div>
                <div className="labs-compare__cell labs-compare__cell--routine" role="cell">
                  {typeof row.routine === 'string' ? (
                    <span className="labs-compare__value labs-compare__value--muted">{row.routine}</span>
                  ) : (
                    <span className="labs-compare__cross" aria-label="Not included">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14" /></svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="labs-compare__cta">
            <button type="button" className="labs-peace__btn labs-peace__btn--primary" aria-disabled="true">Begin Screening</button>
          </div>
        </div>
      </section>

      {/* Cancer screening */}
      <section className="labs-cancer">
        <div className="labs-cancer__inner">
          <span className="labs-cancer__badge">Advanced multi-cancer screening</span>
          <h2 className="labs-cancer__heading">
            Enhance your wellness plan with
            <br />
            <span className="labs-cancer__heading--gradient">advanced diagnostic testing.</span>
          </h2>
          <p className="labs-cancer__sub">
            Go beyond routine testing with a more comprehensive screening option, all from one simple blood draw included in your lab plan.
          </p>

          <div className="labs-cancer__media">
            <div className="labs-cancer__img-wrap">
              <picture>
                <source media="(min-width: 768px)" srcSet="/images/h-labs-signal-50-plus-D-3.webp" />
                <img
                  src="/images/h-labs-signal-50-plus-M-3.webp"
                  alt=""
                  className="labs-cancer__img"
                 loading="lazy" decoding="async"/>
              </picture>
            </div>
          </div>

          <div className="labs-cancer__actions">
            <button type="button" className="labs-peace__btn labs-peace__btn--primary" aria-disabled="true">Begin Your Journey</button>
            <button type="button" className="labs-peace__btn labs-peace__btn--secondary" aria-disabled="true">Discover More</button>
          </div>

          <p className="labs-cancer__disclaimer">
            Availability may vary by location. Eligibility and a valid prescription may be required. This test has not been approved by the FDA and is generally intended for individuals at higher risk of cancer, including adults aged 50 and above.{' '}
            {/* <a href="#" className="labs-cancer__more" aria-disabled="true">Learn more</a> */}
          </p>
        </div>
      </section>

      {/* Doctors (reused from Home) */}
      <div className="labs-doctors-wrap">
        <DoctorsSection />
      </div>

      {/* Holistic care */}
      <section className="labs-holistic">
        <div className="labs-holistic__inner">
          <h2 className="labs-holistic__heading">
            <span className="labs-holistic__heading--gradient">All your healthcare,</span>
            <br />
            simplified in one place
          </h2>
          <p className="labs-holistic__sub">
            Your test results are just the start&mdash;get continued support, reliable treatments, and access to expert care whenever you need it.
          </p>

          <picture>
            <source media="(min-width: 576px)" srcSet="/images/h-labs-holistic-D.webp" />
            <img
              src="/images/h-labs-holistic-M.webp"
              alt=""
              className="labs-holistic__img"
             loading="lazy" decoding="async"/>
          </picture>

          <p className="labs-holistic__disclaimer">
            Testing and treatment options are subject to medical review and availability.
            
            .{' '}
            {/* <a href="#" className="labs-holistic__more" aria-disabled="true">Source</a> */}
          </p>

          <button type="button" className="labs-peace__btn labs-peace__btn--primary labs-holistic__cta" aria-disabled="true">Start testing</button>
        </div>
      </section>

      {/* FAQ */}
      <section className="labs-faq">
        <div className="labs-faq__inner">
          <div className="labs-faq__list">
            {labsFaqs.map((item) => {
              const isOpen = openFaqId === item.id
              return (
                <div
                  key={item.id}
                  className={`labs-faq__item ${isOpen ? 'labs-faq__item--open' : ''}`}
                >
                  <button
                    type="button"
                    className="labs-faq__q"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="labs-faq__q-text">{item.q}</span>
                    <svg className="labs-faq__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className="labs-faq__a-wrap" aria-hidden={!isOpen}>
                    <p className="labs-faq__a">{item.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="labs-faq__cta-wrap">
            <button type="button" className="labs-peace__btn labs-peace__btn--primary labs-faq__cta" aria-disabled="true">See all FAQs</button>
          </div>
        </div>
      </section>

      {/* Soft footer */}
      <section className="labs-sf labs-sf--hc">
        <div className="labs-sf__wrapper">
          <img
            src="/images/h-labs-soft-footer-D.webp"
            alt=""
            className="labs-sf__bg-img"
           loading="lazy" decoding="async"/>
          <div className="labs-sf__content">
            <div className="labs-sf__top-text">
              <h2 className="labs-sf__heading-top">Healthy living</h2>
            </div>
            <div className="labs-sf__cta-group">
              <h2 className="labs-sf__heading-bottom">starts at your core</h2>
              <button type="button" className="labs-sf__btn" aria-disabled="true">Start testing</button>
            </div>
          </div>
        </div>
      </section>

      {/* Labs Offcanvas */}
      <LabsOffcanvas isOpen={labsOpen} onClose={() => setLabsOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LabsPage
