import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import './ErectileDysfunctionPage.scss'

const edFaqs = [
  {
    q: 'How do I know if I have ED?',
    body: (
      <>
        <p>
          ED can look different for everyone. You may be experiencing it if you:
        </p>
        <ul>
          <li>Can get an erection but can’t keep it</li>
          <li>Struggle to get an erection consistently</li>
          <li>Are unable to get an erection</li>
        </ul>
        <p>If this sounds familiar, it may be worth exploring treatment options.</p>
      </>
    ),
  },
  {
    q: 'Are ED treatments safe?',
    body: (
      <>
        <p>
          Treatments are prescribed by licensed providers and are selected based on your health profile.
        </p>
        <p>
          Most people tolerate them well when used as directed, but a provider will help determine what’s right for you.
        </p>
      </>
    ),
  },
  {
    q: 'What does ED medication feel like?',
    body: (
      <>
        <p>
          Most medications start working within 15–60 minutes.
        </p>
        <p>
          They help you get and maintain an erection when aroused. Mild side effects can occur, but your body often adjusts over time.
        </p>
      </>
    ),
  },
]

const edQuestions = [
  {
    q: 'How much does ED treatment cost?',
    body: (
      <p>Pricing starts as low as a few dollars per dose, with flexible plans to fit your needs.</p>
    ),
  },
  {
    q: 'Do I need insurance?',
    body: (
      <p>No insurance is required. You can get started without dealing with coverage or approvals.</p>
    ),
  },
  {
    q: 'What’s included in my plan?',
    body: (
      <ul>
        <li>Treatment options (if prescribed)</li>
        <li>Discreet delivery</li>
        <li>Online assessment with a provider</li>
        <li>Ongoing check-ins and support</li>
        <li>Unlimited messaging access</li>
        <li>App to manage your plan</li>
      </ul>
    ),
  },
]

