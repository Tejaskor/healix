import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import './ErectileDysfunctionPage.scss'
import './EarlyClimaxPage.scss'
import './HardMintsPage.scss'

const HardMintsPage = () => {
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
    <div className="hm-page">
      <Navbar />

      <main className="hm-page__main">
        {/* Hero */}
        <section className="hm-hero" aria-label="Hard Mints hero">
          <div className="hm-hero__inner">
            <div className="hm-hero__content">
              <h1 className="hm-hero__heading">
                <span className="hm-hero__accent">One chew.</span>{' '}
                <br className="hm-hero__heading-break" />
                Better performance.
              </h1>

              <ul className="hm-hero__features">
                {[
                  { text: 'Fresh, easy-to-take chewables', icon: '/images/h-HM-ATF-Bullet-01.webp' },
                  { text: 'Trusted, proven ingredients', icon: '/images/h-HM-ATF-Bullet-02.webp' },
                  { text: 'Personalized to your needs', icon: '/images/h-HM-ATF-Bullet-03.webp' },
                ].map((item) => (
                  <li key={item.text} className="hm-hero__feature">
                    <span className="hm-hero__feature-icon" aria-hidden="true">
                      <img src={item.icon} alt="" className="hm-hero__feature-img" loading="lazy"  decoding="async"/>
                    </span>
                    <span className="hm-hero__feature-text">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="hm-hero__actions">
                <button type="button" className="ed-hero__btn ed-hero__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="ed-hero__btn ed-hero__btn--outline" aria-disabled="true">Check if it’s right for you</button>
              </div>

              <p className="hm-hero__disclaimer">
                Prescription required. Not suitable for everyone. Results may vary.
              </p>
            </div>

            <div className="hm-hero__media">
              <img
                src="/images/HardMints-ATF-D.webp"
                alt=""
                className="hm-hero__img"
                loading="eager"
               decoding="async"/>
            </div>
          </div>
        </section>

        {/* ED treatment, 100% online — 3-card horizontal scroll */}
        <section className="hm-vp" aria-label="ED treatment, 100% online">
          <div className="hm-vp__inner">
            <header className="hm-vp__header">
              <h2 className="hm-vp__heading">
                <span className="hm-vp__accent">Get ED treatment—</span>
                <br />
                <span className="hm-vp__dark">completely online</span>
              </h2>
              <button type="button" className="hm-vp__cta hm-vp__cta--top" aria-disabled="true">Explore all treatments</button>
            </header>
          </div>

          <div className="hm-vp__track-wrap">
            <div className="hm-vp__track">
              {[
                {
                  titleAccent: 'Trusted',
                  titleDark: 'ingredients',
                  img: '/images/HardMints-VP-01-D.webp',
                  desc: 'Formulated with proven ingredients used in established ED treatments.',
                },
                {
                  titleAccent: 'Ready',
                  titleDark: 'anywhere',
                  img: '/images/h-Sex-HardMints-VP-02-D.webp',
                  desc: 'Easy-to-use options you can take anytime—no water needed.',
                },
                {
                  titleAccent: 'Licensed',
                  titleDark: 'providers',
                  img: '/images/h-Sex-HardMints-VP-03-D.webp',
                  desc: 'Connect with experienced medical professionals—no in-person visits required.',
                },
              ].map((c) => (
                <article key={c.titleDark} className="hm-vp__card">
                  <h3 className="hm-vp__card-title">
                    <span className="hm-vp__accent">{c.titleAccent}</span>
                    <br />
                    <span className="hm-vp__dark">{c.titleDark}</span>
                  </h3>
                  <div
                    className="hm-vp__card-media"
                    role="img"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${c.img})` }}
                  />
                  <p className="hm-vp__card-desc">{c.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="hm-vp__inner hm-vp__footer">
            <button type="button" className="hm-vp__cta hm-vp__cta--bottom" aria-disabled="true">Explore all treatments</button>
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

export default HardMintsPage
