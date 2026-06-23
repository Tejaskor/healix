import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// =============================================
// Idle-time route prefetching
// ---------------------------------------------
// Once the current page is interactive, fire dynamic imports for the three
// most-likely-to-be-visited next pages and warm the browser cache for every
// page's hero image. Vite turns the dynamic imports into <link rel="modulepreload">
// hints; the `new Image()` tricks fetch the LCP asset of each route into the
// HTTP cache. Combined effect: when the user clicks a link, both the JS
// chunk AND the hero bytes are already local, so the next page paints
// effectively instantly.
//
// The work happens inside requestIdleCallback so it never competes with the
// current page's rendering. We also bail out early on Save-Data or 2G to
// respect users on metered/slow connections.
// =============================================
if (typeof window !== 'undefined') {
  // The hero LCP image for each route. Add new pages here as they go live.
  const heroImages = [
    '/images/h-labs-ATF-graph-T1-D-2.webp',     // /labs
    '/images/h_biomarker_hero-d-2.webp',        // /labs/what-we-test
    '/images/h-labs-AP-3-D.webp',               // /labs/cancer-screening (CSS bg)
    '/images/h-labs-AP-D.webp',                 // /labs/action-plan (CSS bg)
    '/images/h_bg.png',                          // /membership
    '/images/h_image1-1_l.webp',                // /weight-loss card 1
    '/images/h_image1-2_l.webp',                // /weight-loss card 1 pill
    '/images/h_image2_l.webp',                  // /weight-loss card 2
    '/images/image3_l.webp',                    // /weight-loss card 3
    '/images/card1-default-desktop.webp',       // homepage hero card 1
    '/images/card2-default-desktop.webp',       // homepage hero card 2
    '/images/card1-hover-desktop.webp',         // homepage hero card 1 hover
    '/images/card2-hover-desktop.webp',         // homepage hero card 2 hover
  ]

  const onSlowOrSavedConnection = () => {
    const c = navigator.connection
    if (!c) return false
    if (c.saveData) return true
    return c.effectiveType === '2g' || c.effectiveType === 'slow-2g'
  }

  const warmCache = () => {
    if (onSlowOrSavedConnection()) return

    // Module preload — chunks for the three highest-traffic routes.
    import('@/pages/WeightLossPage').catch(() => {})
    import('@/pages/LabsPage').catch(() => {})
    import('@/pages/MembershipPage').catch(() => {})

    // Image preload — every hero in one go. The browser fans these out
    // across its idle download slots without blocking interaction.
    heroImages.forEach((src) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
    })
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warmCache, { timeout: 3000 })
  } else {
    // Safari fallback — wait until after first paint so we don't compete
    // with hero decoding.
    setTimeout(warmCache, 2000)
  }
}
