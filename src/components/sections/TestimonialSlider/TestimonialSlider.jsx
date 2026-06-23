import { useRef, useEffect } from 'react'
import './TestimonialSlider.scss'

const testimonials = [
  {
    id: 1,
    tag: '33 lbs lost in 8 months',
    beforeImg: '/images/h-WL-BA-Drew-Before.png',
    afterImg: '/images/h-WL-BA-Drew-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 8',
    quote: '\u201CI feel more in control of my eating habits now. I don\u2019t constantly think about food, and my energy levels are much better throughout the day. It\u2019s been a steady and positive change for me.\u201D',
    name: 'Kathryn, 38',
  },
  {
    id: 2,
    tag: '13 lbs lost in 4 months',
    beforeImg: '/images/h-WL-BA-Adam-Before.png',
    afterImg: '/images/h-WL-BA-Adam-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 4',
    quote: '\u201CI\u2019ve noticed a real difference in how I feel every day. I\u2019m more active, my clothes fit better, and I feel more confident in my routine and progress.\u201D',
    name: 'Jane, 35',
  },
  {
    id: 3,
    tag: '22 lbs lost in 7 months',
    beforeImg: '/images/h-WL-BA-Roland-Before.png',
    afterImg: '/images/h-WL-BA-Roland-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 7',
    quote: '\u201CI wanted to feel healthier and more active, and that\u2019s exactly what I\u2019m experiencing now. I feel lighter, more energetic, and motivated to stay consistent.\u201D',
    name: 'Devon, 41',
  },
  {
    id: 4,
    tag: '120 lbs lost in 8 mos',
    beforeImg: '/images/h-WL-BA-Zachary-Before.png',
    afterImg: '/images/h-WL-BA-Zachary-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 8',
    quote: '\u201CI\u2019ve seen steady improvements in my overall health and lifestyle. I feel stronger, more active, and more confident than I have in a long time.\u201D',
    name: 'Kristin, 36',
  },
  {
    id: 5,
    tag: '33 lbs lost in 8 months',
    beforeImg: '/images/h-WL-BA-Drew-Before.png',
    afterImg: '/images/h-WL-BA-Drew-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 8',
    quote: '\u201CI feel more in control of my eating habits now. I don\u2019t constantly think about food, and my energy levels are much better throughout the day. It\u2019s been a steady and positive change for me.\u201D',
    name: 'Kathryn, 38',
  },
  {
    id: 6,
    tag: '13 lbs lost in 4 months',
    beforeImg: '/images/h-WL-BA-Adam-Before.png',
    afterImg: '/images/h-WL-BA-Adam-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 4',
    quote: '\u201CI\u2019ve noticed a real difference in how I feel every day. I\u2019m more active, my clothes fit better, and I feel more confident in my routine and progress.\u201D',
    name: 'Jane, 35',
  },
  {
    id: 7,
    tag: '22 lbs lost in 7 months',
    beforeImg: '/images/h-WL-BA-Roland-Before.png',
    afterImg: '/images/h-WL-BA-Roland-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 7',
    quote: '\u201CI wanted to feel healthier and more active, and that\u2019s exactly what I\u2019m experiencing now. I feel lighter, more energetic, and motivated to stay consistent.\u201D',
    name: 'Devon, 41',
  },
  {
    id: 8,
    tag: '120 lbs lost in 8 mos',
    beforeImg: '/images/h-WL-BA-Zachary-Before.png',
    afterImg: '/images/h-WL-BA-Zachary-After.png',
    monthsBefore: 'Month 0',
    monthsAfter: 'Month 8',
    quote: '\u201CI\u2019ve seen steady improvements in my overall health and lifestyle. I feel stronger, more active, and more confident than I have in a long time.\u201D',
    name: 'Kristin, 36',
  },
]

const TestimonialSlider = () => {
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
    <section className="testimonials">
      {/* Heading */}
      <div className="testimonials__header">
        <h2 className="testimonials__heading">
          Real people,
          <br />
          <span className="testimonials__heading-accent"> real progress</span>
        </h2>
      </div>

      {/* Scrollable track — full width */}
      <div className="testimonials__track" ref={trackRef}>
        {testimonials.map((t) => (
          <div key={t.id} className="testimonials__card">
            <span className="testimonials__card-tag">{t.tag}</span>

            <div className="testimonials__card-images">
              <div className="testimonials__card-img-col">
                <img src={t.beforeImg} alt="Before" className="testimonials__card-img" loading="lazy"  decoding="async"/>
                <span className="testimonials__card-label">{t.monthsBefore}</span>
              </div>
              <div className="testimonials__card-img-col">
                <img src={t.afterImg} alt="After" className="testimonials__card-img" loading="lazy"  decoding="async"/>
                <span className="testimonials__card-label">{t.monthsAfter}</span>
              </div>
            </div>

            <p className="testimonials__card-quote">{t.quote}</p>

            <div className="testimonials__card-user">
              <span className="testimonials__card-name">{t.name}</span>
              <span className="testimonials__card-verified">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#244236" />
                  <path d="M7 12.5l3.5 3.5L17 8.5" stroke="#FAEAAC" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                Proven Results
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="testimonials__cta-wrap">
        <button className="testimonials__cta" aria-disabled="true">Read more success stories</button>
      </div>

      {/* Disclaimer */}
      <p className="testimonials__disclaimer">
        Results have not been independently verified. Individual outcomes may vary. The Weight Loss program includes prescription treatment, healthy nutrition guidance, and regular exercise support.
      </p>
    </section>
  )
}

export default TestimonialSlider