const ErectileDysfunctionPage = () => {
  const [openFaq, setOpenFaq] = useState(0)
  const [openEdFaq, setOpenEdFaq] = useState(-1)
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
    <div className="ed-page">
      <Navbar />

      <main className="ed-page__main">
        <section className="ed-hero" aria-label="Erectile Dysfunction hero">
          <div className="ed-hero__inner">
            {/* Video — appears first on mobile, right column on desktop */}
            <div className="ed-hero__media">
              <video
                className="ed-hero__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/h-ED-Subcat-ATF-D.webp"
              >
                {/* h-ED-Subcat-ATF-D.webm doesn't exist in public/images yet,
                    so the video had no playable source and was frozen on the
                    poster. Until a webm sibling is exported, fall back to the
                    mp4 (~38 MB). Re-enable the webm <source> ABOVE the mp4
                    once the file lands:
                    <source src="/images/h-ED-Subcat-ATF-D.webm" type="video/webm" /> */}
                <source src="/images/h-ED-Subcat-ATF-D.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Text content */}
            <div className="ed-hero__content">
              <h1 className="ed-hero__heading">
                ED treatment,
                <br />
                <span className="ed-hero__accent">delivered to your door</span>
              </h1>

              <ul className="ed-hero__features">
                {[
                  { text: 'Trusted ingredients prescribed by providers', icon: '/images/ED-ATF-Bullet-1.webp' },
                  { text: 'No in-person visits needed', icon: '/images/ED-ATF-Bullet-2.webp' },
                  { text: 'Discreet, easy-to-use options', icon: '/images/ED-ATF-Bullet-3.webp' },
                ].map((item) => (
                  <li key={item.text} className="ed-hero__feature">
                    <span className="ed-hero__feature-icon" aria-hidden="true">
                      <img src={item.icon} alt="" className="ed-hero__feature-img" loading="lazy"  decoding="async"/>
                    </span>
                    <span className="ed-hero__feature-text">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="ed-hero__actions">
                <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="ed-hero__btn ed-hero__btn--outline" aria-disabled="true">Check eligibility</button>
              </div>

              <p className="ed-hero__disclaimer">
                Prescription required. Treatment suitability varies by individual and provider evaluation.
              </p>
            </div>
          </div>
        </section>

        {/* Product showcase — horizontal scroll (treatments__track pattern) */}
        <section className="ed-products ed-products--daily" aria-label="Sex Rx products">
          <div className="ed-products__inner">
            <header className="ed-products__header">
              <h2 className="ed-products__heading">
                Stronger erections,
                <br />
                <span className="ed-products__accent">anytime you need them</span>
              </h2>
              <div className="ed-products__side">
                <p className="ed-products__tagline">Flexible daily options designed for performance and confidence when you need it.</p>
                <div className="ed-products__actions">
                  <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                  <button type="button" className="ed-hero__btn ed-hero__btn--outline" aria-disabled="true">Check eligibility</button>
                </div>
              </div>
            </header>
          </div>

          {/* Scroll track — sibling of .ed-products__inner so it spans full section width */}
          <div className="ed-products__track-wrap">
            <div className="ed-products__track">
              {[
                {
                  img: '/images/sex-rx-hair-pill-product-16_9.webp',
                  badges: [{ text: '2-in-1', type: 'gray' }, { text: 'Rx', type: 'white' }, { text: 'daily', type: 'blue' }],
                  title: 'Performance + Hair Support',
                  price: 'Starting at $39/mo',
                  desc: 'Support performance and healthier hair growth.',
                },
                {
                  img: '/images/sex-rx-testosterone-product-16_9.webp',
                  badges: [{ text: '2-in-1', type: 'gray' }, { text: 'Rx', type: 'white' }, { text: 'daily', type: 'blue' }],
                  title: 'Performance + Testosterone Support',
                  price: 'Starting at $39/mo',
                  desc: 'Support performance and balanced energy levels.',
                },
                {
                  img: '/images/sex-rx-multivitamin-product-16_9.webp',
                  badges: [{ text: 'daily', type: 'blue' }],
                  title: 'Performance + Daily Essentials',
                  price: 'Starting at $39/mo',
                  desc: 'Support performance with added daily nutrients.',
                },
                {
                  img: '/images/hard-mints-product-16_9.webp',
                  badges: [{ text: '3-in-1', type: 'gray' }, { text: 'As-needed', type: 'blue' }],
                  title: '3-in-1 Performance Mints',
                  price: 'Starting at $30/mo',
                  desc: 'Fast-acting mint option designed for convenience.',
                },
                {
                  img: '/images/sex-rx-climax-control-product-16_9.webp',
                  badges: [{ text: 'daily', type: 'blue' }],
                  title: 'Performance + Stamina Support',
                  price: 'Starting at $39/mo',
                  desc: 'Support performance and improved endurance.',
                },
                {
                  img: '/images/sex-rx-heart-support-product-16_9.webp',
                  badges: [{ text: 'daily', type: 'blue' }],
                  title: 'Performance + Vitality Support',
                  price: 'Starting at $39/mo',
                  desc: 'Support overall wellness and daily vitality.',
                },
              ].map((p) => (
                <article key={p.title} className="ed-products__card">
                  <div className="ed-products__card-media">
                    <div className="ed-products__badges">
                      {p.badges.map((b) => (
                        <span key={b.text} className={`ed-products__badge ed-products__badge--${b.type}`}>{b.text}</span>
                      ))}
                    </div>
                    <img src={p.img} alt="" className="ed-products__card-img" loading="lazy"  decoding="async"/>
                  </div>
                  <h3 className="ed-products__card-title">{p.title}</h3>
                  <p className="ed-products__card-price">{p.price}</p>
                  <p className="ed-products__card-desc">{p.desc}</p>
                  <button type="button" className="ed-products__card-btn" aria-disabled="true">Get started</button>
                  <a href="#" className="ed-products__card-link" aria-disabled="true">Important safety information</a>
                </article>
              ))}
            </div>
          </div>

          <div className="ed-products__inner">
            <p className="ed-products__fineprint">
              Prescription may be required. Treatment suitability varies by individual and provider evaluation. Results may vary.
            </p>
          </div>
        </section>

        {/* Plan ahead with ED pills — second product showcase */}
        <section className="ed-products ed-products--before-sex" aria-label="ED pills taken before sex">
          <div className="ed-products__inner">
            <header className="ed-products__header">
              <h2 className="ed-products__heading">
                Take it before{' '}
                <span className="ed-products__accent">Perform better when it matters</span>
              </h2>
              <div className="ed-products__side">
                <p className="ed-products__tagline">Medications taken before the moment, for performance when it counts.</p>
                <div className="ed-products__actions">
                  <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                  <button type="button" className="ed-hero__btn ed-hero__btn--outline" aria-disabled="true">Check if it’s right for you</button>
                </div>
              </div>
            </header>
          </div>

          <div className="ed-products__track-wrap">
            <div className="ed-products__track">
              {[
                {
                  img: '/images/hard-mints-product-16_9.webp',
                  badges: [{ text: '3-in-1', type: 'gray' }, { text: 'As-needed', type: 'blue' }],
                  title: '3-in-1 Performance Mints',
                  price: 'Starting at $30/mo',
                  desc: 'Fast-acting mint to help you get hard quicker and last longer.',
                },
                {
                  img: '/images/sildenafil-chew-pill-product-16_9.webp',
                  badges: [{ text: 'As-needed', type: 'blue' }],
                  title: 'Sildenafil Chews',
                  price: 'Starting at $30/mo',
                  desc: 'Fast-acting chew for reliable erections when you need them.',
                },
                {
                  img: '/images/3-in-1-product-16_9.webp',
                  badges: [{ text: '3-in-1', type: 'gray' }, { text: 'As-needed', type: 'blue' }],
                  title: '3-in-1 Performance Pill',
                  price: 'Starting at $39/mo',
                  desc: 'Helps you get hard faster and stay hard longer.',
                },
                {
                  img: '/images/tadalafil-chew-pill-product-16_9.webp',
                  badges: [{ text: 'As-needed', type: 'blue' }],
                  title: 'Tadalafil Chews',
                  price: 'Starting at $30/mo',
                  desc: 'Longer-lasting support for more flexibility and confidence.',
                },
                {
                  img: '/images/generic-viagra-pill-product-16_9.webp',
                  badges: [{ text: 'As-needed', type: 'blue' }],
                  title: 'Sildenafil Pills',
                  price: 'Starting at $22/mo',
                  desc: 'Trusted option to help you get and maintain strong erections.',
                },
                {
                  img: '/images/generic-cialis-pill-product-16_9.webp',
                  badges: [{ text: 'As-needed', type: 'blue' }],
                  title: 'Tadalafil Pills',
                  price: 'Starting at $24/mo',
                  desc: 'Long-lasting support so you’re ready anytime.',
                },
              ].map((p) => (
                <article key={p.title} className="ed-products__card">
                  <div className="ed-products__card-media">
                    <div className="ed-products__badges">
                      {p.badges.map((b) => (
                        <span key={b.text} className={`ed-products__badge ed-products__badge--${b.type}`}>{b.text}</span>
                      ))}
                    </div>
                    <img src={p.img} alt="" className="ed-products__card-img" loading="lazy"  decoding="async"/>
                  </div>
                  <h3 className="ed-products__card-title">{p.title}</h3>
                  <p className="ed-products__card-price">{p.price}</p>
                  <p className="ed-products__card-desc">{p.desc}</p>
                  <button type="button" className="ed-products__card-btn" aria-disabled="true">Get started</button>
                  <a href="#" className="ed-products__card-link" aria-disabled="true">Important safety information</a>
                </article>
              ))}
            </div>
          </div>

          <div className="ed-products__inner">
            <p className="ed-products__fineprint">
              Prescription required. Not suitable for everyone. Results may vary based on individual response and use.
            </p>
          </div>
        </section>
        {/* Understand the basics of erectile dysfunction */}
        <section className="ed-about" aria-label="Understand the basics of erectile dysfunction">
          <div className="ed-about__inner">
            <div className="ed-about__content">
              <h2 className="ed-about__heading">
                Understanding{' '}
                <br className="ed-about__heading-break" />
                <span className="ed-about__accent">erectile dysfunction</span>
              </h2>

              <ul className="ed-about__faqs">
                {edFaqs.map((f, idx) => {
                  const isOpen = openFaq === idx
                  return (
                    <li key={f.q} className={`ed-about__item ${isOpen ? 'ed-about__item--open' : ''}`}>
                      <button
                        type="button"
                        className="ed-about__question"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      >
                        <span>{f.q}</span>
                        <svg className="ed-about__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      <div className="ed-about__answer">
                        <div className="ed-about__answer-inner">{f.body}</div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="ed-about__actions">
                <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="ed-hero__btn ed-hero__btn--outline" aria-disabled="true">Check your symptoms</button>
              </div>
            </div>

            <div className="ed-about__media">
              <img
                src="/images/h-ED-About-D.webp"
                alt=""
                className="ed-about__img"
                loading="lazy"
               decoding="async"/>
            </div>
          </div>
        </section>
        {/* Get personalized care from anywhere */}
        <section className="ed-care" aria-label="Get personalized care from anywhere">
          <div className="ed-care__inner">
            <div className="ed-care__media">
              <img
                src="/images/h-ED-HIW-D.webp"
                alt=""
                className="ed-care__img"
                loading="lazy"
               decoding="async"/>
            </div>

            <div className="ed-care__content">
              <h2 className="ed-care__heading">
                Personalized care,{' '}
                <br className="ed-care__heading-break" />
                <span className="ed-care__accent">wherever you are</span>
              </h2>

              <ol className="ed-care__steps">
                {[
                  { title: 'Quick online assessment', desc: 'Answer a few simple questions about your health and symptoms.' },
                  { title: 'Connect with a provider', desc: 'A licensed provider reviews your info and recommends the right option.' },
                  { title: 'Get treatment delivered', desc: 'If prescribed, your treatment is shipped discreetly to your door.' },
                ].map((step, idx) => (
                  <li key={step.title} className="ed-care__step">
                    <span className="ed-care__step-num" aria-hidden="true">{idx + 1}</span>
                    <div className="ed-care__step-body">
                      <h3 className="ed-care__step-title">{step.title}</h3>
                      <p className="ed-care__step-desc">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="ed-care__actions">
                <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="ed-hero__btn ed-hero__btn--outline" aria-disabled="true">Try a free assessment</button>
              </div>
            </div>
          </div>
        </section>
        {/* Find simple answers to common ED questions */}
        <section className="ed-qa" aria-label="Find simple answers to common ED questions">
          <div className="ed-qa__inner">
            <div className="ed-qa__left">
              <h2 className="ed-qa__heading">
                Quick answers,
                <br className="ed-qa__heading-break" />
                {' '}
                <span className="ed-qa__accent">no confusion</span>
              </h2>
              <div className="ed-qa__actions">
                <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="ed-hero__btn ed-hero__btn--outline" aria-disabled="true">Check if it’s right for you</button>
              </div>
            </div>

            <ul className="ed-qa__list">
              {edQuestions.map((f, idx) => {
                const isOpen = openEdFaq === idx
                return (
                  <li key={f.q} className={`ed-qa__item ${isOpen ? 'ed-qa__item--open' : ''}`}>
                    <button
                      type="button"
                      className="ed-qa__question"
                      aria-expanded={isOpen}
                      onClick={() => setOpenEdFaq(isOpen ? -1 : idx)}
                    >
                      <span>{f.q}</span>
                      <svg className="ed-qa__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="ed-qa__answer">
                      <div className="ed-qa__answer-inner">{f.body}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
        {/* Explore + Popular + Blog resources */}
        <section className="ed-explore" aria-label="Explore more about ED">
          <div className="ed-explore__inner">
            <div className="ed-explore__left">
              <h3 className="ed-explore__label">Explore</h3>
              <ul className="ed-explore__links">
                <li><a href="#" className="ed-explore__link" aria-disabled="true">Have Better Sex</a></li>
                <li><a href="#" className="ed-explore__link" aria-disabled="true">Erectile Dysfunction</a></li>
                <li><a href="#" className="ed-explore__link" aria-disabled="true">Early Climax</a></li>
              </ul>
            </div>

            <div className="ed-explore__right">
              <h3 className="ed-explore__label">Popular</h3>
              <ul className="ed-explore__products">
                {[
                  { name: 'Performance Mints', img: '/images/HardMints_SingleMint.webp' },
                  { name: 'Sildenafil Pills', img: '/images/h_ED_Footer_Sildendafil.webp' },
                  { name: 'Tadalafil Pills', img: '/images/h_ED_Footer_Cialis.webp' },
                  { name: 'Daily Performance Support', img: '/images/h_ED_Footer_Tadalafil.webp' },
                ].map((p) => (
                  <li key={p.name} className="ed-explore__product">
                    <img src={p.img} alt="" className="ed-explore__product-img" loading="lazy"  decoding="async"/>
                    <a href="#" className="ed-explore__link" aria-disabled="true">{p.name}</a>
                  </li>
                ))}
              </ul>

              <button type="button" className="ed-explore__btn" aria-disabled="true">View all treatments</button>

              <h3 className="ed-explore__label ed-explore__label--blog">Top resources</h3>
              <ul className="ed-explore__links">
                <li><a href="#" className="ed-explore__link" aria-disabled="true">How to improve performance</a></li>
                <li><a href="#" className="ed-explore__link" aria-disabled="true">How long should intimacy last?</a></li>
                <li><a href="#" className="ed-explore__link" aria-disabled="true">Ways to maintain stronger erections</a></li>
              </ul>
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

export default ErectileDysfunctionPage
