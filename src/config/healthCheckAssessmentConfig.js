import { US_STATE_OPTIONS } from './usStates'

// Health Check assessment (Hero "Health check" card) — same config structure
// as hairAssessmentConfig. Note: this is distinct from healthAssessmentConfig,
// which powers the separate full-page onboarding flow.
const healthCheckAssessmentConfig = {
  questions: [
    {
      id: 'goal',
      type: 'single',
      question: 'What brings you here today?',
      options: [
        { value: 'general', label: 'General wellness' },
        { value: 'preventive', label: 'Preventive care' },
        { value: 'symptoms', label: 'Check symptoms' },
        { value: 'lifestyle', label: 'Improve lifestyle' },
        { value: 'plans', label: 'Explore health plans' },
      ],
    },
    {
      id: 'concerns',
      type: 'single',
      question: 'Which areas are you most concerned about?',
      options: [
        { value: 'heart', label: 'Heart health' },
        { value: 'weight', label: 'Weight management' },
        { value: 'sleep', label: 'Sleep' },
        { value: 'stress', label: 'Stress' },
        { value: 'nutrition', label: 'Nutrition' },
      ],
    },
    {
      id: 'lifestyle',
      type: 'single',
      question: 'How healthy would you consider your lifestyle?',
      options: [
        { value: 'very', label: 'Very healthy' },
        { value: 'average', label: 'Average' },
        { value: 'improve', label: 'Needs improvement' },
      ],
    },
    {
      id: 'sleep',
      type: 'single',
      question: 'How many hours do you sleep on average?',
      options: [
        { value: '<5', label: 'Less than 5' },
        { value: '5-7', label: '5–7' },
        { value: '7-9', label: '7–9' },
        { value: '9+', label: 'More than 9' },
      ],
    },
    {
      id: 'activity',
      type: 'single',
      question: 'How active are you weekly?',
      options: [
        { value: 'high', label: 'Highly active' },
        { value: 'moderate', label: 'Moderately active' },
        { value: 'rarely', label: 'Rarely active' },
      ],
    },
    {
      id: 'nutrition',
      type: 'single',
      question: 'How would you describe your diet?',
      options: [
        { value: 'balanced', label: 'Balanced' },
        { value: 'average', label: 'Average' },
        { value: 'improve', label: 'Needs improvement' },
      ],
    },
    {
      id: 'stress',
      type: 'single',
      question: 'How often do you experience stress?',
      options: [
        { value: 'frequently', label: 'Frequently' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'rarely', label: 'Rarely' },
      ],
    },
    {
      id: 'goals',
      type: 'multi',
      question: 'What are your wellness goals?',
      subtitle: 'Choose as many as you’d like.',
      options: [
        { value: 'fitness', label: 'Better fitness' },
        { value: 'energy', label: 'More energy' },
        { value: 'sleep', label: 'Better sleep' },
        { value: 'stress', label: 'Stress reduction' },
        { value: 'overall', label: 'Overall health improvement' },
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
      'Reviewing your wellness profile',
      'Identifying key focus areas',
      'Preparing your health insights',
    ],
  },

  getResult: (a) => {
    const poorSleep = a.sleep === '<5' || a.sleep === '5-7'
    const stressed = a.stress === 'frequently' || a.stress === 'sometimes'
    const unhealthy =
      a.lifestyle === 'improve' || a.nutrition === 'improve' || a.activity === 'rarely'

    let summary
    if (poorSleep && stressed && unhealthy) {
      summary =
        'Your wellness profile suggests opportunities to improve sleep, stress balance, and overall health habits.'
    } else if (poorSleep && stressed) {
      summary =
        'Your wellness profile suggests that sleep and stress are key areas to focus on first.'
    } else if (unhealthy) {
      summary =
        'Your wellness profile suggests a few lifestyle habits we can help you strengthen.'
    } else {
      summary =
        'Your wellness profile looks strong — here’s how to maintain and build on it.'
    }

    const insights = []
    if (poorSleep) insights.push('Consistent 7–9 hours of sleep improves nearly every health marker.')
    if (stressed) insights.push('Managing stress supports heart, sleep and metabolic health.')
    if (a.nutrition === 'improve' || a.nutrition === 'average') {
      insights.push('Small, sustainable nutrition changes deliver outsized results.')
    }

    const recommendations = [
      { title: 'Preventive wellness plan', description: 'A proactive plan to stay ahead of health risks.' },
    ]
    if (poorSleep) {
      recommendations.push({ title: 'Sleep improvement', description: 'Build a routine that restores deep, quality sleep.' })
    }
    recommendations.push({ title: 'Nutrition guidance', description: 'Personalized, realistic nutrition recommendations.' })
    if (stressed) {
      recommendations.push({ title: 'Stress management', description: 'Evidence-based tools to lower daily stress.' })
    }

    return {
      heading: 'Your personalized health insights',
      summary,
      insights,
      recommendationsTitle: 'Recommended for you',
      recommendations,
      ctas: [{ label: 'View Health Insights' }, { label: 'Continue Wellness Plan' }],
      disclaimer:
        'This is not a medical diagnosis. A licensed provider will review your information.',
    }
  },
}

export default healthCheckAssessmentConfig
