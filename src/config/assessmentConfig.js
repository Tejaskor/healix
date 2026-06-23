const assessmentConfig = {
  questions: [
    {
      id: 'goal',
      type: 'card',
      question: 'What brings you here today?',
      subtitle: 'Select your primary goal.',
      options: [
        { value: 'weight', label: 'Weight loss', icon: '⚖️', description: 'Lose weight with clinical support' },
        { value: 'labs', label: 'Lab testing', icon: '🧪', description: 'Test for 1,000+ health signals' },
        { value: 'hair', label: 'Hair regrowth', icon: '💇', description: 'Treat hair loss' },
        { value: 'mental', label: 'Mental health', icon: '🧠', description: 'Anxiety or depression support' },
      ],
    },
    {
      id: 'sex',
      type: 'single',
      question: 'What is your sex assigned at birth?',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
    },
    {
      id: 'age',
      type: 'input',
      question: 'How old are you?',
      subtitle: 'We use this to personalize your plan.',
      inputType: 'number',
      placeholder: 'Enter age',
      suffix: 'yrs',
      validation: {
        required: true,
        validate: (v) => {
          const n = Number(v)
          if (!Number.isFinite(n)) return 'Enter a valid number'
          if (n < 18) return 'You must be at least 18'
          if (n > 100) return 'Enter a realistic age'
          return true
        },
      },
    },
    {
      id: 'weight',
      type: 'slider',
      question: 'What is your current weight?',
      min: 80,
      max: 400,
      step: 1,
      default: 180,
      suffix: ' lbs',
      condition: (answers) => answers.goal === 'weight',
    },
    {
      id: 'conditions',
      type: 'multi',
      question: 'Do any of these apply to you?',
      subtitle: 'Select all that apply.',
      options: [
        { value: 'diabetes', label: 'Diabetes' },
        { value: 'bp', label: 'High blood pressure' },
        { value: 'thyroid', label: 'Thyroid issues' },
        { value: 'none', label: 'None of the above' },
      ],
      validation: { min: 1 },
    },
    {
      id: 'prior',
      type: 'yesno',
      question: 'Have you tried prescription treatment before?',
    },
    {
      id: 'email',
      type: 'input',
      question: "What's your email?",
      subtitle: 'So we can send your personalized plan.',
      inputType: 'email',
      placeholder: 'you@example.com',
      validation: {
        required: true,
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email',
      },
    },
  ],

  getResult: (answers) => {
    const goalMap = {
      weight: 'Your Weight Loss plan is ready',
      labs: 'Your Lab Testing plan is ready',
      hair: 'Your Hair Regrowth plan is ready',
      mental: 'Your Mental Health plan is ready',
    }
    return {
      title: goalMap[answers.goal] || 'Your personalized plan is ready',
      description: 'Based on your answers, we matched you with the right approach. Continue to view the full plan.',
      ctaLabel: 'View my plan',
    }
  },
}

export default assessmentConfig
