import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ShieldCheck, ShieldAlert } from 'lucide-react'
import './ConsumerHealthDataPage.scss'

const PAGE_TITLE = 'Healix Consumer Health Data Privacy Policy'
const PAGE_DESCRIPTION =
  'Learn how Healix collects, protects, uses, and manages consumer health data related to telehealth, laboratory testing, memberships, wellness programs, and healthcare services.'
const LAST_UPDATED = '18 May 2026'

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: () => (
      <>
        <p>
          Healix is committed to safeguarding consumer health privacy. This
          Consumer Health Data Privacy Policy describes how we collect,
          protect, manage, and use health-related information across our
          Services.
        </p>
        <p>This Policy applies to information collected through:</p>
        <ul>
          <li>Weight loss services and programs</li>
          <li>Sexual health treatment and consultations</li>
          <li>Laboratory testing and diagnostics</li>
          <li>Telehealth consultations and care management</li>
        </ul>
      </>
    ),
  },
  {
    id: 'scope',
    title: '2. Scope of This Policy',
    body: () => (
      <>
        <p>This Policy applies to:</p>
        <ul>
          <li>Visitors browsing the Healix website</li>
          <li>Registered users with a Healix account</li>
          <li>Patients receiving telehealth services</li>
          <li>Users of Healix laboratory testing</li>
          <li>Membership and subscription holders</li>
          <li>Wellness program participants</li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-we-collect',
    title: '3. Consumer Health Data We Collect',
    body: () => (
      <>
        <p>
          We collect health-related and supporting information across four
          broad categories.
        </p>

        <h3 className="chd-subheading">A. Personal Information</h3>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Mailing address</li>
          <li>Date of birth</li>
        </ul>

        <h3 className="chd-subheading">B. Health &amp; Wellness Information</h3>
        <ul>
          <li>Reported symptoms and current concerns</li>
          <li>Medical history and conditions</li>
          <li>Consultation details and treatment notes</li>
          <li>Treatment preferences and care goals</li>
          <li>Weight loss program information</li>
          <li>Sexual health information</li>
          <li>Wellness assessments and questionnaires</li>
        </ul>

        <h3 className="chd-subheading">C. Laboratory Information</h3>
        <ul>
          <li>Test requests and order history</li>
          <li>Laboratory results</li>
          <li>Screening reports</li>
          <li>Diagnostic information shared by your provider</li>
        </ul>

        <h3 className="chd-subheading">D. Technical &amp; Device Data</h3>
        <ul>
          <li>IP address and approximate location</li>
          <li>Device and browser information</li>
          <li>Cookies and similar identifiers</li>
          <li>Usage analytics and engagement data</li>
          <li>Session tracking for security and continuity</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-collect',
    title: '4. How We Collect Consumer Health Data',
    body: () => (
      <ul>
        <li>Online forms, assessments, and intake questionnaires</li>
        <li>Telehealth consultations with our providers</li>
        <li>Membership and subscription registration</li>
        <li>Laboratory test submissions and results processing</li>
        <li>Website interactions and account activity</li>
        <li>Customer support conversations</li>
      </ul>
    ),
  },
  {
    id: 'how-we-use',
    title: '5. How We Use Consumer Health Data',
    body: () => (
      <ul>
        <li>Providing and personalising healthcare services</li>
        <li>Conducting telehealth consultations and follow-ups</li>
        <li>Generating treatment recommendations</li>
        <li>Processing and reporting laboratory results</li>
        <li>Supporting users through our care and support teams</li>
        <li>Improving the user experience and Service quality</li>
        <li>Preventing fraud, abuse, and unauthorised access</li>
        <li>Complying with legal and regulatory obligations</li>
        <li>Maintaining security and integrity of the platform</li>
      </ul>
    ),
  },
  {
    id: 'sharing',
    title: '6. Sharing of Consumer Health Data',
    body: () => (
      <>
        <p>We may share consumer health data with:</p>
        <ul>
          <li>Licensed healthcare providers delivering your care</li>
          <li>Accredited laboratory partners processing your tests</li>
          <li>Payment processors handling transactions</li>
          <li>Technology providers operating our infrastructure</li>
          <li>Legal or regulatory authorities when required by law</li>
        </ul>
        <div className="chd-callout chd-callout--info" role="note">
          <ShieldCheck size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>Healix does not sell consumer health data.</strong>{' '}
            Sharing occurs only to deliver Services, support clinical care, or
            comply with applicable law.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'security',
    title: '7. Consumer Health Data Security',
    body: () => (
      <>
        <ul>
          <li>Encryption for data in transit and at rest where applicable</li>
          <li>Secure servers and segmented network environments</li>
          <li>Role-based access restrictions on a need-to-know basis</li>
          <li>Continuous security monitoring and routine audits</li>
          <li>Industry-standard safeguards aligned with healthcare best practices</li>
        </ul>
        <div className="chd-callout chd-callout--info" role="note">
          <ShieldAlert size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>Healix uses commercially reasonable safeguards to protect sensitive consumer health information.</strong>{' '}
            No security measure is perfect, but we continually invest in
            improving our protections.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'rights',
    title: '8. Consumer Rights & Choices',
    body: () => (
      <>
        <p>Subject to applicable law, you may:</p>
        <ul>
          <li>Access the consumer health data we hold about you</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your data, subject to retention requirements</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Request copies of your healthcare records</li>
          <li>Opt out of non-essential marketing communications</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '9. Cookies & Tracking Technologies',
    body: () => (
      <>
        <ul>
          <li>Cookies that maintain sessions and remember preferences</li>
          <li>Analytics tools that help us understand Service usage</li>
          <li>Session tracking for security and continuity</li>
          <li>Storage of user preferences and settings</li>
        </ul>
        <p>
          You can disable or restrict cookies through your browser settings.
          Some features may not work as expected if cookies are disabled.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: '10. Data Retention',
    body: () => (
      <ul>
        <li>We retain consumer health data only as long as necessary to deliver Services and operate our business.</li>
        <li>Certain healthcare and legal retention obligations may require us to keep records for extended periods.</li>
      </ul>
    ),
  },
  {
    id: 'third-party',
    title: '11. Third-Party Services',
    body: () => (
      <ul>
        <li>External laboratory partners</li>
        <li>Payment gateways and financial processors</li>
        <li>Analytics and product-measurement providers</li>
        <li>Telehealth communication tools</li>
        <li>Hosting and infrastructure providers</li>
      </ul>
    ),
  },
  {
    id: 'children',
    title: '12. Children’s Privacy',
    body: () => (
      <p>
        The Services are intended for adults aged 18 and older. We do not
        knowingly collect consumer health data from individuals under 18.
        If you believe a minor has provided us information, please contact
        us so we can remove it.
      </p>
    ),
  },
  {
    id: 'cross-border',
    title: '13. Cross-Border Data Transfers',
    body: () => (
      <p>
        Depending on our infrastructure and partner network, your data may be
        processed in regions different from where it was collected. Where
        applicable, we use appropriate safeguards to protect international
        transfers consistent with applicable law.
      </p>
    ),
  },
  {
    id: 'sensitive',
    title: '14. Sensitive Health Information',
    body: () => (
      <>
        <p>The following categories warrant additional care:</p>
        <ul>
          <li>Sexual health information</li>
          <li>Weight loss treatment data</li>
          <li>Laboratory and screening data</li>
          <li>Medical evaluations and clinical notes</li>
        </ul>
        <div className="chd-callout chd-callout--info" role="note">
          <ShieldCheck size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>These categories of information are handled with additional care and confidentiality.</strong>
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'consent',
    title: '15. Consumer Consent',
    body: () => (
      <p>
        By using Healix Services, you consent to the collection, use, and
        sharing of consumer health data as described in this Policy. You may
        withdraw consent at any time, though doing so may make certain
        Services unavailable to you.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '16. Changes to This Policy',
    body: () => (
      <p>
        Healix may update this Policy from time to time to reflect changes in
        our Services, business, or applicable law. Material changes will be
        communicated through the website or via email. Please review this
        page periodically.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '17. Contact Information',
    body: () => (
      <ul className="chd-contact">
        <li>
          <span className="chd-contact__label">Email:</span>{' '}
          <a href="mailto:privacy@healix.com">privacy@healix.com</a>
        </li>
        <li>
          <span className="chd-contact__label">Contact page:</span>{' '}
          <a href="/" target="_blank" rel="noopener noreferrer">healix.com</a>
        </li>
        <li>
          <span className="chd-contact__label">Address:</span>{' '}
          Healix Health, [Business address to be confirmed]
        </li>
      </ul>
    ),
  },
]

const ConsumerHealthDataPage = () => {
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
    <main className="chd-page">
      <div className="chd-page__inner">
        <nav className="chd-page__breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-current="page">Consumer Health Data Privacy Policy</li>
          </ol>
        </nav>

        <header className="chd-page__header">
          <span className="chd-page__eyebrow">Legal</span>
          <h1 className="chd-page__title">Consumer Health Data Privacy Policy</h1>
          <p className="chd-page__subtitle">
            Learn how Healix collects, protects, manages, and uses sensitive
            consumer health data across telehealth, laboratory, wellness, and
            treatment services.
          </p>
          <p className="chd-page__meta">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="chd-page__layout">
          <aside className="chd-sidebar" aria-label="Section navigation">
            <p className="chd-sidebar__label">On this page</p>
            <ul className="chd-sidebar__list">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="chd-sidebar__link">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="chd-page__content">
            {SECTIONS.map((section, idx) => {
              const isOpen = openIds.has(section.id)
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={`chd-section${isOpen ? ' is-open' : ''}`}
                  aria-labelledby={`${section.id}-heading`}
                >
                  <h2 className="chd-section__heading" id={`${section.id}-heading`}>
                    <button
                      type="button"
                      className="chd-section__toggle"
                      aria-expanded={isOpen}
                      aria-controls={`${section.id}-body`}
                      onClick={() => toggle(section.id)}
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2.2}
                        className="chd-section__chev"
                        aria-hidden="true"
                      />
                    </button>
                  </h2>

                  <div
                    id={`${section.id}-body`}
                    className="chd-section__body"
                    role="region"
                    aria-labelledby={`${section.id}-heading`}
                  >
                    {section.body()}
                  </div>

                  {idx < SECTIONS.length - 1 && (
                    <hr className="chd-section__divider" aria-hidden="true" />
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

export default ConsumerHealthDataPage
