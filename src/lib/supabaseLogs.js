import { supabase } from './supabase'

/**
 * Thin data-access layer for per-user tracking logs.
 *
 * All functions assume the caller is authenticated (RLS policies in
 * Supabase ensure auth.uid() = user_id on every read/write) and that
 * the corresponding tables exist — see the SETUP_SQL block in the
 * dashboard recap. Each function returns `{ data, error }` so callers
 * can pattern-match cleanly:
 *
 *   const { data, error } = await todayWaterTotal()
 *
 * Dates are handled in UTC; "today" means since 00:00 UTC. Adjust if
 * you later add per-user timezone.
 */

const startOfTodayISO = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

const startOfWeekISO = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  // Treat Monday as the start of the week (matches the Mon-Sun chart).
  const day = d.getDay() // 0=Sun..6=Sat
  const back = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - back)
  return d.toISOString()
}

// ─── WATER ─────────────────────────────────────────────────────────

export const todayWaterTotal = async () => {
  const { data, error } = await supabase
    .from('water_logs')
    .select('amount_ml')
    .gte('logged_at', startOfTodayISO())
  if (error) return { data: 0, error }
  const totalMl = (data || []).reduce((s, r) => s + (r.amount_ml || 0), 0)
  return { data: totalMl, error: null }
}

export const logWater = async ({ amountMl }) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not signed in') }
  const { data, error } = await supabase
    .from('water_logs')
    .insert({ user_id: user.id, amount_ml: amountMl })
    .select()
    .single()
  return { data, error }
}

export const resetTodayWater = async () => {
  const { data, error } = await supabase
    .from('water_logs')
    .delete()
    .gte('logged_at', startOfTodayISO())
  return { data, error }
}

// ─── SLEEP ─────────────────────────────────────────────────────────

export const lastNightSleep = async () => {
  // Most-recent sleep entry within the last 18h covers naps + last night.
  const since = new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('hours, logged_at')
    .gte('logged_at', since)
    .order('logged_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) return { data: null, error }
  return { data: data?.hours ?? null, error: null }
}

export const logSleep = async ({ hours }) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not signed in') }
  const { data, error } = await supabase
    .from('sleep_logs')
    .insert({ user_id: user.id, hours })
    .select()
    .single()
  return { data, error }
}

// ─── WORKOUT / STEPS / WEIGHT / TASKS ──────────────────────────────
// Stubs — follow the same pattern as water/sleep above when you wire
// these up. Each table is created in the SETUP_SQL block.

export const todayWorkoutTotals = async () => {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('duration_minutes, calories_burned')
    .gte('logged_at', startOfTodayISO())
  if (error) return { data: null, error }
  const totals = (data || []).reduce(
    (acc, r) => ({
      durationMinutes: acc.durationMinutes + (r.duration_minutes || 0),
      caloriesBurned: acc.caloriesBurned + (r.calories_burned || 0),
      count: acc.count + 1,
    }),
    { durationMinutes: 0, caloriesBurned: 0, count: 0 }
  )
  return { data: totals, error: null }
}

export const todaySteps = async () => {
  const { data, error } = await supabase
    .from('step_logs')
    .select('steps')
    .gte('logged_at', startOfTodayISO())
  if (error) return { data: 0, error }
  return { data: (data || []).reduce((s, r) => s + (r.steps || 0), 0), error: null }
}

export const logSteps = async ({ steps }) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not signed in') }
  const { data, error } = await supabase
    .from('step_logs')
    .insert({ user_id: user.id, steps })
    .select()
    .single()
  return { data, error }
}

export const resetTodaySteps = async () => {
  const { data, error } = await supabase
    .from('step_logs')
    .delete()
    .gte('logged_at', startOfTodayISO())
  return { data, error }
}

// ─── MANUAL CALORIES (calorie_logs) ────────────────────────────────
// Separate from workout_logs.calories_burned: this table captures
// non-workout activity (walks, chores, daily burn estimates). The
// dashboard's "Calories" tile sums BOTH sources so either flow keeps
// the metric meaningful.

export const todayCalorieTotal = async () => {
  const { data, error } = await supabase
    .from('calorie_logs')
    .select('calories')
    .gte('logged_at', startOfTodayISO())
  if (error) return { data: 0, error }
  return { data: (data || []).reduce((s, r) => s + (r.calories || 0), 0), error: null }
}

