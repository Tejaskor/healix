import './ProductRange.scss'

const ProductRange = () => {
  return (
    <section className="prod-range">
      <img
        src="/images/h-WL-Membership-ProductRange-D.png"
        alt=""
        className="prod-range__bg"
       loading="lazy" decoding="async"/>
      <div className="prod-range__overlay" />
      <div className="prod-range__content">
        <span className="prod-range__badge">Care access</span>
        <h2 className="prod-range__heading">
          Personalized options, better results
        </h2>
        <p className="prod-range__subtext">
          Access treatments tailored to your goals, with support every step of the way.
        </p>
        <div className="prod-range__buttons">
          <button className="prod-range__btn prod-range__btn--primary" aria-disabled="true">
            Join Healix
          </button>
          <button className="prod-range__btn prod-range__btn--secondary" aria-disabled="true">
            Explore options
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductRange
