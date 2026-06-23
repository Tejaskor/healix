import { useEffect, useState } from 'react'

const DEFAULT_TASKS = [
  { id: 'water', label: 'Drink 2L of water' },
  { id: 'walk', label: '30 min walk' },
  { id: 'meal', label: 'Healthy meal' },
  { id: 'sleep', label: '7+ hours of sleep' },
]

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5L20 7" />
  </svg>
)

const DailyTasks = ({ tasks = DEFAULT_TASKS }) => {
  // Persist checked tasks to localStorage per day, so progress carries over.
  const today = new Date().toISOString().slice(0, 10)
  const storageKey = `healix_tasks_${today}`

  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}') } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked))
  }, [checked, storageKey])

  const toggle = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }))
  const doneCount = tasks.filter((t) => checked[t.id]).length

  return (
    <section className="dash-card dash-tasks">
      <header className="dash-card__header">
        <h2 className="dash-card__title">Daily tasks</h2>
        <span className="dash-tasks__count">{doneCount}/{tasks.length}</span>
      </header>
      <ul className="dash-tasks__list">
        {tasks.map((t) => {
          const on = !!checked[t.id]
          return (
            <li key={t.id}>
              <button
                type="button"
                className={`dash-tasks__item ${on ? 'dash-tasks__item--done' : ''}`}
                onClick={() => toggle(t.id)}
                aria-pressed={on}
              >
                <span className={`dash-tasks__check ${on ? 'dash-tasks__check--on' : ''}`}>
                  {on && <CheckIcon />}
                </span>
                <span className="dash-tasks__label">{t.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default DailyTasks
