import './PlanProgress.scss'

const bullets = [
  'Guidance tailored to your health goals',
  'Support from licensed medical professionals',
  'Ongoing care throughout your journey',
]

const PlanProgress = () => {
  return (
    <section className="plan-prog">
      <div className="plan-prog__inner">
        <div className="plan-prog__image-wrap">
          <img
            src="/images/h-WL-Membership-Providers-V2-D.png"
            alt="Plan for progress"
            className="plan-prog__image"
            loading="lazy"
           decoding="async"/>
        </div>

        <div className="plan-prog__content">
          <span className="plan-prog__badge">Personalized Care</span>
          <h2 className="plan-prog__heading">Ongoing care that drives progress</h2>
          <p className="plan-prog__description">
            With support from day one and a plan built around your routine,
            small wins turn into real results.
          </p>

          <ul className="plan-prog__list">
            {bullets.map((item) => (
              <li key={item} className="plan-prog__list-item">
                <svg className="plan-prog__check" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#FAEAAC" />
                  <path d="M7 12.5l3 3 7-7" stroke="#1A362D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button className="plan-prog__btn" aria-disabled="true">Continue your journey</button>
        </div>
      </div>
    </section>
  )
}

export default PlanProgress
