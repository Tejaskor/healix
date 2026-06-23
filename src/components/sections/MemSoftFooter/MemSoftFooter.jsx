import './MemSoftFooter.scss'

const MemSoftFooter = () => {
  return (
    <section className="mem-sf">
      <div className="mem-sf__wrapper">
        <img
          src="/images/h-WL-Memberships-SoftFooter-D.webp"
          alt=""
          className="mem-sf__bg-img"
         loading="lazy" decoding="async"/>
        <div className="mem-sf__content">
          <div className="mem-sf__top-text">
            <h2 className="mem-sf__heading-top">Your healthier future</h2>
          </div>
          <div className="mem-sf__cta-group">
            <h2 className="mem-sf__heading-bottom">starts with Healix</h2>
            <button className="mem-sf__btn" aria-disabled="true">Your weight loss journey begins here</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MemSoftFooter
