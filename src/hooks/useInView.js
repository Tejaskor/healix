import { useState, useEffect, useRef } from 'react'

/**
 * useInView — triggers once when element enters viewport.
 *
 * HOW IT WORKS:
 * - Creates an IntersectionObserver that watches a ref element
 * - When the element is visible by `threshold` (default 20%),
 *   `isInView` flips to true and the observer disconnects
 * - This means the animation only fires ONCE (no re-triggering)
 *
 * @param {number} threshold — 0 to 1, how much must be visible
 * @returns {{ ref, isInView }}
 */
const useInView = (threshold = 0.2) => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect() // fire once, then stop watching
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

export default useInView
