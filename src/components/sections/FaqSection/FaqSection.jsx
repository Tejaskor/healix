import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FaqSection.scss'

const faqs = [
  {
    id: 1,
    question: 'How Does the Weight Loss Program Work?',
    answer: 'The Healix Weight Loss Membership gives you access to clinically proven weight loss treatments, ongoing provider support, and personalized care plans. Your membership includes consultations with licensed healthcare providers, prescription management, and regular check-ins to track your progress.',
  },
  {
    id: 2,
    question: "Switching from Another GLP-1 Treatment?",
    answer: "If you're already taking a GLP-1 medication, our providers can work with you to transition your care to Healix. During your consultation, share your current medication and dosage, and your provider will create a personalized plan that ensures a smooth switch without interruption to your treatment.",
  },
  {
    id: 3,
    question: 'Are FSA & HSA Payments Accepted?',
    answer: 'Yes, many of our weight loss treatments are eligible for FSA (Flexible Spending Account) and HSA (Health Savings Account) reimbursement. You can use your FSA/HSA debit card at checkout, or submit your receipt for reimbursement through your benefits provider.',
  },
  {
    id: 4,
    question: 'Is Health Insurance Necessary?',
    answer: "No, insurance is not required to use Healix. Our pricing is transparent and straightforward. While we don't bill insurance directly, some treatments may be eligible for insurance reimbursement. You can check with your insurance provider for out-of-network benefits.",
  },
]

const FaqItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}>
      <button
        className="faq__question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq__question-text">{faq.question}</span>
        <svg
          className="faq__chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="faq__answer-wrap">
        <p className="faq__answer">{faq.answer}</p>
      </div>
    </div>
  )
}

const FaqSection = () => {
  const [openId, setOpenId] = useState(null)
  const navigate = useNavigate()

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="faq">
      <div className="faq__container">
        <div className="faq__inner">
          <div className="faq__left">
            <h2 className="faq__heading">Frequently asked questions</h2>
            <button className="faq__btn" onClick={() => navigate('/faqs')}>View all FAQs</button>
          </div>

          <div className="faq__right">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
