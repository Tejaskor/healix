import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ShieldCheck } from 'lucide-react'
import './PrivacyPage.scss'

const PAGE_TITLE = 'Healix Privacy Policy'
const PAGE_DESCRIPTION =
  'Learn how Healix collects, uses, protects, and manages your personal and health-related information for telehealth, laboratory testing, memberships, and healthcare services.'
const LAST_UPDATED = '18 May 2026'

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: () => (
      <>
        <p>
          Healix is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, share, and safeguard your personal and
          health-related information when you use our website, telehealth
          consultations, laboratory testing, memberships, weight loss programs,
          and sexual health services (collectively, the &ldquo;Services&rdquo;).
        </p>
        <p>
          By accessing or using the Services you acknowledge that you have read
          and understood this Policy. If you do not agree, please discontinue
          using the Services.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    body: () => (
      <>
        <p>
          We collect information you provide directly, information generated as
          you use the Services, and information from authorised third parties.
        </p>

        <h3 className="privacy-subheading">A. Personal Information</h3>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Mailing address</li>
          <li>Date of birth</li>
        </ul>

        <h3 className="privacy-subheading">B. Health Information</h3>
        <ul>
          <li>Medical history and current conditions</li>
          <li>Symptoms reported during assessments and consultations</li>
          <li>Laboratory results and reports</li>
          <li>Consultation notes and treatment plans</li>
          <li>Weight loss and sexual health information shared with providers</li>
        </ul>

        <h3 className="privacy-subheading">C. Payment Information</h3>
        <ul>
          <li>Billing name and address</li>
          <li>Subscription and plan records</li>
          <li>Transaction history</li>
        </ul>

        <h3 className="privacy-subheading">D. Technical Information</h3>
        <ul>
          <li>IP address and approximate location</li>
          <li>Device, operating system, and hardware identifiers</li>
          <li>Browser type and version</li>
          <li>Cookies and similar tracking technologies</li>
          <li>Analytics and usage data</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Information',
    body: () => (
      <ul>
        <li>Providing and personalising healthcare Services.</li>
        <li>Scheduling appointments and managing care plans.</li>
        <li>Facilitating telehealth consultations.</li>
        <li>Processing payments, subscriptions, and refunds.</li>
        <li>Improving the Services, content, and user experience.</li>
        <li>Monitoring security and preventing fraud or misuse.</li>
        <li>Providing customer and care-team support.</li>
        <li>Sending reminders, notifications, and important account messages.</li>
      </ul>
    ),
  },
  {
    id: 'telehealth-data',
    title: '4. Telehealth & Health Data Usage',
    body: () => (
      <>
        <ul>
          <li>Your information may be shared with licensed healthcare providers delivering your care.</li>
          <li>Consultations and care interactions may be documented for clinical and quality purposes.</li>
          <li>Health information is stored and transmitted using protected systems.</li>
        </ul>
        <div className="privacy-notice" role="note">
          <ShieldCheck size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>Your health information is handled using industry-standard privacy and security practices.</strong>{' '}
            We use administrative, technical, and physical safeguards designed
            to protect the confidentiality and integrity of your data.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking Technologies',
    body: () => (
      <>
        <ul>
          <li>Cookies that maintain sessions and remember preferences.</li>
          <li>Local and session storage used by the application.</li>
          <li>Analytics tools that help us understand how the Services are used.</li>
          <li>Preference tracking to personalise content and recommendations.</li>
        </ul>
        <p>
          You can manage cookie preferences through your browser settings.
          Disabling certain cookies may affect Service functionality.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: '6. Sharing of Information',
    body: () => (
      <>
        <p>We may share information with:</p>
        <ul>
          <li>Licensed healthcare providers involved in your care.</li>
          <li>Accredited laboratory partners processing your tests.</li>
          <li>Payment processors handling transactions.</li>
          <li>Technology providers operating our infrastructure.</li>
          <li>Legal or regulatory authorities when required by law.</li>
        </ul>
        <p>
          <strong>Healix does not sell personal health information.</strong>
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: '7. Data Security',
    body: () => (
      <ul>
        <li>Encryption for data in transit and at rest where applicable.</li>
        <li>Secure servers and segmented network environments.</li>
        <li>Role-based access controls restricting who can view your data.</li>
        <li>Continuous security monitoring and routine audits.</li>
        <li>Industry-standard protections aligned with healthcare best practices.</li>
      </ul>
    ),
  },
  {
    id: 'rights',
    title: '8. User Rights & Choices',
    body: () => (
      <>
        <p>Subject to applicable law, you may:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate or incomplete information.</li>
          <li>Request deletion of your data, subject to retention requirements.</li>
          <li>Withdraw consent where processing is based on consent.</li>
          <li>Opt out of non-essential marketing communications at any time.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'retention',
    title: '9. Data Retention',
    body: () => (
      <ul>
        <li>We retain personal information only for as long as necessary to deliver the Services and meet operational needs.</li>
        <li>Certain healthcare and billing records are retained for longer periods to comply with applicable laws and regulations.</li>
      </ul>
    ),
  },
  {
    id: 'third-party',
    title: '10. Third-Party Services',
    body: () => (
      <ul>
        <li>Payment gateways processing your transactions.</li>
        <li>Analytics tools measuring Service performance and engagement.</li>
        <li>External laboratories handling certain diagnostic tests.</li>
        <li>Telehealth platforms and communication integrations.</li>
      </ul>
    ),
  },
  {
    id: 'children',
    title: '11. Children’s Privacy',
    body: () => (
      <p>
        The Services are intended for adults aged 18 and older. We do not
        knowingly collect personal information from individuals under 18. If
        you believe a minor has provided us information, please contact us so
        we can remove it.
      </p>
    ),
  },
  {
    id: 'international',
    title: '12. International Data Transfers',
    body: () => (
      <p>
        Depending on our service infrastructure, your data may be processed in
        regions outside your country of residence. Where required, we use
        appropriate safeguards to protect international transfers consistent
        with applicable law.
      </p>
    ),
  },
  {
    id: 'consumer-health',
    title: '13. Consumer Health Data Protection',
    body: () => (
      <ul>
        <li>We treat health-related information with heightened care.</li>
        <li>Access is limited to authorised personnel and partners on a need-to-know basis.</li>
        <li>Our practices align with consumer health data privacy standards in the jurisdictions we serve.</li>
      </ul>
    ),
  },
  {
    id: 'changes',
    title: '14. Changes to This Privacy Policy',
    body: () => (
      <p>
        We may update this Policy periodically to reflect changes in our
        Services, business, or applicable law. Material changes will be
        communicated through the website or via email. We encourage you to
        review this page regularly.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '15. Contact Information',
    body: () => (
      <ul className="privacy-contact">
        <li>
          <span className="privacy-contact__label">Email:</span>{' '}
          <a href="mailto:privacy@healix.com">privacy@healix.com</a>
        </li>
        <li>
          <span className="privacy-contact__label">Contact page:</span>{' '}
          <a href="/" target="_blank" rel="noopener noreferrer">healix.com</a>
        </li>
        <li>
          <span className="privacy-contact__label">Address:</span>{' '}
          Healix Health, [Business address to be confirmed]
        </li>
      </ul>
    ),
  },
]

const PrivacyPage = () => {
  // Mobile-only accordion state. Default: only first section open.
  const [openIds, setOpenIds] = useState(() => new Set([SECTIONS[0].id]))

  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

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
    <main className="privacy-page">
      <div className="privacy-page__inner">
        <nav className="privacy-page__breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-current="page">Privacy Policy</li>
          </ol>
        </nav>

        <header className="privacy-page__header">
          <span className="privacy-page__eyebrow">Legal</span>
          <h1 className="privacy-page__title">Privacy Policy</h1>
          <p className="privacy-page__subtitle">
            Learn how Healix collects, uses, protects, and manages your
            personal and health-related information.
          </p>
          <p className="privacy-page__meta">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="privacy-page__layout">
          <aside className="privacy-sidebar" aria-label="Section navigation">
            <p className="privacy-sidebar__label">On this page</p>
            <ul className="privacy-sidebar__list">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="privacy-sidebar__link">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="privacy-page__content">
            {SECTIONS.map((section, idx) => {
              const isOpen = openIds.has(section.id)
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={`privacy-section${isOpen ? ' is-open' : ''}`}
                  aria-labelledby={`${section.id}-heading`}
                >
                  <h2 className="privacy-section__heading" id={`${section.id}-heading`}>
                    <button
                      type="button"
                      className="privacy-section__toggle"
                      aria-expanded={isOpen}
                      aria-controls={`${section.id}-body`}
                      onClick={() => toggle(section.id)}
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2.2}
                        className="privacy-section__chev"
                        aria-hidden="true"
                      />
                    </button>
                  </h2>

                  <div
                    id={`${section.id}-body`}
                    className="privacy-section__body"
                    role="region"
                    aria-labelledby={`${section.id}-heading`}
                  >
                    {section.body()}
                  </div>

                  {idx < SECTIONS.length - 1 && (
                    <hr className="privacy-section__divider" aria-hidden="true" />
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

export default PrivacyPage
