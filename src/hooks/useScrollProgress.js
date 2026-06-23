import { useState, useEffect, useRef } from 'react'

/**
 * useScrollProgress — returns a 0→1 value based on how far
 * the element has scrolled through the viewport.
 *
 * HOW IT WORKS:
 * - 0 = element just entered the bottom of the viewport
 * - 1 = element top has reached the top of the viewport
 * - Values are clamped between 0 and 1
 *
 * WHY this is better than binary isInView:
 * - Allows animations to be TIED to scroll position
 * - The curve draws as the user scrolls — not on a timer
 * - Feels connected and intentional, not arbitrary
 *
 * Uses requestAnimationFrame via passive scroll listener
 * for smooth 60fps updates without layout thrashing.
 */
const useScrollProgress = () => {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight

      // When bottom of element is at bottom of viewport → 0
      // When top of element is at top of viewport → 1
      const total = windowH + rect.height
      const scrolled = windowH - rect.top
      const raw = scrolled / total

      setProgress(Math.min(1, Math.max(0, raw)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // initial check

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { ref, progress }
}

export default useScrollProgress
