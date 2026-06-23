import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import './ErectileDysfunctionPage.scss'
import './EarlyClimaxPage.scss'

const peFaqs = [
  {
    q: 'What is premature ejaculation?',
    body: (
      <p>
        PE happens when you finish sooner than you or your partner would like. It can occur occasionally or more frequently, and it&rsquo;s very common.
      </p>
    ),
  },
  {
    q: 'Why is a prescription needed?',
    body: (
      <p>
        Some treatments require a provider to review your health and symptoms to make sure they&rsquo;re safe and right for you. This can be done fully online.
      </p>
    ),
  },
  {
    q: 'Who prescribes the treatment?',
    body: (
      <p>
        A licensed medical provider reviews your assessment and, if appropriate, prescribes your treatment.
      </p>
    ),
  },
  {
    q: 'What’s included in my treatment?',
    body: (
      <ul>
        <li>Treatment options (if prescribed)</li>
        <li>Online provider assessment</li>
        <li>Ongoing support and check-ins</li>
        <li>Easy app-based management</li>
        <li>Discreet delivery</li>
      </ul>
    ),
  },
  {
    q: 'What if it doesn’t work for me?',
    body: (
      <p>
        If you&rsquo;re not seeing results, your provider can adjust your plan, recommend alternatives, or suggest additional steps to help improve outcomes.
      </p>
    ),
  },
  {
    q: 'Do I need insurance?',
    body: (
      <p>No, insurance isn&rsquo;t required to get started.</p>
    ),
  },
]

