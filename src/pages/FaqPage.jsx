import FaqContent from '@/components/sections/FaqContent/FaqContent'
import './FaqPage.scss'

const FaqPage = () => {
  return (
    <div className="faq-page">
      {/* Hero */}
      <section className="faq-page__hero">
        <div className="faq-page__hero-content">
          <span className="faq-page__label">Weight Wellness</span>
          <h1 className="faq-page__heading">FAQs</h1>
        </div>
      </section>

      {/* FAQ Content */}
      <FaqContent />
    </div>
  )
}

export default FaqPage
