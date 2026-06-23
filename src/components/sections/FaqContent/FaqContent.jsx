import { useState } from 'react'
import './FaqContent.scss'

const membershipFaqs = [
  {
    id: 'm1',
    question: 'What is included in the weight loss membership?',
    answer: 'The membership includes personalized weight management support, expert guidance, wellness resources, and access to ongoing progress tracking tools.',
  },
  {
    id: 'm2',
    question: 'How do I get started with the membership?',
    answer: 'You can begin by completing a quick online assessment to help determine the best weight loss approach for your goals and lifestyle.',
  },
  {
    id: 'm3',
    question: 'Can the membership be customized to my goals?',
    answer: 'Yes, plans are designed to support different health goals, lifestyles, and personal preferences.',
  },
  {
    id: 'm4',
    question: 'How long does the membership last?',
    answer: 'Membership duration may vary depending on the selected plan, with flexible options available for ongoing support.',
  },
]

const medicationFaqs = [
  {
    id: 'med1',
    question: 'How do weight loss medications work?',
    answer: 'Weight loss medications may help control appetite, improve metabolism, or support healthier eating habits when combined with lifestyle changes.',
  },
  {
    id: 'med2',
    question: 'Are weight loss medications safe to use?',
    answer: 'These medications are typically prescribed based on individual health needs and should be used under professional medical guidance.',
  },
  {
    id: 'med3',
    question: 'Do I need a prescription for treatment?',
    answer: 'Some treatments may require a prescription after a medical evaluation to ensure they are appropriate for you.',
  },
  {
    id: 'med4',
    question: 'Can medication be combined with diet and exercise?',
    answer: 'Yes, medications are usually most effective when paired with healthy eating habits and regular physical activity.',
  },
  {
    id: 'med5',
    question: 'How often should I take the medication?',
    answer: 'Dosage schedules depend on the specific treatment plan and instructions provided by your healthcare provider.',
  },
  {
    id: 'med6',
    question: 'Can I continue treatment if I miss a dose?',
    answer: 'If you miss a dose, follow the guidance provided with your medication or consult a healthcare professional for advice.',
  },
  {
    id: 'med7',
    question: 'Will medication alone help me lose weight?',
    answer: 'Medication can support weight loss, but long-term success usually depends on maintaining healthy lifestyle habits.',
  },
  {
    id: 'med8',
    question: 'Can medications interact with other treatments?',
    answer: 'Yes, certain medications may interact with existing prescriptions or supplements, so it’s important to share your medical history.',
  },
]

const FaqGroup = ({ title, items, openId, onToggle }) => (
  <div className="faq-content__group">
    <div className="faq-content__group-inner">
      <div className="faq-content__left">
        <h2 className="faq-content__title">{title}</h2>
      </div>
      <div className="faq-content__right">
        {items.map((faq) => (
          <div key={faq.id} className={`faq-content__item ${openId === faq.id ? 'faq-content__item--open' : ''}`}>
            <button className="faq-content__question" onClick={() => onToggle(faq.id)} aria-expanded={openId === faq.id}>
              <span className="faq-content__question-text">{faq.question}</span>
              <svg className="faq-content__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="faq-content__answer-wrap">
              <div className="faq-content__answer">
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
)

const FaqContent = () => {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="faq-content">
      <FaqGroup title="Membership" items={membershipFaqs} openId={openId} onToggle={toggle} />
      <FaqGroup title="Medication" items={medicationFaqs} openId={openId} onToggle={toggle} />
    </section>
  )
}

export default FaqContent
