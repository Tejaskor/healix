const wegovyAssessmentConfig = {
  loadingMessage: 'Reviewing your options',
  questions: [
    {
      id: 'treatment',
      type: 'single',
      question: 'Do you have a treatment in mind already?',
      options: [
        { value: 'pills', label: 'GLP-1 pills' },
        { value: 'injections', label: 'GLP-1 injections' },
        { value: 'recommendation', label: 'I\u2019d like a provider recommendation' },
      ],
    },
    {
      id: 'goals',
      type: 'multi',
      question: 'Why do you want to lose weight?',
      options: [
        { value: 'health', label: 'Improve my health' },
        { value: 'confidence', label: 'Gain confidence' },
        { value: 'clothes', label: 'Feel better in my clothes' },
        { value: 'other', label: 'Something else' },
      ],
      validation: { min: 1 },
    },
    {
      id: 'priorities',
      type: 'single',
      question: 'What matters most to you about your treatment?',
      options: [
        { value: 'fda', label: 'FDA-approved medications' },
        { value: 'affordability', label: 'Affordability' },
        { value: 'lasting', label: 'Results that last' },
        { value: 'support', label: 'Support from licensed providers' },
      ],
    },
  ],
  result: {
    heading: 'You\u2019ve come to the right place',
    image: '/images/product_wegovy-pill.png',
    bullets: [
      'Trusted weight loss medications',
      'Results you can see and feel',
      'Plans built for progress',
    ],
    ctaLabel: 'Get my plan',
    productsHeading: 'With healix, you\u2019ve got options',
    products: [
      {
        name: 'GLP-1 Pill',
        sub: 'Oral Semaglutide',
        image: '/images/product_wegovy-pill.png',
        price: 'From $299/mo',
      },
      {
        name: 'GLP-1 Pen',
        sub: 'Injectable Semaglutide',
        image: '/images/product_wegovy-pen.png',
        price: 'From $349/mo',
      },
      {
        name: 'Ozempic\u00ae',
        sub: 'Injectable Semaglutide',
        image: '/images/product_ozempic.png',
        price: 'From $399/mo',
      },
      {
        name: 'Mounjaro\u00ae',
        sub: 'Injectable Tirzepatide',
        image: '/images/product_mounjaro.png',
        price: 'From $499/mo',
      },
    ],
    disclaimer: 'Prescription products require an online consultation with a licensed medical provider. Not all applicants are eligible. Pricing varies based on your plan. See full terms for details.',
  },
}

export default wegovyAssessmentConfig
