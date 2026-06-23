import './HowItWorks.scss'

const steps = [
  {
    num: 1,
    title: 'Get started',
    desc: 'Sign up in minutes and begin your journey with a simple onboarding process.',
  },
  {
    num: 2,
    title: 'Health review',
    desc: 'Answer a few questions and a licensed provider will assess what\u2019s right for you.',
  },
  {
    num: 3,
    title: 'Personalized plan',
    desc: 'Receive a tailored plan designed to support your goals and lifestyle.',
  },
  {
    num: 4,
    title: 'Start your progress',
    desc: 'Begin your treatment and take the next step toward your goals.',
  },
]

const HowItWorks = () => {
  return (
    <section className="hiw">
      <div className="hiw__inner">
        <div className="hiw__image-wrap">
          <img
            src="/images/h-WL-Membership-HIW-D-V3.webp"
            alt="How membership works"
            className="hiw__image"
            loading="lazy"
           decoding="async"/>
        </div>

        <div className="hiw__content">
          <h2 className="hiw__heading">How it works</h2>

          <div className="hiw__steps">
            {steps.map((step) => (
              <div key={step.num} className="hiw__step">
                <span className="hiw__step-num">{step.num}</span>
                <div className="hiw__step-text">
                  <h3 className="hiw__step-title">{step.title}</h3>
                  <p className="hiw__step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="hiw__btn" aria-disabled="true">Join Healix</button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
