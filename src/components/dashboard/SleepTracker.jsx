import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon } from 'lucide-react'
import { logSleep } from '@/lib/supabaseLogs'

/**
 * Last-night-sleep tracker. Number input + Save button. Shows the
 * already-logged value (if any) above the input.
 */
const SleepTracker = ({ currentHours, goalHours = 8, onLogged, patch }) => {
  const [hours, setHours] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(null), 1800)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const n = Number(hours)
    if (!Number.isFinite(n) || n <= 0 || n > 24) {
      showToast('Enter a value between 0 and 24')
      return
    }
    const prev = currentHours
    const rounded = +n.toFixed(1)
    setBusy(true)
    // Optimistic — sleep is a "latest value", not additive.
    patch?.({ sleepHours: rounded })
    showToast(`${n}h logged ✅`)
    setHours('')
    const { error } = await logSleep({ hours: rounded })
    setBusy(false)
    if (error) {
      patch?.({ sleepHours: prev })
      showToast('Could not save — try again')
      return
    }
    onLogged?.()
  }

  return (
    <section className="dash-card dash-tracker dash-tracker--sleep">
      <header className="dash-card__header">
        <h2 className="dash-card__title">
          <Moon size={16} strokeWidth={2} className="dash-card__title-icon" />
          Log Last Night&rsquo;s Sleep
        </h2>
      </header>

      {currentHours != null && currentHours > 0 ? (
        <p className="dash-tracker__value">
          <strong>{currentHours}</strong>
          <span> h</span>
          <em> / {goalHours} h logged</em>
        </p>
      ) : (
        <p className="dash-tracker__value dash-tracker__value--muted">
          Nothing logged yet — add your hours below.
        </p>
      )}

      <form onSubmit={handleSubmit} className="dash-tracker__form">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          max="24"
          step="0.5"
          className="dash-tracker__input"
          placeholder="Hours, e.g. 7.5"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          aria-label="Hours of sleep last night"
        />
        <button
          type="submit"
          className="dash-btn dash-btn--primary"
          disabled={busy || !hours}
        >
          {busy ? 'Saving…' : 'Save'}
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

export default SleepTracker
