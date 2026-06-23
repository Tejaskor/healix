import './ExpertSection.scss'

const ExpertSection = () => {
  return (
    <section className="expert">
      <div className="expert__inner">
        <div className="expert__image-wrap">
          <picture>
            <source srcSet="/images/h-WL-Expert-Section-D-V2.webp" type="image/webp" />
            <img
              src="/images/h-WL-Expert-Section-D-V2.webp"
              alt="Dr. Craig Primack"
              className="expert__image"
              loading="lazy"
             decoding="async"/>
          </picture>
        </div>

        <div className="expert__content">
          <h2 className="expert__heading">
            Healthcare 
            <br />
            <span className="expert__heading-highlight">that puts you first</span>
          </h2>
          <p className="expert__description">
            Connect with experienced medical professionals who create treatment plans tailored to your health and wellness journey.
          </p>
          <button className="expert__btn" aria-disabled="true">Meet Dr. Stacy Smith</button>
        </div>
      </div>
    </section>
  )
}

export default ExpertSection
