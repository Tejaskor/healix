import TreatmentCards from '@/components/sections/TreatmentCards/TreatmentCards'
import MembershipSection from '@/components/sections/MembershipSection/MembershipSection'
import WegovyHero from '@/components/sections/WegovyHero/WegovyHero'
import ExpertSection from '@/components/sections/ExpertSection/ExpertSection'
import TestimonialSlider from '@/components/sections/TestimonialSlider/TestimonialSlider'
import FaqSection from '@/components/sections/FaqSection/FaqSection'
import SoftFooterHero from '@/components/sections/SoftFooterHero/SoftFooterHero'
import "./WeightLossPage.scss"

const WeightLossPage = () => {

  return (
  <>
    {/* HERO */}
    <section className="weight-hero">
      <div className="weight-hero__container">

        <div className="weight-hero__left">
          <h1 className="weight-hero__title">
            <span className="weight-hero__title-accent">Weight loss</span> <br />
            made effective
          </h1>
        </div>

        <div className="weight-hero__right">
          <p className="weight-hero__text">
            Personalized weight loss plans with GLP-1 support and continuous care.
          </p>

          <button className="weight-hero__btn" aria-disabled="true">
            Take the First Step
          </button>
        </div>

      </div>

      {/* Hero visual cards */}
      <section className="wl-cards">
        <div className="wl-cards__container">

          {/* Performance: these are the LCP visuals on /weight-loss.
              Eager + fetchpriority="high" pairs with the route-aware preload
              hint in index.html so the bytes start flowing during HTML parse
              instead of waiting for the page chunk to render. */}
          {/* CARD 1 */}
          <div className="wl-card wl-card--large">
            <span className="wl-card__badge">New</span>

            <img src="/images/h_image1-2_l.webp" className="wl-card__pill wl-card__pill--top" alt="" loading="eager" fetchpriority="high" decoding="async" />
            <img src="/images/h_image1-1_l.webp" className="wl-card__pill wl-card__pill--bottom" alt="" loading="eager" decoding="async" />

            <div className="wl-card__content">
              <h3>GLP-1 Pill</h3>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="wl-card wl-card--medium">
            <img src="/images/h_image2_l.webp" className="wl-card__img" alt="" loading="eager" decoding="async" />
            <div className="wl-card__overlay">
              <h3>↓ 32 lbs</h3>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="wl-card wl-card--small">
            <img src="/images/image3_l.webp" className="wl-card__img" alt="" loading="eager" decoding="async" />
          </div>

        </div>
      </section>
    </section>

    {/* Treatment product cards */}
    <TreatmentCards />

    {/* Membership section */}
    <MembershipSection />

    {/* Wegovy hero with animation */}
    <WegovyHero />

    {/* Expert section */}
    <ExpertSection />

    {/* Testimonial slider */}
    <TestimonialSlider />

    {/* FAQ section */}
    <FaqSection />

    {/* Soft footer hero */}
    <SoftFooterHero />

  </>
)
}

export default WeightLossPage