import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MemFaq.scss'

const faqs = [
  {
    id: 1,
    question: 'What’s included in the Healix  Personalized Weight Care plan?',
    answer: 'The Healix Weight Loss Membership gives you access to treatment options (if eligible) along with ongoing support from a dedicated care team.\n\nIt also includes in-app progress tracking, personalized adjustments over time, and guidance to help you stay on track.',
  },
  {
    id: 2,
    question: 'How does pricing work?',
    answer: 'The membership starts at $39 for your first month, then renews at $149/month. Medication costs are separate.\n\nYou can cancel anytime. If prescribed, medication pricing depends on your treatment plan.',
  },
]

const MemFaq = () => {
  const [openId, setOpenId] = useState(null)
  const navigate = useNavigate()

  const toggle = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="mem-faq">
      <div className="mem-faq__inner">
        <div className="mem-faq__layout">
          <div className="mem-faq__left">
            <h2 className="mem-faq__heading">FAQs</h2>
            <button className="mem-faq__btn" onClick={() => navigate('/faqs')}>View all FAQs</button>
          </div>

          <div className="mem-faq__right">
            {faqs.map((faq) => (
              <div key={faq.id} className={`mem-faq__item ${openId === faq.id ? 'mem-faq__item--open' : ''}`}>
                <button className="mem-faq__question" onClick={() => toggle(faq.id)} aria-expanded={openId === faq.id}>
                  <span className="mem-faq__question-text">{faq.question}</span>
                  <svg className="mem-faq__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="mem-faq__answer-wrap">
                  <div className="mem-faq__answer">
                    {faq.answer.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MemFaq
