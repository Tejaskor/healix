import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplet, Plus, RotateCcw } from 'lucide-react'
import { logWater, resetTodayWater } from '@/lib/supabaseLogs'

/**
 * Water-intake tracker.
 *
 *   - Buttons: +250 ml, +500 ml, Reset
 *   - Today's total is bound to the dashboard data (passed as `currentMl`).
 *   - After each successful log, calls `onLogged()` so the parent can
 *     re-fetch the whole dashboard hook (single source of truth).
 *   - Optimistic local toast on every successful action.
 *
 * Goal default 3000 ml; can be made user-configurable later.
 */
const WaterTracker = ({ currentMl = 0, goalMl = 3000, onLogged, patch }) => {
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)

  const pct = Math.min(100, Math.round((currentMl / goalMl) * 100))
  const litres = (currentMl / 1000).toFixed(1)
  const goalLitres = (goalMl / 1000).toFixed(0)

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(null), 1800)
  }

  const handleAdd = async (amount) => {
    if (busy) return
    setBusy(true)
    // 1. Optimistic patch — the dashboard updates this frame.
    patch?.({ waterMl: (prev) => (prev || 0) + amount })
    showToast(`+${amount} ml logged ✅`)
    // 2. Persist in background.
    const { error } = await logWater({ amountMl: amount })
    setBusy(false)
    if (error) {
      // 3a. Roll back the optimistic add.
      patch?.({ waterMl: (prev) => Math.max(0, (prev || 0) - amount) })
      showToast('Could not save — try again')
      return
    }
    // 3b. Silent reconcile (chart, streak, score) without flashing.
    onLogged?.()
  }

  const handleReset = async () => {
    if (busy) return
    const prevMl = currentMl
    setBusy(true)
    patch?.({ waterMl: 0 })
    showToast('Today’s water reset')
    const { error } = await resetTodayWater()
    setBusy(false)
    if (error) {
      patch?.({ waterMl: prevMl })
      showToast('Could not reset')
      return
    }
    onLogged?.()
  }

  return (
    <section className="dash-card dash-tracker dash-tracker--water">
      <header className="dash-card__header">
        <h2 className="dash-card__title">
          <Droplet size={16} strokeWidth={2} className="dash-card__title-icon" />
          Today&rsquo;s Water Intake
        </h2>
      </header>

      <p className="dash-tracker__value">
        <strong>{litres}</strong>
        <span> L</span>
        <em> / {goalLitres} L</em>
      </p>

      <div className="dash-tracker__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <motion.span
          className="dash-tracker__fill"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="dash-tracker__actions">
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => handleAdd(250)}
          disabled={busy}
        >
          <Plus size={14} strokeWidth={2.4} /> 250 ml
        </button>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => handleAdd(500)}
          disabled={busy}
        >
          <Plus size={14} strokeWidth={2.4} /> 500 ml
        </button>
        <button
          type="button"
          className="dash-btn dash-btn--ghost"
          onClick={handleReset}
          disabled={busy || currentMl === 0}
          aria-label="Reset today's water"
        >
          <RotateCcw size={14} strokeWidth={2.2} /> Reset
        </button>
      </div>

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

export default WaterTracker
