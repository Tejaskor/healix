import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SitemapPage.scss'

// Single source of truth for the sitemap structure. Top-level groups with
// `to` get a clickable heading; groups without (e.g. Sexual Health, which
// has no landing page) render as plain headings.
const SITEMAP = [
  {
    label: 'Weight Loss',
    to: '/weight-loss',
    items: [
      { label: 'Treatment', to: '/weight-loss' },
      { label: 'Membership', to: '/membership' },
      { label: 'The Science', to: '/science' },
      { label: 'FAQ', to: '/faqs' },
    ],
  },
  {
    label: 'Labs',
    to: '/labs',
    items: [
      { label: 'Health Check', to: '/labs' },
      { label: 'What We Test', to: '/labs/what-we-test' },
      { label: 'How It Works', to: '/labs/how-it-works' },
      { label: 'Action Plan', to: '/labs/action-plan' },
      { label: 'Cancer Screening', to: '/labs/cancer-screening' },
    ],
  },
  {
    label: 'Sexual Health',
    // No dedicated /sexual-health landing exists, so the parent heading
    // routes to the first child page (Erectile Dysfunction).
    to: '/sexual-health/erectile-dysfunction',
    items: [
      { label: 'Erectile Dysfunction', to: '/sexual-health/erectile-dysfunction' },
      { label: 'Early Climax', to: '/sexual-health/early-climax' },
      { label: 'Hard Mints', to: '/sexual-health/hard-mints' },
    ],
  },
  {
    label: 'Legal Pages',
    wide: true, // spans full row on desktop; items laid out horizontally
    // No dedicated legal landing, so the parent heading routes to
    // Terms & Conditions (the first legal page).
    to: '/terms-and-conditions',
    items: [
      { label: 'Terms & Conditions', to: '/terms-and-conditions' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Telehealth Consent & Open Payments', to: '/telehealth-consent' },
      { label: 'Consumer Health Data Privacy Policy', to: '/consumer-health-data-policy' },
    ],
  },
]

const PAGE_TITLE = 'Healix Sitemap'
const PAGE_DESCRIPTION =
  'Explore all Healix pages including Weightloss, Labs, Sexual Health, Treatments, Memberships, FAQs, and more.'

const slug = (s) => s.replace(/\s+/g, '-').toLowerCase()

const SitemapPage = () => {
  // No react-helmet in the project — set title + description directly and
  // restore on unmount so navigating away doesn't leak the sitemap meta.
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
    <main className="sitemap-page">
      <div className="sitemap-page__inner">
        <nav className="sitemap-page__breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-current="page">Sitemap</li>
          </ol>
        </nav>

        <header className="sitemap-page__header">
          <h1 className="sitemap-page__title">Sitemap</h1>
          <p className="sitemap-page__subtitle">
            A complete map of everything on Healix &mdash; care plans, lab tests,
            sexual-health treatments and account tools.
          </p>
        </header>

        <div className="sitemap-page__grid">
          {SITEMAP.map((group) => {
            const headingId = `sitemap-${slug(group.label)}`
            return (
              <section
                key={group.label}
                className={`sitemap-group${group.wide ? ' sitemap-group--full' : ''}`}
                aria-labelledby={headingId}
              >
                {group.to ? (
                  <Link to={group.to} className="sitemap-group__heading-link">
                    <h2 id={headingId} className="sitemap-group__heading">
                      {group.label}
                    </h2>
                  </Link>
                ) : (
                  <h2 id={headingId} className="sitemap-group__heading">
                    {group.label}
                  </h2>
                )}

                <ul className="sitemap-group__list">
                  {group.items.map((item) => (
                    <li key={item.to + item.label} className="sitemap-group__item">
                      <Link to={item.to} className="sitemap-group__link">
                        <span className="sitemap-group__link-text">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default SitemapPage
