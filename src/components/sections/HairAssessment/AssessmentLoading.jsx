import { useEffect, useState } from 'react'

// Reusable "Analyzing your responses…" loading screen shown between the last
// question and the personalized result. Rotating messages are config-driven
// with a sensible default. Uses the shared `ha-` styling/animations.
const DEFAULT_MESSAGES = [
  'Reviewing your wellness patterns',
  'Matching the best treatment options',
  'Preparing personalized recommendations',
]

const AssessmentLoading = ({ config }) => {
  const title = config?.title || 'Analyzing your responses…'
  const messages =
    config?.messages && config.messages.length ? config.messages : DEFAULT_MESSAGES

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return undefined
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 900)
    return () => clearInterval(id)
  }, [messages.length])

  return (
    <div className="ha-loading">
      <div className="ha-loading__spinner" aria-hidden="true" />
      <h2 className="ha-loading__title">{title}</h2>
      {/* key swaps the node so the fade-in animation replays each message */}
      <p key={index} className="ha-loading__msg">
        {messages[index]}
      </p>
    </div>
  )
}

export default AssessmentLoading
