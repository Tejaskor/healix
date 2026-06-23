import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HealixLogo from '@/components/common/HealixLogo/HealixLogo'
import UserMenu from '@/components/common/UserMenu/UserMenu'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import Footer from '@/components/layout/Footer/Footer'
import './LabsPage.scss'
import './HowItWorksPage.scss'
import './ActionPlanPage.scss'

const navLinks = [
  { label: 'Health Check', to: '/labs' },
  { label: 'What We Test', to: '/labs/what-we-test' },
  { label: 'How It Works', to: '/labs/how-it-works' },
  { label: 'Action Plan', to: '/labs/action-plan' },
  { label: 'Cancer Screening', to: '/labs/cancer-screening' },
]

const ActionPlanPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [labsOpen, setLabsOpen] = useState(false)

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

      {/* Hero — full-screen background with top text + bottom CTA */}
      <section className="action-hero" aria-label="Action Plan hero">
        <div className="action-hero__top">
          <h1 className="action-hero__heading">Plan for a healthier future</h1>
          <p className="action-hero__sub">
            Take the next step with a personalized care plan
            <br />
            designed by medical experts.
          </p>
        </div>

        <div className="action-hero__bottom">
          <button type="button" className="action-hero__btn" aria-disabled="true">Let’s Begin</button>
          {/* <p className="action-hero__note">For illustrative purposes only.</p> */}
        </div>
      </section>

      {/* Disclaimer / info */}
      <section className="action-disclaimer" aria-label="Disclaimer">
        <div className="action-disclaimer__inner">
          <p className="action-disclaimer__text">
            Not available in certain regions. Eligibility and provider approval may be required. Lab results are for informational use only and are not intended to diagnose, treat, or cure any condition.{' '}
            {/* <a href="#" className="action-disclaimer__link" aria-disabled="true">Learn more</a> */}
          </p>
          <p className="action-disclaimer__text">
            Care plans are developed by medical professionals and may include personalized recommendations to support your health. Providers may contact you if important results are identified, and plans can include ongoing access to provider messaging.
          </p>
        </div>
      </section>

      {/* Step 01 — Learn where to focus first */}
      <section className="hiw-step ap-step" aria-label="Learn where to focus">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill hiw-step__pill--num">01</span>
            <h2 className="hiw-step__heading">
              Know what to prioritize
              <br />
              for your health
            </h2>
            <p className="ap-step__desc">
              Your results come with clear next steps to help you improve the areas that matter most.
            </p>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Start Here</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-AP-overview-M.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 02 — Get expert guidance */}
      <section className="hiw-step ap-step" aria-label="Get expert guidance">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill hiw-step__pill--num">02</span>
            <h2 className="hiw-step__heading">
              Expert Insights for
              <br />
             Better Wellness
            </h2>
            <p className="ap-step__desc">
              Take steps to improve your health with lifestyle recommendations and, when appropriate, treatment options.
            </p>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Get Insights</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-AP-ldl-M.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 03 — Access Rx medication */}
      <section className="hiw-step ap-step" aria-label="Access Rx medication">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill hiw-step__pill--num">03</span>
            <h2 className="hiw-step__heading">
              Explore prescription
              <br />
              options, if appropriate
            </h2>
            <p className="ap-step__desc">
              After a simple assessment, providers may recommend treatment based on your results, medical history, and health goals.
            </p>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Check Eligibility</button>
            </div>
            <p className="ap-step__fineprint">
              Compounded medications are not formally evaluated for safety, effectiveness, or quality. A valid prescription is required.
            </p>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-AP-rx-2-M.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 04 — See your progress, test to test */}
      <section className="hiw-step ap-step" aria-label="See your progress">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill hiw-step__pill--num">04</span>
            <h2 className="hiw-step__heading">Understand Your Health Trends</h2>
            <p className="ap-step__desc">
              Monitor changes in your health with regular follow-up testing, with additional tests included in select plans.
            </p>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Track Progress</button>
            </div>
            <p className="ap-step__fineprint ap-step__fineprint--light">
              Extra lab testing may be included with certain treatment plans.
            </p>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-AP-track-M.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 05 — Ongoing care */}
      <section className="hiw-step ap-step" aria-label="Ongoing care">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill hiw-step__pill--num">05</span>
            <h2 className="hiw-step__heading">
             Your Wellness Team,
              <br />
              Always Here
            </h2>
            <p className="ap-step__desc">
              Connect with experienced providers for personalized answers, recommendations, and wellness support.
            </p>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Get Support</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-AP-chat-M.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Soft footer — reuses .labs-sf, with fineprint under the button */}
      <section className="labs-sf labs-sf--ap">
        <div className="labs-sf__wrapper">
          <img
            src="/images/h-labs-AP-sf-3-D.webp"
            alt=""
            className="labs-sf__bg-img"
           loading="lazy" decoding="async"/>
          <div className="labs-sf__content">
            <div className="labs-sf__top-text">
              <h2 className="labs-sf__heading-top">Your health journey,</h2>
              <h2 className="labs-sf__heading-bottom">supported at every step</h2>
            </div>
            <div className="ap-sf__bottom">
              <button type="button" className="labs-sf__btn" aria-disabled="true">Start Progress</button>
              <p className="ap-sf__note">
                Compounded medications are not formally evaluated for safety, effectiveness, or quality. A valid prescription is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LabsOffcanvas isOpen={labsOpen} onClose={() => setLabsOpen(false)} />

      <Footer />
    </div>
  )
}

export default ActionPlanPage
