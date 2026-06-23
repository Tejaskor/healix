const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

const hairAssessmentConfig = {
  questions: [
    {
      id: 'goal',
      type: 'single',
      question: 'Which best represents your hair loss and goals?',
      options: [
        { value: 'receding', label: 'Receding hairline, want to slow its progress' },
        { value: 'exploring', label: 'Experiencing hair loss, exploring options' },
        { value: 'asap', label: 'Experiencing hair loss, ready to start treatment ASAP' },
        { value: 'preventive', label: 'No hair loss yet, want to get ahead of it' },
        { value: 'none', label: 'None of the above' },
      ],
    },
    {
      id: 'area',
      type: 'single',
      question: 'Where are you noticing changes to your hair?',
      options: [
        { value: 'hairline', label: 'Along the hairline', icon: '\u{1F454}' },
        { value: 'top', label: 'At the top', icon: '\u{1F3AF}' },
        { value: 'all', label: 'All over', icon: '\u{1F4AB}' },
      ],
    },
    {
      id: 'lossLevel',
      type: 'single',
      question: 'How much hair have you lost?',
      options: [
        { value: 'lot', label: 'A lot', description: 'It\u2019s obvious to everyone' },
        { value: 'some', label: 'Some', description: 'Those close to me notice' },
        { value: 'little', label: 'A little', description: 'Only I notice' },
      ],
    },
    {
      id: 'timeline',
      type: 'single',
      question: 'When did you start noticing changes?',
      options: [
        { value: 'over-year', label: 'Over a year ago' },
        { value: 'past-year', label: 'In the past year' },
        { value: 'past-months', label: 'In the past few months' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      id: 'results',
      type: 'multi',
      question: 'With treatment, what results are you hoping for?',
      subtitle: 'Choose as many as you\u2019d like.',
      options: [
        { value: 'hairline', label: 'A stronger, defined hairline' },
        { value: 'thicker', label: 'Visibly thicker, fuller hair' },
        { value: 'coverage', label: 'More scalp coverage' },
        { value: 'keep', label: 'Keep the hair I have' },
        { value: 'all', label: 'All of the above' },
      ],
      validation: { min: 1 },
    },
    {
      id: 'hairType',
      type: 'single',
      question: 'What\u2019s your hair type?',
      options: [
        { value: 'straight', label: 'Straight or wavy' },
        { value: 'curly', label: 'Curly or coily' },
        { value: 'textured', label: 'Textured or processed' },
        { value: 'none', label: 'I don\u2019t have hair' },
      ],
    },
    {
      id: 'hairLength',
      type: 'single',
      question: 'How long is your hair?',
      options: [
        { value: 'buzzed', label: 'Buzzed, shaved, or bald' },
        { value: 'short', label: 'Short' },
        { value: 'medium', label: 'Medium' },
        { value: 'long', label: 'Long' },
      ],
    },
    {
      id: 'lifestyle-intro',
      type: 'info',
      heading: 'Next, let\u2019s talk about lifestyle factors.',
      body: 'Uncovering which root causes may be affecting you can help us better understand your hair needs.',
    },
    {
      id: 'familyHistory',
      type: 'single',
      autoNext: false,
      question: 'Does hair loss run in your family?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: 'Not sure' },
      ],
      infoBox: {
        title: 'Why we ask',
        body: 'Family history is a strong predictor of hair loss. Sharing this helps us recommend the right treatments for you.',
      },
    },
    {
      id: 'stress',
      type: 'single',
      autoNext: false,
      question: 'How often do you tend to experience stress?',
      options: [
        { value: 'always', label: 'All the time' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'unsure', label: 'Not sure' },
      ],
      infoBox: {
        title: 'Why we ask',
        body: 'Stress can trigger hair shedding. Understanding your stress patterns helps us tailor your treatment.',
      },
    },
    {
      id: 'root-causes',
      type: 'info',
      body: 'Factors like aging, family history, and stress can cause hair shedding and thinning. The good news? Prescription treatments can help you fight these root causes, so you can grow visibly thicker, fuller hair in just 3 to 6 months.',
    },
    {
      id: 'routine-intro',
      type: 'info',
      heading: 'Now, let\u2019s get to know your hair routine.',
      body: 'Your answers help determine which treatment types best fit into your day-to-day.',
    },
    {
      id: 'styling',
      type: 'single',
      question: 'How do you style your hair?',
      options: [
        { value: 'none', label: 'No styling', description: 'I let my hair do its thing' },
        { value: 'products', label: 'Products', description: 'Gel, mousse, etc.' },
        { value: 'hat', label: 'I usually wear a hat' },
        { value: 'protective', label: 'Protective styles', description: 'Braids, locs, etc.' },
      ],
    },
    {
      id: 'timeSpent',
      type: 'single',
      question: 'How much time do you spend on your hair every day?',
      subtitle: 'We offer treatments that are quick, simple, and work with your routine.',
      options: [
        { value: '<5', label: 'Less than 5 minutes' },
        { value: '5-10', label: '5\u201310 minutes' },
        { value: '10+', label: '10+ minutes' },
      ],
    },
    {
      id: 'state',
      type: 'state-select',
      question: 'Which state do you currently live in?',
      placeholder: 'Select your state',
      options: US_STATES.map((s) => ({ value: s, label: s })),
      requiresTerms: true,
    },
  ],

  // Analyzing screen shown after the final question.
  loading: {
    title: 'Analyzing your responses…',
    messages: [
      'Reviewing your hair profile',
      'Identifying possible root causes',
      'Matching treatments to your goals',
      'Preparing your personalized plan',
    ],
  },

  // Personalized result, dynamically generated from the user's answers.
  getResult: (a) => {
    const stressed = a.stress === 'always' || a.stress === 'sometimes'
    const family = a.familyHistory === 'yes'
    const early =
      a.lossLevel === 'little' ||
      a.goal === 'preventive' ||
      a.goal === 'receding' ||
      a.timeline === 'past-months' ||
      a.timeline === 'past-year'
    const advanced = a.lossLevel === 'lot'

    let summary
    if (early && stressed && family) {
      summary =
        'Your responses suggest early-stage hair thinning possibly influenced by stress and genetics.'
    } else if (family && stressed) {
      summary =
        'Your responses suggest hair thinning that may be influenced by both genetics and stress.'
    } else if (advanced) {
      summary =
        'Your responses suggest more established hair loss that responds best to a comprehensive treatment plan.'
    } else if (early) {
      summary =
        'Your responses suggest early-stage hair changes that are well-suited to preventive care.'
    } else {
      summary =
        'Your responses suggest hair thinning that can be supported with a targeted treatment plan.'
    }

    const insights = []
    if (family) insights.push('A family history of hair loss is a strong but treatable signal.')
    if (stressed) insights.push('Stress-related shedding often improves with consistent treatment.')
    if (early) insights.push('Acting early gives treatments the best chance to work.')

    const recommendations = [
      { title: 'Hair regrowth treatment', description: 'Prescription options to help grow thicker, fuller hair.' },
      { title: 'Scalp health support', description: 'Targeted care to create the right environment for growth.' },
      early
        ? { title: 'Preventive treatment plan', description: 'Get ahead of further thinning before it progresses.' }
        : { title: 'Comprehensive regrowth plan', description: 'A multi-step routine for more advanced hair loss.' },
    ]

    return {
      heading: 'Your personalized hair plan',
      summary,
      insights,
      recommendationsTitle: 'Recommended for you',
      recommendations,
      ctas: [{ label: 'Start Hair Plan' }, { label: 'Continue Consultation' }],
      disclaimer:
        'This is not a medical diagnosis. A licensed provider will review your information.',
    }
  },
}

export default hairAssessmentConfig