export const logCalories = async ({ calories }) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not signed in') }
  const { data, error } = await supabase
    .from('calorie_logs')
    .insert({ user_id: user.id, calories })
    .select()
    .single()
  return { data, error }
}

export const resetTodayCalories = async () => {
  const { data, error } = await supabase
    .from('calorie_logs')
    .delete()
    .gte('logged_at', startOfTodayISO())
  return { data, error }
}

export const latestWeight = async () => {
  const { data, error } = await supabase
    .from('weight_history')
    .select('weight_kg, logged_at')
    .order('logged_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) return { data: null, error }
  return { data: data?.weight_kg ?? null, error: null }
}

// ─── WEEKLY ACTIVITY (chart data) ──────────────────────────────────
// Returns an array of 7 daily entries (Mon..Sun) with `value` 0..100
// computed from the day's completion against simple defaults. Empty
// days emit value=0 so the chart can decide whether to render or to
// fall back to an empty state.

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const weeklyActivity = async () => {
  const since = startOfWeekISO()
  // 4 parallel queries — water + sleep + steps + (manual) calories.
  // workout_logs is no longer queried after the workout option was
  // removed from the dashboard.
  const [w, s, k, c] = await Promise.all([
    supabase.from('water_logs').select('amount_ml, logged_at').gte('logged_at', since),
    supabase.from('sleep_logs').select('hours, logged_at').gte('logged_at', since),
    supabase.from('step_logs').select('steps, logged_at').gte('logged_at', since),
    supabase.from('calorie_logs').select('calories, logged_at').gte('logged_at', since),
  ])

  const buckets = DAY_LABELS.map(() => ({ water: 0, sleep: 0, steps: 0, calories: 0 }))

  const dayIndex = (iso) => {
    const d = new Date(iso)
    const dow = d.getDay() // 0=Sun..6=Sat
    return dow === 0 ? 6 : dow - 1
  }

  for (const r of w.data || []) buckets[dayIndex(r.logged_at)].water    += r.amount_ml || 0
  for (const r of s.data || []) buckets[dayIndex(r.logged_at)].sleep     = Math.max(buckets[dayIndex(r.logged_at)].sleep, r.hours || 0)
  for (const r of k.data || []) buckets[dayIndex(r.logged_at)].steps    += r.steps     || 0
  for (const r of c.data || []) buckets[dayIndex(r.logged_at)].calories += r.calories  || 0

  return {
    data: buckets.map((b, i) => {
      const waterPct  = Math.min(1, b.water / 2500)
      const sleepPct  = Math.min(1, b.sleep / 8)
      const stepsPct  = Math.min(1, b.steps / 10000)
      const calsPct   = Math.min(1, b.calories / 700)
      // 4 dimensions equally weighted. Bar is 0–100% — a day with one
      // dimension fully met sits at 25%; a "complete" day hits 100%.
      const value = Math.round(((waterPct + sleepPct + stepsPct + calsPct) / 4) * 100)
      return {
        day: DAY_LABELS[i],
        value,
        calories: b.calories || 0,
        sleep: b.sleep || null,
      }
    }),
    error: null,
  }
}

// ─── STREAK ────────────────────────────────────────────────────────
// Day-counted streak: consecutive days back from today where the user
// logged any water OR sleep OR steps. Stops at the first empty day.

export const currentStreak = async () => {
  // Pull the last 90 days of activity, group by date, count back from today.
  // Any of water / sleep / steps / calories logged on a given day keeps
  // that day in the set.
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const [w, s, k, c] = await Promise.all([
    supabase.from('water_logs').select('logged_at').gte('logged_at', since),
    supabase.from('sleep_logs').select('logged_at').gte('logged_at', since),
    supabase.from('step_logs').select('logged_at').gte('logged_at', since),
    supabase.from('calorie_logs').select('logged_at').gte('logged_at', since),
  ])
  const dates = new Set()
  const add = (rows) => rows?.forEach((r) => {
    dates.add(new Date(r.logged_at).toDateString())
  })
  add(w.data); add(s.data); add(k.data); add(c.data)

  let count = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  while (dates.has(cursor.toDateString())) {
    count++
    cursor.setDate(cursor.getDate() - 1)
  }
  return { data: count, error: null }
}
