import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Footprints, Plus, RotateCcw } from 'lucide-react'
import { logSteps, resetTodaySteps } from '@/lib/supabaseLogs'

/**
 * Step tracker — same pattern as WaterTracker.
 *   - Quick adds: +500, +1000, +2000
 *   - Custom input + Add
 *   - Reset clears today
 *
 * After each write, calls `onLogged()` so the dashboard hook re-fetches
 * and the chart / score / streak update with the new totals.
 */
const StepTracker = ({ currentSteps = 0, goalSteps = 10000, onLogged, patch }) => {
  const [custom, setCustom] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)

  const pct = Math.min(100, Math.round((currentSteps / goalSteps) * 100))

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(null), 1800)
  }

  const handleAdd = async (amount) => {
    if (busy || amount <= 0) return
    setBusy(true)
    patch?.({ steps: (prev) => (prev || 0) + amount })
    showToast(`+${amount.toLocaleString()} steps logged ✅`)
    const { error } = await logSteps({ steps: amount })
    setBusy(false)
    if (error) {
      patch?.({ steps: (prev) => Math.max(0, (prev || 0) - amount) })
      showToast('Could not save — try again')
      return
    }
    onLogged?.()
  }

  const handleCustom = async (e) => {
    e.preventDefault()
    const n = Math.round(Number(custom))
    if (!Number.isFinite(n) || n <= 0 || n > 100000) {
      showToast('Enter a value between 1 and 100,000')
      return
    }
    setCustom('')
    await handleAdd(n)
  }

  const handleReset = async () => {
    if (busy || currentSteps === 0) return
    const prev = currentSteps
    setBusy(true)
    patch?.({ steps: 0 })
    showToast('Today’s steps reset')
    const { error } = await resetTodaySteps()
    setBusy(false)
    if (error) {
      patch?.({ steps: prev })
      showToast('Could not reset')
      return
    }
    onLogged?.()
  }

  return (
    <section className="dash-card dash-tracker dash-tracker--steps">
      <header className="dash-card__header">
        <h2 className="dash-card__title">
          <Footprints size={16} strokeWidth={2} className="dash-card__title-icon" />
          Today&rsquo;s Steps
        </h2>
      </header>

      {currentSteps === 0 ? (
        <p className="dash-tracker__value dash-tracker__value--muted">
          No steps logged today — add some below.
        </p>
      ) : (
        <p className="dash-tracker__value">
          <strong>{currentSteps.toLocaleString()}</strong>
          <em> / {goalSteps.toLocaleString()}</em>
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
        <button type="button" className="dash-btn dash-btn--primary" onClick={() => handleAdd(500)} disabled={busy}>
          <Plus size={14} strokeWidth={2.4} /> 500
        </button>
        <button type="button" className="dash-btn dash-btn--primary" onClick={() => handleAdd(1000)} disabled={busy}>
          <Plus size={14} strokeWidth={2.4} /> 1,000
        </button>
        <button type="button" className="dash-btn dash-btn--primary" onClick={() => handleAdd(2000)} disabled={busy}>
          <Plus size={14} strokeWidth={2.4} /> 2,000
        </button>
        <button
          type="button"
          className="dash-btn dash-btn--ghost"
          onClick={handleReset}
          disabled={busy || currentSteps === 0}
          aria-label="Reset today's steps"
        >
          <RotateCcw size={14} strokeWidth={2.2} /> Reset
        </button>
      </div>

      <form onSubmit={handleCustom} className="dash-tracker__form">
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="100000"
          step="1"
          className="dash-tracker__input"
          placeholder="Custom — e.g. 3,200"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          aria-label="Custom step amount"
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

export default StepTracker