const EarlyClimaxPage = () => {
  const [openPeFaq, setOpenPeFaq] = useState(0)
  const [labsOpen, setLabsOpen] = useState(false)
  const [labsFrom, setLabsFrom] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      setLabsFrom((e && e.detail && e.detail.from) || null)
      setLabsOpen(true)
    }
    window.addEventListener('open-labs-offcanvas', handler)
    return () => window.removeEventListener('open-labs-offcanvas', handler)
  }, [])

  return (
    <div className="ec-page">
      <Navbar />

      <main className="ec-page__main">
        {/* Hero — text left, video right */}
        <section className="ec-hero" aria-label="Early Climax hero">
          <div className="ec-hero__inner">
            {/* Video — appears first on mobile, right column on desktop */}
            <div className="ec-hero__media">
              <video
                className="ec-hero__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/h-PE-ATF-D.webp"
              >
                <source src="/images/h-PE-ATF-D.webm" type="video/webm" />
                {/* MP4 fallback disabled — webm only.
                    Re-enable for older browsers:
                    <source src="/images/h-PE-ATF-D.mp4" type="video/mp4" /> */}
              </video>
            </div>

            {/* Text content */}
            <div className="ec-hero__content">
              <h1 className="ec-hero__heading">
                Take control and last longer{' '}
                <br className="ec-hero__heading-break" />
                <span className="ec-hero__accent">on your terms</span>
              </h1>

              <ul className="ec-hero__features">
                {[
                  { text: 'Trusted treatments designed to help you last longer', icon: '/images/h-PE-ATF-Bullet-01.webp' },
                  { text: 'Prescription and non-prescription options available', icon: '/images/h-PE-ATF-Bullet-02.webp' },
                  { text: '100% online, private and discreet', icon: '/images/h-PE-ATF-Bullet-03.webp' },
                ].map((item) => (
                  <li key={item.text} className="ec-hero__feature">
                    <span className="ec-hero__feature-icon" aria-hidden="true">
                      <img src={item.icon} alt="" className="ec-hero__feature-img" loading="lazy"  decoding="async"/>
                    </span>
                    <span className="ec-hero__feature-text">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="ec-hero__actions">
                <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="ed-hero__btn ed-hero__btn--outline ec-hero__btn--outline" aria-disabled="true">View treatment options</button>
              </div>

              <p className="ec-hero__disclaimer">
                Prescription may be required. Not suitable for everyone. Results may vary.
              </p>
            </div>
          </div>
        </section>
        {/* Doctor-trusted premature ejaculation treatment — products showcase */}
        <section className="ed-products ed-products--daily ed-products--pe" aria-label="Doctor-trusted premature ejaculation treatment">
          <div className="ed-products__inner">
            <header className="ed-products__header">
              <h2 className="ed-products__heading">
                Trusted treatment for better
                <br className="ec-pe__heading-break" />
                {' '}control and longer performance
              </h2>
              <div className="ed-products__side">
                <p className="ed-products__tagline">
                  Providers may recommend proven treatment options to help improve control, delay climax, and boost confidence—based on your needs.
                </p>
              </div>
            </header>
          </div>

          <div className="ed-products__track-wrap">
            <div className="ed-products__track">
              {[
                {
                  img: '/images/h-PE-Product-SexRx_Climax-D.webp',
                  title: 'Performance + Climax Control',
                  price: 'From $39/month',
                  desc: 'Daily support designed to improve control and help you last longer.',
                  btn: 'Get started',
                },
                {
                  img: '/images/h-PE-Product-Sid-D.webp',
                  title: 'Sildenafil',
                  price: 'From $4/use',
                  desc: 'On-demand support to improve performance and help you last longer.',
                  btn: 'Get started',
                },
                {
                  img: '/images/h-PE-Product-Tad-D.webp',
                  title: 'Tadalafil',
                  price: 'From $6/use',
                  desc: 'Longer-lasting support for more flexibility and better control.',
                  btn: 'Get started',
                },
                {
                  img: '/images/h-PE-Product-clockstopper-D.webp',
                  title: 'Climax Delay Wipes',
                  price: 'From $19/use',
                  desc: 'Fast-acting wipes designed to help delay climax and extend performance.',
                  btn: 'Buy now',
                },
              ].map((p) => (
                <article key={p.title} className="ed-products__card">
                  <div className="ed-products__card-media">
                    <img src={p.img} alt="" className="ed-products__card-img" loading="lazy"  decoding="async"/>
                  </div>
                  <h3 className="ed-products__card-title">{p.title}</h3>
                  <p className="ed-products__card-price">{p.price}</p>
                  <p className="ed-products__card-desc">{p.desc}</p>
                  <button type="button" className="ed-products__card-btn" aria-disabled="true">{p.btn}</button>
                </article>
              ))}
            </div>
          </div>

          <div className="ed-products__inner">
            <p className="ed-products__fineprint">
              Prescription may be required. Not suitable for everyone. Results may vary based on individual response.
            </p>
          </div>
        </section>
        {/* You and your partner — 3-card horizontal scroll */}
        <section className="ec-couple" aria-label="You and your partner">
          <div className="ec-couple__inner">
            <header className="ec-couple__header">
              <h2 className="ec-couple__heading">
                <span className="ec-couple__muted">Better for you</span>
                <span className="ec-couple__dark">—and your partner</span>
              </h2>
              <button type="button" className="ec-couple__cta ec-couple__cta--top" aria-disabled="true">Get started today</button>
            </header>
          </div>

          <div className="ec-couple__track-wrap">
            <div className="ec-couple__track">
              {[
                {
                  titleMuted: 'More satisfaction,',
                  titleDark: 'together',
                  img: '/images/h-PE-Satisfaction-01-D.webp',
                  desc: 'Support better intimacy and confidence for a more fulfilling experience together.',
                },
                {
                  titleMuted: 'Care you',
                  titleDark: 'can trust',
                  img: '/images/h-PE-Medical-Pro-02-D.webp',
                  desc: 'Connect with licensed providers online—quick, private, and judgment-free.',
                },
                {
                  titleMuted: 'Proven treatment',
                  titleDark: 'options',
                  img: '/images/h-PE-Doctor-Trusted-03-D.webp',
                  desc: 'Access clinically backed treatments, prescribed when appropriate for you.',
                },
              ].map((c) => (
                <article key={c.titleDark} className="ec-couple__card">
                  <h3 className="ec-couple__card-title">
                    <span className="ec-couple__muted">{c.titleMuted}</span>
                    <br className="ec-couple__card-title-break" />
                    {' '}<span className="ec-couple__dark">{c.titleDark}</span>
                  </h3>
                  <div
                    className="ec-couple__card-media"
                    role="img"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${c.img})` }}
                  />
                  <p className="ec-couple__card-desc">{c.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="ec-couple__inner ec-couple__footer">
            <button type="button" className="ec-couple__cta ec-couple__cta--bottom" aria-disabled="true">Get started today</button>
          </div>
        </section>
        {/* Up your knowledge on PE treatment — blog cards */}
        <section className="ec-blog" aria-label="Up your knowledge on PE treatment">
          <div className="ec-blog__inner">
            <h2 className="ec-blog__heading">
              <span className="ec-blog__dark">Understand PE</span>
              <br />
              <span className="ec-blog__muted">treatment</span>
            </h2>
          </div>

          <div className="ec-blog__track-wrap">
            <div className="ec-blog__track">
              {[
                {
                  img: '/images/h-Sex-Blog-02-D.webp',
                  title: 'What is premature ejaculation?',
                  desc: 'Learn what PE is, why it happens, and how it can be treated.',
                },
                {
                  img: '/images/h-PE-Blog-02-D.webp',
                  title: 'How do PE treatments work?',
                  desc: 'Explore how medications and treatments help improve control and performance.',
                },
              ].map((p) => (
                <article key={p.title} className="ec-blog__card">
                  <div className="ec-blog__card-media">
                    <img src={p.img} alt="" className="ec-blog__card-img" loading="lazy"  decoding="async"/>
                  </div>
                  <h3 className="ec-blog__card-title">{p.title}</h3>
                  <p className="ec-blog__card-desc">{p.desc}</p>
                  <button type="button" className="ec-blog__card-btn" aria-disabled="true">Learn more</button>
                </article>
              ))}
            </div>
          </div>
        </section>
        {/* How to get medicine for premature ejaculation */}
        <section className="ec-howto" aria-label="How to get medicine for premature ejaculation">
          <div className="ec-howto__inner">
            <div className="ec-howto__media">
              <img
                src="/images/HardMints-How-to-Get-M.webp"
                alt=""
                className="ec-howto__img"
                loading="lazy"
               decoding="async"/>
            </div>

            <div className="ec-howto__content">
              <h2 className="ec-howto__heading">
                <span className="ec-howto__dark">
                  How to get premature
                  <br className="ec-howto__heading-break" />
                  {' '}ejaculation treatment
                </span>
              </h2>

              <ul className="ec-howto__steps">
                {[
                  { title: 'Quick online intake', desc: 'Answer a few questions about your health and symptoms.' },
                  { title: 'Connect with a provider', desc: 'A licensed provider reviews your info and recommends the right option.' },
                  { title: 'Discreet delivery', desc: 'If prescribed, your treatment ships directly to your door.' },
                ].map((s) => (
                  <li key={s.title} className="ec-howto__step">
                    <span className="ec-howto__step-icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    <div className="ec-howto__step-body">
                      <h3 className="ec-howto__step-title">{s.title}</h3>
                      <p className="ec-howto__step-desc">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <button type="button" className="ec-howto__cta" aria-disabled="true">Get started today</button>
            </div>
          </div>
        </section>
        {/* Got PE questions? We've got answers. */}
        <section className="ec-faq" aria-label="PE FAQs">
          <div className="ec-faq__inner">
            <div className="ec-faq__left">
              <h2 className="ec-faq__heading">
                Have questions about PE?{' '}
                <br className="ec-faq__heading-break" />
                We&rsquo;ve got you covered.
              </h2>
            </div>

            <ul className="ec-faq__list">
              {peFaqs.map((f, idx) => {
                const isOpen = openPeFaq === idx
                return (
                  <li key={f.q} className={`ec-faq__item ${isOpen ? 'ec-faq__item--open' : ''}`}>
                    <button
                      type="button"
                      className="ec-faq__question"
                      aria-expanded={isOpen}
                      onClick={() => setOpenPeFaq(isOpen ? -1 : idx)}
                    >
                      <span>{f.q}</span>
                      <svg className="ec-faq__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="ec-faq__answer">
                      <div className="ec-faq__answer-inner">{f.body}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
        {/* PE medication made simple — banner */}
        <section className="ec-banner" aria-label="PE medication made simple">
          <div className="ec-banner__wrapper">
            <picture className="ec-banner__picture">
              <source media="(max-width: 741.98px)" srcSet="/images/h-PE-SoftFooter-M.webp" />
              <img
                src="/images/h-PE-SoftFooter-D.webp"
                alt=""
                className="ec-banner__bg"
                loading="lazy"
               decoding="async"/>
            </picture>
            <div className="ec-banner__content">
              <h2 className="ec-banner__heading">
                <span className="ec-banner__dark">Simple treatment for</span>
                <br />
                <span className="ec-banner__muted">better control</span>
              </h2>

              <ul className="ec-banner__list">
                {[
                  'Trusted, proven ingredients',
                  'Personalized treatment options',
                  'No in-person visits needed',
                ].map((text) => (
                  <li key={text} className="ec-banner__item">
                    <span className="ec-banner__check" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <button type="button" className="ec-banner__cta" aria-disabled="true">Get started</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <LabsOffcanvas
        isOpen={labsOpen}
        onClose={() => setLabsOpen(false)}
        from={labsFrom}
      />
    </div>
  )
}

export default EarlyClimaxPage
