import { useRef, useEffect } from 'react'
import HowItWorks from '@/components/sections/HowItWorks/HowItWorks'
import ProductRange from '@/components/sections/ProductRange/ProductRange'
import PlanProgress from '@/components/sections/PlanProgress/PlanProgress'
import PeerSupport from '@/components/sections/PeerSupport/PeerSupport'
import ExpertOffers from '@/components/sections/ExpertOffers/ExpertOffers'
import MemFaq from '@/components/sections/MemFaq/MemFaq'
import MemSoftFooter from '@/components/sections/MemSoftFooter/MemSoftFooter'
import './MembershipPage.scss'

const MembershipPage = () => {
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
      track.scrollLeft = scrollStart - (e.pageX - startX)
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
    <div className="mem-page">
      <section className="mem-hero">
        <div className="mem-hero__bg">
          {/* Performance: above-the-fold hero background — load eagerly so it
              becomes the LCP candidate instead of being deferred. */}
          <img src="/images/h_bg.png" alt="" className="mem-hero__bg-img" loading="eager" fetchpriority="high" decoding="async" />
        </div>

        {/* Text content */}
        <div className="mem-hero__inner">
          <div className="mem-hero__left">
            <span className="mem-hero__label">Healix Personalized Weight Care </span>
            <h1 className="mem-hero__heading"><span className="mem-hero__heading-muted">Not just treatment</span><br />Support for every step</h1>
          </div>
          <div className="mem-hero__right">
            <p className="mem-hero__description">
              Enhance your results with a membership designed to support your treatment.
            </p>
            <button className="mem-hero__btn" aria-disabled="true">Join Healix</button>
          </div>
        </div>

        {/* Cards — inside hero, on top of bg */}
        <div className="mem-cards__track" ref={trackRef}>
          <div className="mem-cards__card mem-cards__card--tall">
            <img src="/images/h_card-1.webp" alt="" className="mem-cards__card-img"  loading="lazy" decoding="async"/>
          </div>
          <div className="mem-cards__card mem-cards__card--tall mem-cards__card--wide">
            <img src="/images/h_card-2.webp" alt="" className="mem-cards__card-img"  loading="lazy" decoding="async"/>
          </div>
          <div className="mem-cards__card-stack">
            <div className="mem-cards__card mem-cards__card--half">
              <img src="/images/h_card-3.webp" alt="" className="mem-cards__card-img"  loading="lazy" decoding="async"/>
            </div>
            <div className="mem-cards__card mem-cards__card--half">
              <img src="/images/h_card-4.webp" alt="" className="mem-cards__card-img"  loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Product Range */}
      <ProductRange />

      {/* Plan for Progress */}
      <PlanProgress />

      {/* Peer Support */}
      <PeerSupport />

      {/* Expert Offers */}
      <ExpertOffers />

      {/* FAQ */}
      <MemFaq />

      {/* Soft Footer */}
      <MemSoftFooter />

    </div>
  )
}

export default MembershipPage
