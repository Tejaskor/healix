const healthAssessmentConfig = {
  questions: [
    {
      id: 'consent',
      type: 'multi',
      question: 'We\u2019ll personalize your plan',
      subtitle: 'Your answers help us tailor a safe, effective plan just for you.',
      options: [{ value: 'consent', label: 'I agree to share my health information to personalize my plan.' }],
      validation: { min: 1 },
    },
    {
      id: 'goal',
      type: 'single',
      question: 'What is your goal?',
      options: [
        { value: 'lose', label: 'Lose weight' },
        { value: 'maintain', label: 'Maintain weight' },
        { value: 'improve', label: 'Improve health' },
      ],
    },
    {
      id: 'targetLoss',
      type: 'single',
      question: 'How much weight do you want to lose?',
      condition: (a) => a.goal === 'lose',
      options: [
        { value: '2-5', label: '2\u20135 kg' },
        { value: '5-10', label: '5\u201310 kg' },
        { value: '10-20', label: '10\u201320 kg' },
        { value: '20+', label: '20+ kg' },
      ],
    },
    {
      id: 'age',
      type: 'input',
      question: 'How old are you?',
      inputType: 'number',
      placeholder: 'Enter age',
      suffix: 'yrs',
      validation: {
        required: true,
        validate: (v) => {
          const n = Number(v)
          if (!Number.isFinite(n)) return 'Enter a valid number'
          if (n < 18) return 'You must be 18 or older'
          if (n > 100) return 'Enter a realistic age'
          return true
        },
      },
    },
    {
      id: 'gender',
      type: 'single',
      question: 'What is your gender?',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'height',
      type: 'input',
      question: 'What is your height?',
      subtitle: 'Enter your height in centimeters.',
      inputType: 'number',
      placeholder: 'Enter height',
      suffix: 'cm',
      validation: {
        required: true,
        validate: (v) => {
          const n = Number(v)
          if (!Number.isFinite(n)) return 'Enter a valid number'
          if (n < 120 || n > 230) return 'Enter a realistic height in cm'
          return true
        },
      },
    },
    {
      id: 'weight',
      type: 'input',
      question: 'What is your current weight?',
      subtitle: 'Enter your weight in kilograms.',
      inputType: 'number',
      placeholder: 'Enter weight',
      suffix: 'kg',
      validation: {
        required: true,
        validate: (v) => {
          const n = Number(v)
          if (!Number.isFinite(n)) return 'Enter a valid number'
          if (n < 30 || n > 300) return 'Enter a realistic weight in kg'
          return true
        },
      },
    },
    {
      id: 'conditions',
      type: 'multi',
      question: 'Do any of these apply to you?',
      subtitle: 'Select all that apply.',
      options: [
        { value: 'diabetes', label: 'Diabetes' },
        { value: 'thyroid', label: 'Thyroid' },
        { value: 'bp', label: 'High blood pressure' },
        { value: 'pcos', label: 'PCOS' },
        { value: 'none', label: 'None' },
      ],
      validation: { min: 1 },
    },
    {
      id: 'medications',
      type: 'yesno',
      question: 'Are you currently taking any medications?',
    },
    {
      id: 'activity',
      type: 'single',
      question: 'What is your activity level?',
      options: [
        { value: 'sedentary', label: 'Sedentary' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'active', label: 'Active' },
      ],
    },
    {
      id: 'eating',
      type: 'single',
      question: 'How would you describe your eating habits?',
      options: [
        { value: 'healthy', label: 'Healthy' },
        { value: 'average', label: 'Average' },
        { value: 'junk', label: 'Junk-heavy' },
      ],
    },
    {
      id: 'openToTreatment',
      type: 'single',
      question: 'Are you open to treatments?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      id: 'comfortableWith',
      type: 'multi',
      question: 'Which approaches are you comfortable with?',
      subtitle: 'Select all that apply.',
      options: [
        { value: 'pills', label: 'Pills' },
        { value: 'injections', label: 'Injections' },
        { value: 'lifestyle', label: 'Lifestyle only' },
      ],
      validation: { min: 1 },
      condition: (a) => a.openToTreatment !== 'no',
    },
    {
      id: 'pregnant',
      type: 'yesno',
      question: 'Are you currently pregnant?',
      condition: (a) => a.gender === 'female',
    },
    {
      id: 'eatingDisorder',
      type: 'yesno',
      question: 'Do you have a history of an eating disorder?',
    },
  ],
  // BMI result is computed on the results page — engine just provides a generic closing.
  getResult: () => ({
    title: 'Building your plan\u2026',
    description: 'We are matching you with the right recommendation.',
    ctaLabel: 'See my plan',
  }),
}

export default healthAssessmentConfig
