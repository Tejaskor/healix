import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, AlertTriangle, AlertOctagon, ShieldCheck, CheckCircle2 } from 'lucide-react'
import './TelehealthConsentPage.scss'

const PAGE_TITLE = 'Healix Telehealth Consent & Open Payments'
const PAGE_DESCRIPTION =
  'Review Healix Telehealth Consent & Open Payments policies covering virtual healthcare services, patient responsibilities, privacy protections, prescriptions, laboratory testing, and healthcare transparency.'
const LAST_UPDATED = '18 May 2026'

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: () => (
      <>
        <p>
          Healix delivers healthcare services using telehealth technologies.
          These services may include video consultations, secure messaging,
          digital assessments, and online treatment programs.
        </p>
        <p>
          Before using any telehealth service, please review this Telehealth
          Consent &amp; Open Payments document carefully. By proceeding you
          confirm that you have read, understood, and agreed to its terms.
        </p>
      </>
    ),
  },
  {
    id: 'what-is-telehealth',
    title: '2. What Is Telehealth?',
    body: () => (
      <>
        <p>
          Telehealth is the delivery of healthcare services through digital
          technology rather than in-person visits. With Healix this can include:
        </p>
        <ul>
          <li>Virtual healthcare consultations with licensed providers.</li>
          <li>Remote communication and follow-ups via messaging or voice.</li>
          <li>Online assessments and questionnaires.</li>
          <li>Digital healthcare support and care plan management.</li>
        </ul>
        <p>Telehealth interactions may take place over video calls, secure messaging, or in-app treatment tools.</p>
      </>
    ),
  },
  {
    id: 'consent',
    title: '3. Consent to Receive Telehealth Services',
    body: () => (
      <>
        <p>By consenting to telehealth services, you understand and agree that:</p>
        <ul>
          <li>Healthcare services may be delivered remotely instead of in person.</li>
          <li>Technology is used to facilitate communication with your provider.</li>
          <li>In-person care may still be necessary for certain conditions.</li>
          <li>Providers may decline inappropriate or unsafe treatment requests.</li>
        </ul>
        <div className="tc-callout tc-callout--info" role="note">
          <CheckCircle2 size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>I voluntarily consent</strong> to receive healthcare services
            from Healix providers through telehealth technologies, and I
            understand I may withdraw consent at any time.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'risks',
    title: '4. Risks of Telehealth',
    body: () => (
      <>
        <ul>
          <li>Technical interruptions or platform downtime.</li>
          <li>Internet connectivity issues affecting consultations.</li>
          <li>Delayed or missed communication.</li>
          <li>Limited ability to perform a physical examination.</li>
          <li>Risks inherent to electronic communication.</li>
        </ul>
        <div className="tc-callout tc-callout--warn" role="note">
          <AlertTriangle size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>Telehealth services may have limitations compared to in-person medical evaluations.</strong>{' '}
            Your provider will direct you to in-person care if your situation requires it.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'benefits',
    title: '5. Benefits of Telehealth',
    body: () => (
      <ul>
        <li>Convenient access to providers from home.</li>
        <li>Faster scheduling and shorter wait times.</li>
        <li>Care available regardless of location.</li>
        <li>Reduced need to travel for follow-ups.</li>
        <li>Continuous monitoring and ongoing care management.</li>
      </ul>
    ),
  },
  {
    id: 'emergency',
    title: '6. Emergency Situations',
    body: () => (
      <>
        <div className="tc-callout tc-callout--alert" role="alert">
          <AlertOctagon size={22} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>Healix does not provide emergency medical services.</strong>{' '}
            If you are experiencing a medical emergency, contact your local
            emergency services or visit the nearest emergency department
            immediately.
          </p>
        </div>
        <ul>
          <li>Telehealth is not designed for time-critical or life-threatening situations.</li>
          <li>Always seek immediate in-person emergency care when necessary.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'patient-responsibilities',
    title: '7. Patient Responsibilities',
    body: () => (
      <ul>
        <li>Provide accurate, complete, and up-to-date medical information.</li>
        <li>Use a secure internet connection and trusted device for consultations.</li>
        <li>Attend scheduled appointments on time.</li>
        <li>Follow your provider&rsquo;s instructions and treatment plan.</li>
        <li>Maintain confidentiality of your account credentials.</li>
      </ul>
    ),
  },
  {
    id: 'privacy',
    title: '8. Privacy & Confidentiality',
    body: () => (
      <>
        <ul>
          <li>Telehealth consultations are conducted using protected channels.</li>
          <li>Your health information is stored and transmitted with appropriate safeguards.</li>
          <li>Healix follows industry-standard privacy and security practices.</li>
        </ul>
        <div className="tc-callout tc-callout--info" role="note">
          <ShieldCheck size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            For complete details on data collection, use, and sharing, please
            review our <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'electronic-communication',
    title: '9. Electronic Communication Consent',
    body: () => (
      <>
        <p>By using Healix, you consent to receive:</p>
        <ul>
          <li>Email communication related to your care, account, and Services.</li>
          <li>SMS notifications and text-based updates.</li>
          <li>Appointment reminders and rescheduling alerts.</li>
          <li>Digital healthcare communication from your care team.</li>
        </ul>
        <p>
          While we take measures to protect electronic communication, no method
          of transmission is fully secure. Please avoid sharing sensitive
          information through unprotected channels.
        </p>
      </>
    ),
  },
  {
    id: 'recording',
    title: '10. Recording & Documentation',
    body: () => (
      <ul>
        <li>Telehealth consultations may be documented as part of your medical record.</li>
        <li>If a session is recorded, you will be informed in accordance with applicable laws.</li>
        <li>Healthcare notes and records are retained securely and used to support continuity of care.</li>
      </ul>
    ),
  },
  {
    id: 'prescription',
    title: '11. Prescription Policy',
    body: () => (
      <ul>
        <li>Prescriptions are issued based on your provider&rsquo;s clinical evaluation.</li>
        <li>Certain medications may require additional review, lab work, or follow-up.</li>
        <li>Providers may decline to prescribe when medically inappropriate or unsafe.</li>
      </ul>
    ),
  },
  {
    id: 'lab-testing',
    title: '12. Laboratory Testing Consent',
    body: () => (
      <ul>
        <li>By using lab services, you consent to the collection and processing of samples.</li>
        <li>Tests may be processed by accredited third-party laboratory partners.</li>
        <li>Results are reviewed by a qualified provider before being shared with you.</li>
      </ul>
    ),
  },
  {
    id: 'program-consent',
    title: '13. Weightloss & Sexual Health Program Consent',
    body: () => (
      <ul>
        <li>Individual results vary; no specific outcome is guaranteed.</li>
        <li>Eligibility depends on clinical evaluation by your provider.</li>
        <li>Some prescribed medications may carry side effects &mdash; review instructions carefully.</li>
        <li>Follow-up care, monitoring, or lab work may be required.</li>
      </ul>
    ),
  },
  {
    id: 'open-payments',
    title: '14. Open Payments Disclosure',
    body: () => (
      <>
        <p>
          Healix supports healthcare transparency. Under certain regulations
          (such as the U.S. Open Payments / Sunshine Act), pharmaceutical and
          medical device companies are required to disclose financial
          relationships with healthcare providers.
        </p>
        <ul>
          <li>Some providers may have financial or research relationships with pharmaceutical or device companies.</li>
          <li>Where required by law, those relationships are reported publicly to the appropriate regulatory body.</li>
          <li>You can request additional information about any such disclosures from your provider.</li>
        </ul>
        <div className="tc-callout tc-callout--info" role="note">
          <CheckCircle2 size={20} strokeWidth={2.2} aria-hidden="true" />
          <p>
            <strong>Healix supports transparency and ethical healthcare practices.</strong>
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'withdraw',
    title: '15. Withdrawal of Consent',
    body: () => (
      <ul>
        <li>You may withdraw your telehealth consent at any time by notifying Healix or your provider.</li>
        <li>Withdrawing consent may make certain Services temporarily or permanently unavailable to you.</li>
        <li>Withdrawal will not affect care already provided before the date of withdrawal.</li>
      </ul>
    ),
  },
  {
    id: 'liability',
    title: '16. Limitation of Liability',
    body: () => (
      <ul>
        <li>Technical failures, outages, or transmission errors may occur.</li>
        <li>Healix does not guarantee uninterrupted or error-free telehealth Services.</li>
        <li>You acknowledge the inherent limitations of telehealth services compared to in-person care.</li>
      </ul>
    ),
  },
  {
    id: 'changes',
    title: '17. Changes to This Policy',
    body: () => (
      <p>
        Healix may update this Telehealth Consent &amp; Open Payments
        document from time to time. Material changes will be communicated
        through the website or via email. Please review this page periodically
        to stay informed.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '18. Contact Information',
    body: () => (
      <ul className="tc-contact">
        <li>
          <span className="tc-contact__label">Email:</span>{' '}
          <a href="mailto:support@healix.com">support@healix.com</a>
        </li>
        <li>
          <span className="tc-contact__label">Contact page:</span>{' '}
          <a href="/" target="_blank" rel="noopener noreferrer">healix.com</a>
        </li>
        <li>
          <span className="tc-contact__label">Address:</span>{' '}
          Healix Health, [Business address to be confirmed]
        </li>
      </ul>
    ),
  },
]

const TelehealthConsentPage = () => {
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
    <main className="tc-page">
      <div className="tc-page__inner">
        <nav className="tc-page__breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-current="page">Telehealth Consent &amp; Open Payments</li>
          </ol>
        </nav>

        <header className="tc-page__header">
          <span className="tc-page__eyebrow">Legal</span>
          <h1 className="tc-page__title">Telehealth Consent &amp; Open Payments</h1>
          <p className="tc-page__subtitle">
            Understand your rights, responsibilities, privacy protections, and
            consent requirements when using Healix telehealth services.
          </p>
          <p className="tc-page__meta">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="tc-page__layout">
          <aside className="tc-sidebar" aria-label="Section navigation">
            <p className="tc-sidebar__label">On this page</p>
            <ul className="tc-sidebar__list">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="tc-sidebar__link">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="tc-page__content">
            {SECTIONS.map((section, idx) => {
              const isOpen = openIds.has(section.id)
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={`tc-section${isOpen ? ' is-open' : ''}`}
                  aria-labelledby={`${section.id}-heading`}
                >
                  <h2 className="tc-section__heading" id={`${section.id}-heading`}>
                    <button
                      type="button"
                      className="tc-section__toggle"
                      aria-expanded={isOpen}
                      aria-controls={`${section.id}-body`}
                      onClick={() => toggle(section.id)}
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2.2}
                        className="tc-section__chev"
                        aria-hidden="true"
                      />
                    </button>
                  </h2>

                  <div
                    id={`${section.id}-body`}
                    className="tc-section__body"
                    role="region"
                    aria-labelledby={`${section.id}-heading`}
                  >
                    {section.body()}
                  </div>

                  {idx < SECTIONS.length - 1 && (
                    <hr className="tc-section__divider" aria-hidden="true" />
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

export default TelehealthConsentPage
