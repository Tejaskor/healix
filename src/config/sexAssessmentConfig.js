import { US_STATE_OPTIONS } from './usStates'

// Sexual Wellness assessment — same config structure as hairAssessmentConfig.
const sexAssessmentConfig = {
  questions: [
    {
      id: 'goal',
      type: 'single',
      question: 'What best describes your current concern?',
      options: [
        { value: 'performance', label: 'Improve performance' },
        { value: 'confidence', label: 'Increase confidence' },
        { value: 'stamina', label: 'Improve stamina' },
        { value: 'treatment', label: 'Explore treatment options' },
        { value: 'prevent', label: 'Prevent future issues' },
      ],
    },
    {
      id: 'symptoms',
      type: 'single',
      question: 'How often do you experience difficulties?',
      options: [
        { value: 'frequently', label: 'Frequently' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      id: 'confidence',
      type: 'single',
      question: 'How confident do you currently feel about your sexual wellness?',
      options: [
        { value: 'very', label: 'Very confident' },
        { value: 'somewhat', label: 'Somewhat confident' },
        { value: 'low', label: 'Low confidence' },
        { value: 'prefer-not', label: 'Prefer not to say' },
      ],
    },
    {
      id: 'timeline',
      type: 'single',
      question: 'When did you first notice these changes?',
      options: [
        { value: 'few-weeks', label: 'Past few weeks' },
        { value: 'few-months', label: 'Past few months' },
        { value: 'over-year', label: 'Over a year ago' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      id: 'results',
      type: 'multi',
      question: 'What results are you hoping for?',
      subtitle: 'Choose as many as you’d like.',
      options: [
        { value: 'performance', label: 'Better performance' },
        { value: 'stamina', label: 'Increased stamina' },
        { value: 'confidence', label: 'Improved confidence' },
        { value: 'intimacy', label: 'Better intimacy' },
        { value: 'all', label: 'All of the above' },
      ],
      validation: { min: 1 },
    },
    {
      id: 'lifestyle-intro',
      type: 'info',
      heading: 'Next, let’s talk about lifestyle factors.',
      body: 'Lifestyle habits can affect sexual wellness more than most people realize.',
    },
    {
      id: 'stress',
      type: 'single',
      question: 'How often do you feel stressed?',
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'rarely', label: 'Rarely' },
      ],
    },
    {
      id: 'sleep',
      type: 'single',
      question: 'How would you rate your sleep quality?',
      options: [
        { value: 'excellent', label: 'Excellent' },
        { value: 'average', label: 'Average' },
        { value: 'poor', label: 'Poor' },
      ],
    },
    {
      id: 'routine-intro',
      type: 'info',
      heading: 'Now, let’s get to know your routine.',
      body: 'Now let’s understand your daily routine and wellness habits.',
    },
    {
      id: 'exercise',
      type: 'single',
      question: 'How active are you during the week?',
      options: [
        { value: 'very', label: 'Very active' },
        { value: 'moderate', label: 'Moderately active' },
        { value: 'low', label: 'Not very active' },
      ],
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
      'Reviewing your wellness patterns',
      'Matching the best treatment options',
      'Preparing personalized recommendations',
    ],
  },

  getResult: (a) => {
    const stressed = a.stress === 'daily' || a.stress === 'sometimes'
    const lowConfidence = a.confidence === 'low' || a.confidence === 'somewhat'
    const results = a.results || []
    const stamina =
      a.goal === 'stamina' || a.goal === 'performance' || results.includes('stamina')
    const poorSleep = a.sleep === 'poor' || a.sleep === 'average'

    let summary
    if (stressed && lowConfidence && stamina) {
      summary =
        'Your responses suggest that stress and lifestyle factors may be affecting your confidence and performance.'
    } else if (stressed && lowConfidence) {
      summary =
        'Your responses suggest that stress may be impacting your confidence and overall sexual wellness.'
    } else if (stamina) {
      summary =
        'Your responses suggest there’s room to improve stamina and performance with the right support.'
    } else {
      summary =
        'Your responses suggest a strong foundation, with a few areas we can help you optimize.'
    }

    const insights = []
    if (stressed) insights.push('Elevated stress can directly affect performance and desire.')
    if (poorSleep) insights.push('Improving sleep quality often boosts energy and confidence.')
    if (lowConfidence) insights.push('Confidence and performance tend to improve together.')

    const recommendations = [
      { title: 'Performance support', description: 'Clinically-informed options to support performance.' },
      { title: 'Confidence optimization', description: 'A plan designed to rebuild lasting confidence.' },
      { title: 'Wellness consultation', description: 'Talk 1:1 with a licensed provider about your goals.' },
    ]
    if (stressed || poorSleep) {
      recommendations.push({
        title: 'Lifestyle improvements',
        description: 'Simple stress, sleep and activity adjustments that compound over time.',
      })
    }

    return {
      heading: 'Your personalized wellness plan',
      summary,
      insights,
      recommendationsTitle: 'Recommended for you',
      recommendations,
      ctas: [{ label: 'View Personalized Plan' }, { label: 'Continue Consultation' }],
      disclaimer:
        'This is not a medical diagnosis. A licensed provider will review your information.',
    }
  },
}

export default sexAssessmentConfig
