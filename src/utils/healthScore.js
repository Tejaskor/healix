/**
 * Health-score calculation — combines 5 dimensions into a 0–100 score.
 *
 * Each dimension is normalised against a target and contributes equally
 * (20 points). Capped at 100 so a single over-achievement doesn't paper
 * over a weakness in another area.
 *
 * Dimensions
 *   1. Steps     vs stepsGoal       (10k/day default)
 *   2. Sleep     vs sleepGoal       (8h default)
 *   3. Water     vs waterGoal       (2.5L default)
 *   4. Workouts  vs workoutsGoal    (5/wk default)
 *   5. BMI       — best score at BMI 22, falls off either side
 */

const clamp01 = (n) => Math.max(0, Math.min(1, n))

const bmiScore = (bmi) => {
  if (bmi == null) return 0.5 // neutral when unknown — doesn't punish the user
  // Triangular curve peaking at 22, zero by 16 or 32.
  const dist = Math.abs(bmi - 22)
  if (dist <= 2) return 1
  if (dist <= 6) return 1 - (dist - 2) / 4 // 0..1
  return 0
}

export const calculateHealthScore = (m) => {
  if (!m) return 0
  const steps    = clamp01((m.steps          || 0) / (m.stepsGoal    || 10000))
  const sleep    = clamp01((m.sleepHours     || 0) / (m.sleepGoal    || 8))
  const water    = clamp01((m.waterIntake    || 0) / (m.waterGoal    || 2.5))
  // The "activity" dimension is calorie burn — workouts as a separate
  // dimension was removed when the workout option was dropped from the
  // dashboard. Calories captures both manual entries and any future
  // wearable-driven calorie sync, so the score scales naturally.
  const activity = clamp01((m.caloriesBurned || 0) / (m.caloriesGoal || 700))
  const bmi = bmiScore(m.bmi)
  return Math.round((steps + sleep + water + activity + bmi) * 20)
}

/**
 * Generate a short list of contextual recommendations based on which
 * dimensions are below their target. Returns at most 3 items so the UI
 * stays scannable.
 */
export const buildRecommendations = (m) => {
  if (!m) return []
  const list = []

  if ((m.sleepHours || 0) < (m.sleepGoal || 8) - 1) {
    list.push({
      tone: 'warn',
      title: 'Your sleep is below average this week',
      body: `You’re averaging ${m.sleepHours}h — aim for ${m.sleepGoal}h to support recovery.`,
    })
  }
  if ((m.waterIntake || 0) < (m.waterGoal || 2.5) - 0.5) {
    list.push({
      tone: 'info',
      title: 'Try increasing your water intake',
      body: `You’ve had ${m.waterIntake}L today — a glass every 90 minutes keeps you on track.`,
    })
  }
  if ((m.steps || 0) >= (m.stepsGoal || 10000) * 0.8) {
    list.push({
      tone: 'good',
      title: 'Great progress this week',
      body: `${m.steps.toLocaleString()} steps — almost at your daily goal. Keep going!`,
    })
  }
  if ((m.caloriesBurned || 0) >= (m.caloriesGoal || 700) * 0.8) {
    list.push({
      tone: 'good',
      title: 'You’re close to your calorie goal',
      body: `${m.caloriesBurned} of ${m.caloriesGoal} kcal burned today.`,
    })
  }
  if (list.length === 0) {
    list.push({
      tone: 'info',
      title: 'You’re right on track',
      body: 'All your daily metrics look balanced. Keep doing what you’re doing.',
    })
  }
  return list.slice(0, 3)
}
