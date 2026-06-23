import { useEffect } from 'react'

// =============================================
// useScrollLock — global background scroll lock for overlays
// ---------------------------------------------
// Locks page scroll while an overlay (offcanvas / sidebar / modal) is open,
// WITHOUT the layout shift / flicker that a plain `overflow: hidden` causes.
//
// Removing the vertical scrollbar reclaims its width (~15px on desktop), which
// makes the centered page reflow sideways for a frame — the "flicker". We
// compensate by adding that exact width back as body padding-right while
// locked, so nothing moves. When unlocked, the original inline styles are
// restored, so there is zero visual change when no overlay is open.
//
// A module-level ref count coordinates multiple simultaneously-open overlays:
// the lock is applied once (on the first) and released once (after the last),
// so overlays never double-pad or restore early while another is still open.
// =============================================

let lockCount = 0
let savedOverflow = ''
let savedPaddingRight = ''

const applyLock = () => {
  const { body } = document
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  // Capture whatever was set inline so we can restore it exactly.
  savedOverflow = body.style.overflow
  savedPaddingRight = body.style.paddingRight

  body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    const basePadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0
    body.style.paddingRight = `${basePadding + scrollbarWidth}px`
  }
}

const releaseLock = () => {
  const { body } = document
  body.style.overflow = savedOverflow
  body.style.paddingRight = savedPaddingRight
}

/**
 * @param {boolean} locked — whether the page scroll should be locked.
 */
export default function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined

    if (lockCount === 0) applyLock()
    lockCount += 1

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) releaseLock()
    }
  }, [locked])
}
