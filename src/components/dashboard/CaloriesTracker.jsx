import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Plus, RotateCcw } from 'lucide-react'
import { logCalories, resetTodayCalories } from '@/lib/supabaseLogs'

/**
 * Calorie-burn tracker — same pattern as WaterTracker / StepTracker.
 *   - Quick adds: +100, +250, +500 kcal
 *   - Custom input + Add
 *   - Reset clears today's MANUAL entries only (calorie_logs). Workout
 *     calories logged elsewhere are unaffected.
 *
 * `currentCalories` is the COMBINED today total (workouts + manual). The
 * reset button only deletes manual entries since this tracker is the
 * manual-entry surface; workout calories should be managed where they
 * were created.
 */
const CaloriesTracker = ({ currentCalories = 0, goalCalories = 700, onLogged, patch }) => {
  const [custom, setCustom] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)

  const pct = Math.min(100, Math.round((currentCalories / goalCalories) * 100))

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(null), 1800)
  }

  const handleAdd = async (amount) => {
    if (busy || amount <= 0) return
    setBusy(true)
    patch?.({ manualCalories: (prev) => (prev || 0) + amount })
    showToast(`+${amount} kcal logged ✅`)
    const { error } = await logCalories({ calories: amount })
    setBusy(false)
    if (error) {
      patch?.({ manualCalories: (prev) => Math.max(0, (prev || 0) - amount) })
      showToast('Could not save — try again')
      return
    }
    onLogged?.()
  }

  const handleCustom = async (e) => {
    e.preventDefault()
    const n = Math.round(Number(custom))
    if (!Number.isFinite(n) || n <= 0 || n > 5000) {
      showToast('Enter a value between 1 and 5000')
      return
    }
    setCustom('')
    await handleAdd(n)
  }

  const handleReset = async () => {
    if (busy) return
    const prev = currentCalories
    setBusy(true)
    patch?.({ manualCalories: 0 })
    showToast('Today’s manual calories reset')
    const { error } = await resetTodayCalories()
    setBusy(false)
    if (error) {
      patch?.({ manualCalories: prev })
      showToast('Could not reset')
      return
    }
    onLogged?.()
  }

  return (
    <section className="dash-card dash-tracker dash-tracker--calories">
      <header className="dash-card__header">
        <h2 className="dash-card__title">
          <Flame size={16} strokeWidth={2} className="dash-card__title-icon" />
          Calories Burned
        </h2>
      </header>

      {currentCalories === 0 ? (
        <p className="dash-tracker__value dash-tracker__value--muted">
          No calorie activity yet today — add some below.
        </p>
      ) : (
        <p className="dash-tracker__value">
          <strong>{currentCalories.toLocaleString()}</strong>
          <span> kcal</span>
          <em> / {goalCalories} kcal</em>
        </p>
      )}

      <div className="dash-tracker__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <motion.span
          className="dash-tracker__fill"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="dash-tracker__actions">
        <button type="button" className="dash-btn dash-btn--primary" onClick={() => handleAdd(100)} disabled={busy}>
          <Plus size={14} strokeWidth={2.4} /> 100
        </button>
        <button type="button" className="dash-btn dash-btn--primary" onClick={() => handleAdd(250)} disabled={busy}>
          <Plus size={14} strokeWidth={2.4} /> 250
        </button>
        <button type="button" className="dash-btn dash-btn--primary" onClick={() => handleAdd(500)} disabled={busy}>
          <Plus size={14} strokeWidth={2.4} /> 500
        </button>
        <button
          type="button"
          className="dash-btn dash-btn--ghost"
          onClick={handleReset}
          disabled={busy}
          aria-label="Reset today's manual calories"
        >
          <RotateCcw size={14} strokeWidth={2.2} /> Reset
        </button>
      </div>

      <form onSubmit={handleCustom} className="dash-tracker__form">
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="5000"
          step="1"
          className="dash-tracker__input"
          placeholder="Custom — e.g. 320"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          aria-label="Custom calorie amount"
        />
        <button type="submit" className="dash-btn dash-btn--primary" disabled={busy || !custom}>
          Add
        </button>
      </form>

      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast}
            className="dash-tracker__toast"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CaloriesTracker
