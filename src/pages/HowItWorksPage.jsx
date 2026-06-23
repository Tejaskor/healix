import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AnnouncementBar from '@/components/layout/AnnouncementBar/AnnouncementBar'
import HealixLogo from '@/components/common/HealixLogo/HealixLogo'
import UserMenu from '@/components/common/UserMenu/UserMenu'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import Footer from '@/components/layout/Footer/Footer'
import './LabsPage.scss'
import './WhatWeTestPage.scss'
import './HowItWorksPage.scss'

const navLinks = [
  { label: 'Health Check', to: '/labs' },
  { label: 'What We Test', to: '/labs/what-we-test' },
  { label: 'How It Works', to: '/labs/how-it-works' },
  { label: 'Action Plan', to: '/labs/action-plan' },
  { label: 'Cancer Screening', to: '/labs/cancer-screening' },
]

const HowItWorksPage = () => {
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
      <AnnouncementBar
        iconSrc={null}
        message={(
          <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Full-body lab testing without the high cost
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        )}
        ctaText=""
        ctaHref=""
        className="announcement-bar--labs"
      />

      {/* Shared Labs navbar */}
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

      {/* Hero — "How it works" */}
      <section className="hiw-hero">
        <div className="hiw-hero__inner">
          <p className="hiw-hero__eyebrow">Healix Diagnostics</p>
          <h1 className="hiw-hero__heading">How it works</h1>
          <p className="hiw-hero__disclaimer">
            Availability may vary. Eligibility and provider approval may be required. Results are for informational use only and are not a substitute for medical advice, diagnosis, or treatment.{' '}
            {/* <a href="#" className="hiw-hero__more" aria-disabled="true">Learn more</a> */}
          </p>
        </div>
      </section>

      {/* Step 1 — Schedule your first test */}
      <section className="hiw-step" aria-label="Step 1">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill">Step 1</span>
            <h2 className="hiw-step__heading">Book your first test</h2>
            <ul className="hiw-step__list">
              {[
                'Schedule a lab visit at a time that fits your routine',
                'Access a wide network of trusted testing centers',
                'Complete comprehensive testing in a single visit\u2014no insurance needed',
              ].map((text) => (
                <li key={text} className="hiw-step__item">
                  <span className="hiw-step__check" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="hiw-step__item-text">{text}</span>
                </li>
              ))}
            </ul>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Schedule Today</button>
              <button type="button" className="hiw-step__btn hiw-step__btn--outline" aria-disabled="true">View Screening Details</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-hiwsteps-1.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2 — Get your insights */}
      <section className="hiw-step" aria-label="Step 2">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill">Step 2</span>
            <h2 className="hiw-step__heading">Understand Your Health</h2>
            <ul className="hiw-step__list">
              {[
                'Understand your results with clear explanations',
                'Identify key areas that may need focus',
                'Connect with providers anytime through the app',
              ].map((text) => (
                <li key={text} className="hiw-step__item">
                  <span className="hiw-step__check" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="hiw-step__item-text">{text}</span>
                </li>
              ))}
            </ul>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Explore Insights</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-hiwsteps-2.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 — Follow your Action Plan */}
      <section className="hiw-step" aria-label="Step 3">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill">Step 3</span>
            <h2 className="hiw-step__heading">Take action on your plan</h2>
            <ul className="hiw-step__list">
              {[
                'Get a personalized plan to guide your next steps',
                'Follow recommendations for lifestyle and daily habits',
                'Review treatment options if appropriate',
              ].map((text) => (
                <li key={text} className="hiw-step__item">
                  <span className="hiw-step__check" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="hiw-step__item-text">{text}</span>
                </li>
              ))}
            </ul>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Take Action Today</button>
              <button type="button" className="hiw-step__btn hiw-step__btn--outline" aria-disabled="true">Discover Your Plan</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h_biomarker_whatarebiomarkers.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4 — Measure your progress */}
      <section className="hiw-step" aria-label="Step 4">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill">Step 4</span>
            <h2 className="hiw-step__heading">Monitor Your Health</h2>
            <ul className="hiw-step__list">
              {[
                'Repeat key health tests to monitor changes over time',
                'Compare your latest results with your baseline',
                'Access your health data anytime through a secure app',
              ].map((text) => (
                <li key={text} className="hiw-step__item">
                  <span className="hiw-step__check" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="hiw-step__item-text">{text}</span>
                </li>
              ))}
            </ul>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Start Monitoring</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-hiwsteps-4.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Step 5 — Track your health */}
      <section className="hiw-step" aria-label="Step 5">
        <div className="hiw-step__inner">
          <div className="hiw-step__left">
            <span className="hiw-step__pill">Step 5</span>
            <h2 className="hiw-step__heading">Monitor your health over time</h2>
            <ul className="hiw-step__list">
              {[
                'Continue testing to follow your health trends',
                'Spot changes early and understand potential risks',
                'Track how your body is aging with ongoing insights',
              ].map((text) => (
                <li key={text} className="hiw-step__item">
                  <span className="hiw-step__check" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="hiw-step__item-text">{text}</span>
                </li>
              ))}
            </ul>
            <div className="hiw-step__actions">
              <button type="button" className="hiw-step__btn hiw-step__btn--primary" aria-disabled="true">Begin Screening</button>
            </div>
          </div>

          <div className="hiw-step__right">
            <div className="hiw-step__card">
              <img
                src="/images/h-labs-hiwsteps-5.webp"
                alt=""
                className="hiw-step__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Learn 5x more — image with overlay bullets + text right */}
      <section className="hiw-learn" aria-label="Learn 5x more about your body">
        <div className="hiw-learn__inner">
          <div className="hiw-learn__left">
            <div className="hiw-learn__media">
              <img
                src="/images/h-labs-learn6x-phone.webp"
                alt=""
                className="hiw-learn__img"
               loading="lazy" decoding="async"/>
              <ul className="hiw-learn__overlay">
                {[
                  'Detect early changes in your health',
                  'Test regularly throughout the year',
                  'Get access to advanced health insights',
                  'Simple and transparent annual pricing',
                ].map((text) => (
                  <li key={text} className="hiw-learn__item">
                    <span className="hiw-learn__check" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    <span className="hiw-learn__item-text">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hiw-learn__right">
            <h2 className="hiw-learn__heading">
              Understand your body with <span className="hiw-learn__accent">deeper insights</span>—without the high cost
            </h2>
            <p className="hiw-learn__desc">
              Get a more complete view of your health with advanced testing designed to detect early signals across a wide range of conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer / Footnotes */}
      <section className="hiw-disclaimer" aria-label="Disclaimer and footnotes">
        <div className="hiw-disclaimer__inner">
          <p className="hiw-disclaimer__top">
            Not available in certain regions. Eligibility and provider approval may be required. Lab results are intended for informational purposes only and are not a substitute for medical diagnosis, treatment, or care.{' '}
            {/* <a href="#" className="hiw-disclaimer__more" aria-disabled="true">Learn more</a> */}
          </p>
          <ol className="hiw-disclaimer__notes">
            <li className="hiw-disclaimer__note">
              Standard blood tests often include a limited set of panels such as complete blood count, basic metabolic panel, lipid profile, HbA1c, and thyroid function tests.
            </li>
            <li className="hiw-disclaimer__note">
              Costs for similar direct-to-consumer testing services can be significantly higher depending on the scope of analysis.
            </li>
            <li className="hiw-disclaimer__note">
              These tests evaluate key biological indicators. While not diagnostic on their own, they can provide valuable insights to help healthcare providers better understand potential underlying health patterns.
            </li>
          </ol>
        </div>
      </section>

      {/* Soft footer — reusing the Labs page .labs-sf styles */}
      <section className="labs-sf labs-sf--hiw">
        <div className="labs-sf__wrapper">
          <img
            src="/images/h_biomarker_onyourmarks-d.webp"
            alt=""
            className="labs-sf__bg-img"
           loading="lazy" decoding="async"/>
          <div className="labs-sf__content">
            <div className="labs-sf__top-text">
              <h2 className="labs-sf__heading-top">Better health</h2>
              <h2 className="labs-sf__heading-bottom">starts inside</h2>
            </div>
            <button type="button" className="labs-sf__btn" aria-disabled="true">Start testing</button>
          </div>
        </div>
      </section>

      <LabsOffcanvas isOpen={labsOpen} onClose={() => setLabsOpen(false)} />

      <Footer />
    </div>
  )
}

export default HowItWorksPage
