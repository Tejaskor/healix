import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  todayWaterTotal,
  lastNightSleep,
  todaySteps,
  todayCalorieTotal,
  latestWeight,
  weeklyActivity,
  currentStreak,
} from '@/lib/supabaseLogs'

/**
 * Real per-user dashboard data, fully Supabase-backed.
 *
 *   - Name / email / assessment-derived BMI from AuthContext
 *   - Live values from Supabase log tables: water / sleep / steps /
 *     calories / weight / weekly activity / streak
 *
 * Non-flashing refresh model
 * --------------------------------------------------------------------
 *   - `loading` is TRUE only on the very first fetch. After that, every
 *     refresh keeps the previous data visible while the new query is
 *     in-flight (stale-while-revalidate). Nothing unmounts; the
 *     dashboard never goes blank between updates.
 *   - `isRefreshing` exposes the soft "we're re-fetching" state, in
 *     case a section wants a subtle indicator. Not required for use.
 *   - `patch(mutations)` is the optimistic-update entrypoint: callers
 *     apply the change locally for instant feedback, then fire-and-
 *     forget the real Supabase write. When refresh() runs in the
 *     background, the real value reconciles transparently. If the
 *     write fails, the caller is expected to call patch() to roll back.
 *
 * Returns { loading, isRefreshing, error, data, refresh, patch }.
 */
export const useDashboardData = () => {
  const { user, assessmentData } = useAuth()

  // loading is one-shot — true for the FIRST fetch, false forever after.
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [logs, setLogs] = useState(null)

  // Track whether the initial load has completed so refresh() knows not
  // to toggle the `loading` flag a second time.
  const didFirstFetchRef = useRef(false)

  // Derive name/email/assessment values from the existing AuthContext.
  const profile = useMemo(() => {
    const fullName = user?.fullName?.trim() || ''
    const firstName =
      fullName.split(/\s+/)[0] ||
      user?.email?.split('@')[0] ||
      'there'
    const answers = assessmentData || {}
    const currentWeight = Number(answers.weight) || null
    const heightCm = Number(answers.height) || null
    const targetWeight = heightCm
      ? +(22 * (heightCm / 100) * (heightCm / 100)).toFixed(1)
      : null
    const bmi =
      heightCm && currentWeight
        ? +(currentWeight / Math.pow(heightCm / 100, 2)).toFixed(1)
        : null
    return {
      name: firstName,
      email: user?.email || '',
      currentWeight,
      heightCm,
      targetWeight,
      bmi,
    }
  }, [user, assessmentData])

  const fetchAll = useCallback(async () => {
    if (!user?.email) {
      setLogs(null)
      setLoading(false)
      return
    }
    // Only flip `loading` on the very first call. Every subsequent
    // refresh runs as a non-blocking background fetch — `isRefreshing`
    // moves but `loading` stays false, so consumers don't unmount.
    if (!didFirstFetchRef.current) setLoading(true)
    setIsRefreshing(true)
    setError(null)
    try {
      const [
        waterMl,
        sleep,
        steps,
        manualCalories,
        weight,
        weekly,
        streak,
      ] = await Promise.all([
        todayWaterTotal(),
        lastNightSleep(),
        todaySteps(),
        todayCalorieTotal(),
        latestWeight(),
        weeklyActivity(),
        currentStreak(),
      ])

      const firstErr =
        waterMl.error || sleep.error || steps.error ||
        manualCalories.error || weight.error || weekly.error || streak.error

      setLogs({
        waterMl: waterMl.data || 0,
        sleepHours: sleep.data,
        steps: steps.data || 0,
        manualCalories: manualCalories.data || 0,
        latestWeightKg: weight.data,
        weekly: weekly.data || [],
        streakDays: streak.data || 0,
      })
      if (firstErr) setError(firstErr)
    } catch (err) {
      setError(err)
    } finally {
      didFirstFetchRef.current = true
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [user?.email])

  useEffect(() => { fetchAll() }, [fetchAll])

  /**
   * Apply an optimistic patch to the local `logs` state. This is what
   * makes button clicks feel instant — the tracker calls patch() before
   * even sending the Supabase write, so the UI updates this frame.
   *
   * Each property accepts a function `(prev) => next` for safe additive
   * updates, OR a raw value to replace.
   *
   *   patch({ waterMl: (prev) => prev + 250 })
   *   patch({ sleepHours: 7.5 })
   *
   * Background fetchAll() will overwrite these with authoritative values
   * — usually identical, but if the write failed the truth wins.
   */
  const patch = useCallback((mutations) => {
    if (!mutations) return
    setLogs((prev) => {
      if (!prev) return prev
      const next = { ...prev }
      for (const k of Object.keys(mutations)) {
        const v = mutations[k]
        next[k] = typeof v === 'function' ? v(prev[k] ?? 0) : v
      }
      return next
    })
  }, [])

  // Sensible per-user goals. When you later let users edit these,
  // pull from a `profiles.daily_goals` JSONB column.
  const goals = {
    stepsGoal: 10000,
    waterGoal: 2.5,
    sleepGoal: 8,
    caloriesGoal: 700,
  }

  const data = useMemo(() => {
    if (!logs) return null

    const waterIntake = +(logs.waterMl / 1000).toFixed(2)
    const sleepHours = logs.sleepHours ?? 0
    const steps = logs.steps
    const caloriesBurned = logs.manualCalories || 0
    const streakDays = logs.streakDays
    const weeklyProgress = logs.weekly
    const currentWeight = logs.latestWeightKg ?? profile.currentWeight

    const hasAnyLogs =
      waterIntake > 0 ||
      sleepHours > 0 ||
      steps > 0 ||
      caloriesBurned > 0 ||
      weeklyProgress.some((d) => d.value > 0)

    return {
      ...profile,
      currentWeight,
      steps,
      waterIntake,
      sleepHours,
      caloriesBurned,
      streakDays,
      weeklyProgress,
      hasAnyLogs,
      ...goals,
    }
  }, [logs, profile])

  return { loading, isRefreshing, error, data, refresh: fetchAll, patch }
}
