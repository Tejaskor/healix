import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import './TermsPage.scss'

const PAGE_TITLE = 'Healix Terms & Conditions'
const PAGE_DESCRIPTION =
  'Read Healix Terms & Conditions covering telehealth services, memberships, payments, laboratory testing, weightloss programs, privacy, and healthcare policies.'
const LAST_UPDATED = '18 May 2026'

// Sections live in a single array so the sidebar and the body stay in sync.
// `body` is a render-prop returning JSX so we can mix paragraphs, lists and
// the warning box without templating gymnastics.
const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: () => (
      <>
        <p>
          Welcome to Healix. By accessing or using our website, mobile experiences,
          telehealth consultations, memberships, laboratory testing, weight loss
          programs, and sexual health services (collectively, the &ldquo;Services&rdquo;),
          you agree to be bound by these Terms &amp; Conditions.
        </p>
        <p>
          If you do not agree with any part of these terms, please discontinue use of
          the Services. These terms apply across every Healix touchpoint &mdash; from
          casual website browsing to active care plans.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    body: () => (
      <ul>
        <li>You must be at least <strong>18 years of age</strong> to use Healix Services.</li>
        <li>You agree to provide accurate, current, and complete information during account creation and ongoing care.</li>
        <li>You must comply with all applicable local, state, and national healthcare and consumer laws when using the Services.</li>
      </ul>
    ),
  },
  {
    id: 'medical-disclaimer',
    title: '3. Medical Disclaimer',
    body: () => (
      <>
        <p>
          Content on Healix is for educational and informational purposes only and is
          not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
        <ul>
          <li>Information shared via the Services is not emergency medical care.</li>
          <li>No diagnosis is guaranteed solely through online interactions.</li>
          <li>Always consult a licensed clinician for decisions about your health.</li>
        </ul>
        <div className="terms-warning" role="note">
          <AlertTriangle size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>Healix does not provide emergency medical services.</strong>{' '}
            If you are experiencing a medical emergency, call your local emergency
            number or visit the nearest emergency department immediately.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'telehealth',
    title: '4. Telehealth Services',
    body: () => (
      <ul>
        <li>Consultations are typically conducted virtually through video, voice, or asynchronous messaging.</li>
        <li>Availability of providers and treatments depends on your region and applicable licensure.</li>
        <li>Providers may decline to prescribe or continue treatment when clinically inappropriate.</li>
        <li>Technical interruptions can occur; Healix is not liable for service unavailability outside our reasonable control.</li>
      </ul>
    ),
  },
  {
    id: 'user-responsibilities',
    title: '5. User Responsibilities',
    body: () => (
      <ul>
        <li>Provide truthful, accurate medical and personal information.</li>
        <li>Maintain the confidentiality of your account credentials.</li>
        <li>Use the platform only for lawful, intended healthcare purposes.</li>
        <li>Do not engage in fraudulent, abusive, or illegal activities.</li>
      </ul>
    ),
  },
  {
    id: 'memberships',
    title: '6. Memberships & Appointments',
    body: () => (
      <ul>
        <li>Healix offers subscription-based plans with automatic renewal until cancelled.</li>
        <li>You may cancel at any time; cancellations take effect at the end of the active billing period.</li>
        <li>Refunds, if applicable, are governed by the plan terms presented at checkout.</li>
        <li>Missed or late appointments may incur fees or impact future scheduling availability.</li>
      </ul>
    ),
  },
  {
    id: 'payments',
    title: '7. Payments',
    body: () => (
      <ul>
        <li>Payments are processed securely through industry-standard payment providers.</li>
        <li>You authorize Healix (and our processors) to charge your designated payment method for fees due.</li>
        <li>Applicable taxes will be added at checkout where required by law.</li>
        <li>Failed payments may pause Services until the issue is resolved.</li>
      </ul>
    ),
  },
  {
    id: 'lab-services',
    title: '8. Laboratory Services',
    body: () => (
      <ul>
        <li>Laboratory results may vary based on individual biology, timing, and sample handling.</li>
        <li>Stated turnaround times are estimates, not guarantees.</li>
        <li>Screenings provide indicators; they do not constitute a definitive diagnosis.</li>
        <li>Some tests are processed by accredited third-party laboratories.</li>
      </ul>
    ),
  },
  {
    id: 'health-disclaimers',
    title: '9. Weightloss & Sexual Health Disclaimer',
    body: () => (
      <ul>
        <li>Treatment outcomes vary by individual; no specific result is guaranteed.</li>
        <li>Suitability for any program is determined by your provider after clinical evaluation.</li>
        <li>Prescribed medications may carry side effects; review provided information carefully.</li>
        <li>Follow your provider&rsquo;s instructions and report adverse effects promptly.</li>
      </ul>
    ),
  },
  {
    id: 'ip',
    title: '10. Intellectual Property',
    body: () => (
      <ul>
        <li>The Healix name, logo, brand assets, and Services content are owned by Healix and its licensors.</li>
        <li>All trademarks, copyrights, and other intellectual property rights are protected by law.</li>
        <li>You may not copy, reproduce, modify, distribute, or create derivative works without prior written consent.</li>
      </ul>
    ),
  },
  {
    id: 'privacy',
    title: '11. Privacy & Health Data',
    body: () => (
      <>
        <p>
          We treat your information &mdash; including protected health information &mdash; with
          care. Healix uses administrative, technical, and physical safeguards to
          help protect your data.
        </p>
        <p>
          For full details on data collection, use, sharing, and your rights,
          please see our Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: 'prohibited',
    title: '12. Prohibited Activities',
    body: () => (
      <ul>
        <li>Attempting to hack, probe, or disrupt Healix systems or other users.</li>
        <li>Abusive, harassing, or threatening behavior toward providers or staff.</li>
        <li>Uploading malicious code, scripts, or content designed to harm the Services.</li>
        <li>Impersonating another person or misrepresenting your identity.</li>
      </ul>
    ),
  },
  {
    id: 'liability',
    title: '13. Limitation of Liability',
    body: () => (
      <ul>
        <li>The Services are provided &ldquo;as is&rdquo; without warranties of uninterrupted or error-free operation.</li>
        <li>To the maximum extent permitted by law, Healix is not liable for indirect, incidental, or consequential damages.</li>
        <li>Your use of the Services is at your sole risk.</li>
      </ul>
    ),
  },
  {
    id: 'third-party',
    title: '14. Third-Party Services',
    body: () => (
      <ul>
        <li>Payment gateways and processors handle transactions.</li>
        <li>Independent licensed healthcare providers may deliver clinical care.</li>
        <li>Accredited third-party laboratories may process certain tests.</li>
        <li>Analytics and infrastructure partners help us operate and improve the Services.</li>
      </ul>
    ),
  },
  {
    id: 'termination',
    title: '15. Account Termination',
    body: () => (
      <p>
        Healix may suspend or terminate your account, with or without notice, if
        you violate these Terms, misuse the Services, or for reasons necessary to
        protect users, providers, or platform integrity. You may also close your
        account at any time from your account settings.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '16. Changes to Terms',
    body: () => (
      <p>
        We may update these Terms from time to time to reflect changes in our
        Services, business, or applicable law. Material changes will be
        communicated through the website or via email. Continued use of the
        Services after updates take effect constitutes acceptance.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: '17. Governing Law',
    body: () => (
      <p>
        These Terms shall be governed by applicable healthcare and consumer
        protection laws. Any disputes will be resolved in accordance with the
        rules of the appropriate jurisdiction.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '18. Contact Information',
    body: () => (
      <ul className="terms-contact">
        <li>
          <span className="terms-contact__label">Email:</span>{' '}
          <a href="mailto:support@healix.com">support@healix.com</a>
        </li>
        <li>
          <span className="terms-contact__label">Contact page:</span>{' '}
          <a href="/" target="_blank" rel="noopener noreferrer">healix.com</a>
        </li>
        <li>
          <span className="terms-contact__label">Address:</span>{' '}
          Healix Health, [Business address to be confirmed]
        </li>
      </ul>
    ),
  },
]

const TermsPage = () => {
  // Track which sections are open on mobile. Default: only the first section
  // expanded so first-time visitors have an immediate reading surface but the
  // page doesn't feel like a wall of text.
  const [openIds, setOpenIds] = useState(() => new Set([SECTIONS[0].id]))

  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // No react-helmet in the project — set title + description directly and
  // restore on unmount.
  useEffect(() => {
    const previousTitle = document.title
    document.title = PAGE_TITLE

    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta ? meta.getAttribute('content') : null
    if (meta) meta.setAttribute('content', PAGE_DESCRIPTION)

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription)
      }
    }
  }, [])

  return (
    <main className="terms-page">
      <div className="terms-page__inner">
        <nav className="terms-page__breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-current="page">Terms &amp; Conditions</li>
          </ol>
        </nav>

        <header className="terms-page__header">
          <span className="terms-page__eyebrow">Legal</span>
          <h1 className="terms-page__title">Terms &amp; Conditions</h1>
          <p className="terms-page__subtitle">
            Please read these terms carefully before using Healix services,
            memberships, telehealth consultations, laboratory testing, and
            healthcare programs.
          </p>
          <p className="terms-page__meta">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="terms-page__layout">
          <aside className="terms-sidebar" aria-label="Section navigation">
            <p className="terms-sidebar__label">On this page</p>
            <ul className="terms-sidebar__list">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="terms-sidebar__link">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="terms-page__content">
            {SECTIONS.map((section, idx) => {
              const isOpen = openIds.has(section.id)
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={`terms-section${isOpen ? ' is-open' : ''}`}
                  aria-labelledby={`${section.id}-heading`}
                >
                  <h2 className="terms-section__heading" id={`${section.id}-heading`}>
                    <button
                      type="button"
                      className="terms-section__toggle"
                      aria-expanded={isOpen}
                      aria-controls={`${section.id}-body`}
                      onClick={() => toggle(section.id)}
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2.2}
                        className="terms-section__chev"
                        aria-hidden="true"
                      />
                    </button>
                  </h2>

                  <div
                    id={`${section.id}-body`}
                    className="terms-section__body"
                    role="region"
                    aria-labelledby={`${section.id}-heading`}
                  >
                    {section.body()}
                  </div>

                  {idx < SECTIONS.length - 1 && (
                    <hr className="terms-section__divider" aria-hidden="true" />
                  )}
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

export default TermsPage
