import { useRef, useEffect } from 'react'
import './TreatmentCards.scss'

const treatments = [
  {
    id: 1,
    name: 'GLP-1 Pill',
    price: 'From $149/mo†',
    priceNote: 'with membership',
    rx: true,
    fdaBadge: true,
    highlight: 'Now at Healix',
    img: '/images/product_wegovy-pill.png',
    buttons: ['Get started', 'View details'],
  },
  {
    id: 2,
    name: 'GLP-1 Pen',
    price: 'From $199/mo†',
    priceNote: 'with membership',
    rx: true,
    fdaBadge: true,
    highlight: 'Now at Healix',
    img: '/images/product_wegovy-pen.png',
    buttons: ['Get started', 'View details'],
  },
  {
    id: 3,
    name: 'Ozempic®',
    price: 'From $199/mo†',
    priceNote: 'with membership',
    rx: true,
    img: '/images/product_ozempic.png',
    buttons: ['Get started', 'View details'],
  },
  {
    id: 4,
    name: 'Mounjaro®',
    price: '$1,899/mo†',
    priceNote: 'with membership',
    rx: true,
    img: '/images/product_mounjaro.png',
    buttons: ['Get started', 'View details'],
  },
  {
    id: 5,
    name: 'Zepbound®',
    price: '$1,899/mo†',
    priceNote: 'with membership',
    rx: true,
    fdaBadge: true,
    img: '/images/product_zepbound.png',
    buttons: ['Get started', 'View details'],
  },
  {
    id: 6,
    name: 'Generic Liraglutide',
    price: 'From $299/mo†',
    priceNote: 'with membership',
    rx: true,
    img: '/images/product_liraglutide.png',
    buttons: ['Get started', 'View details'],
  },
]

const TreatmentCards = () => {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let isDown = false
    let startX = 0
    let scrollStart = 0

    const onMouseDown = (e) => {
      isDown = true
      startX = e.pageX
      scrollStart = track.scrollLeft
      track.style.scrollBehavior = 'auto'
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const dx = e.pageX - startX
      track.scrollLeft = scrollStart - dx
    }

    const onMouseUp = () => {
      isDown = false
      track.style.scrollBehavior = ''
    }

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 0) {
        e.preventDefault()
        track.scrollLeft += e.deltaX
      }
    }

    track.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    track.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      track.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      track.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <section className="treatments">
      {/* Header — centered container */}
      <div className="treatments__inner">
        <div className="treatments__header">
          <div className="treatments__header-left">
            <h2 className="treatments__heading">
              Feel Better.
              <br />
              <span className="treatments__heading-accent">Look Lighter.</span>
            </h2>
          </div>
          <div className="treatments__header-right">
            <p className="treatments__subheading">
              Discover prescription weight loss treatments tailored to your goals, lifestyle, and medical needs — all guided by licensed healthcare professionals.
            </p>
            <button className="treatments__cta" aria-disabled="true">Begin Your Fitness Journey</button>
          </div>
        </div>
      </div>

      {/* Track — full width, breaks out of container */}
      <div className="treatments__track" ref={trackRef}>
        {treatments.map((item) => (
          <div key={item.id} className="treatments__card">
            {/* Top: Badges */}
            <div className="treatments__card-top">
              <div className="treatments__card-badges">
                {item.rx && <span className="treatments__badge-rx">Rx</span>}
                {item.highlight && (
                  <span className="treatments__badge-highlight">{item.highlight}</span>
                )}
              </div>

              {/* Content: name + price */}
              <h3 className="treatments__card-name">{item.name}</h3>
              <p className="treatments__card-price">{item.price}</p>
              <p className="treatments__card-price-note">{item.priceNote}</p>
            </div>

            {/* Image */}
            <div className="treatments__card-image">
              <img
                src={item.img}
                alt={item.name}
                className="treatments__card-img"
                loading="lazy"
               decoding="async"/>
            </div>

            {/* Footer: buttons + safety link (safety sits below buttons) */}
            <div className="treatments__card-footer">
              {item.fdaBadge && (
                <img
                  src="/images/FDA_Approved_Badge_Vector.svg"
                  alt="FDA Approved"
                  className="treatments__card-fda"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="treatments__card-buttons">
                {item.buttons.map((btn) => (
                  <button
                    key={btn}
                    className={`treatments__btn ${
                      btn === 'Get started'
                        ? 'treatments__btn--primary'
                        : 'treatments__btn--secondary'
                    }`}
                   aria-disabled="true">
                    {btn}
                  </button>
                ))}
              </div>
              <a href="#" className="treatments__card-safety" aria-disabled="true">
                Important safety information
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA — mobile only */}
      <div className="treatments__cta-bottom-wrap">
        <button className="treatments__cta treatments__cta--bottom" aria-disabled="true">Begin Your Fitness Journey</button>
      </div>

      {/* Disclaimer — centered container */}
      <div className="treatments__inner">
        <div className="treatments__disclaimer">
          <p>
            All medication names referenced are trademarks of their respective owners. GLP-1 treatments are subject to availability and eligibility.
          </p>
          <p>
            †Price includes medication only, if prescribed. An active Healix Weight Loss
            Membership is required ($39 for the first month, auto-renews at $149/month
            thereafter). Membership is billed separately and does not include or guarantee
            a prescription. Medication is not available without a membership. Membership
            fee is not included.
          </p>
          <p>
            *Along with a reduced-calorie diet and increased physical activity.
            Individual results may vary.
          </p>
        </div>
      </div>
    </section>
  )
}

export default TreatmentCards
