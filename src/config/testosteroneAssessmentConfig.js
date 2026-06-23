import { US_STATE_OPTIONS } from './usStates'

// Testosterone assessment — same config structure as hairAssessmentConfig.
const testosteroneAssessmentConfig = {
  questions: [
    {
      id: 'goal',
      type: 'single',
      question: 'What are you hoping to improve?',
      options: [
        { value: 'energy', label: 'Energy levels' },
        { value: 'strength', label: 'Muscle strength' },
        { value: 'mood', label: 'Mood' },
        { value: 'focus', label: 'Focus' },
        { value: 'vitality', label: 'Overall vitality' },
      ],
    },
    {
      id: 'symptoms',
      type: 'single',
      question: 'Which symptoms are you experiencing?',
      options: [
        { value: 'fatigue', label: 'Fatigue' },
        { value: 'motivation', label: 'Low motivation' },
        { value: 'brain-fog', label: 'Brain fog' },
        { value: 'strength', label: 'Reduced strength' },
        { value: 'libido', label: 'Low libido' },
      ],
    },
    {
      id: 'energy',
      type: 'single',
      question: 'How would you describe your energy throughout the day?',
      options: [
        { value: 'high', label: 'High' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      id: 'sleep',
      type: 'single',
      question: 'How well do you sleep at night?',
      options: [
        { value: 'very-well', label: 'Very well' },
        { value: 'average', label: 'Average' },
        { value: 'poorly', label: 'Poorly' },
      ],
    },
    {
      id: 'lifestyle-intro',
      type: 'info',
      heading: 'Next, let’s talk about lifestyle factors.',
      body: 'Daily habits and stress levels can impact hormone balance.',
    },
    {
      id: 'stress',
      type: 'single',
      question: 'How often do you feel mentally exhausted?',
      options: [
        { value: 'often', label: 'Often' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'rarely', label: 'Rarely' },
      ],
    },
    {
      id: 'fitness',
      type: 'single',
      question: 'How frequently do you exercise?',
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'few-week', label: 'Few times a week' },
        { value: 'rarely', label: 'Rarely' },
      ],
    },
    {
      id: 'goals',
      type: 'multi',
      question: 'What results are you looking for?',
      subtitle: 'Choose as many as you’d like.',
      options: [
        { value: 'energy', label: 'More energy' },
        { value: 'focus', label: 'Better focus' },
        { value: 'mood', label: 'Improved mood' },
        { value: 'strength', label: 'Increased strength' },
        { value: 'recovery', label: 'Better recovery' },
      ],
      validation: { min: 1 },
    },
    {
      id: 'state',
      type: 'state-select',
      question: 'Which state do you currently live in?',
      placeholder: 'Select your state',
      options: US_STATE_OPTIONS,
      requiresTerms: true,
    },
  ],

  loading: {
    title: 'Analyzing your responses…',
    messages: [
      'Reviewing your energy & recovery',
      'Analyzing hormone-related signals',
      'Preparing your optimization plan',
    ],
  },

  getResult: (a) => {
    const fatigue = a.symptoms === 'fatigue' || a.energy === 'low'
    const lowMotivation = a.symptoms === 'motivation' || a.symptoms === 'brain-fog'
    const poorSleep = a.sleep === 'poorly' || a.sleep === 'average'
    const stressed = a.stress === 'often' || a.stress === 'sometimes'

    let summary
    if (fatigue && lowMotivation && poorSleep) {
      summary =
        'Your responses indicate that recovery, stress, and hormone balance may be impacting your energy levels.'
    } else if (fatigue && poorSleep) {
      summary =
        'Your responses suggest that low energy and sleep quality may be affecting how you feel day to day.'
    } else if (lowMotivation) {
      summary =
        'Your responses suggest that focus and motivation could benefit from hormone and lifestyle support.'
    } else {
      summary =
        'Your responses suggest a solid baseline, with clear opportunities to optimize energy and vitality.'
    }

    const insights = []
    if (poorSleep) insights.push('Quality sleep is one of the biggest drivers of healthy hormone levels.')
    if (stressed) insights.push('Chronic stress can suppress testosterone and recovery.')
    if (fatigue) insights.push('Energy often rebounds once the underlying balance is addressed.')

    const recommendations = [
      { title: 'Energy optimization', description: 'A plan to restore steady, all-day energy.' },
      { title: 'Hormone support', description: 'Provider-guided options to support healthy testosterone.' },
      { title: 'Recovery improvement', description: 'Sleep and recovery strategies that move the needle.' },
    ]
    if (stressed || poorSleep) {
      recommendations.push({
        title: 'Lifestyle guidance',
        description: 'Practical stress, training and nutrition adjustments.',
      })
    }

    return {
      heading: 'Your personalized optimization plan',
      summary,
      insights,
      recommendationsTitle: 'Recommended for you',
      recommendations,
      ctas: [{ label: 'View Optimization Plan' }, { label: 'Continue Consultation' }],
      disclaimer:
        'This is not a medical diagnosis. A licensed provider will review your information.',
    }
  },
}

export default testosteroneAssessmentConfig
