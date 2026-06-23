import { useEffect, useState, lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * GlobalSidebar — performance-optimised wrapper.
 *
 * Mounted once at the router root so the main-menu offcanvas is available
 * on every route — including standalone pages like /labs that don't render
 * the Navbar layout.
 *
 * Open it from anywhere by dispatching either event:
 *   window.dispatchEvent(new Event('open-sidebar'))
 *   window.dispatchEvent(new CustomEvent('reopen-sidebar', { detail: { menu: 'main' | 'wl-rich' } }))
 *
 * Performance: the heavy 500+ line panel + its data + the SCSS rules used
 * only inside the sidebar are lazy-loaded. The wrapper below ships a few
 * dozen bytes to every route; the real panel chunk is only fetched the first
 * time a user opens the menu. The first event's `detail.menu` is captured
 * here and forwarded as `seedMenu` so the panel renders open in the correct
 * sub-menu state on its very first paint — no missed-event flicker.
 */
const SidebarPanel = lazy(() => import('./SidebarPanel'))

const GlobalSidebar = () => {
  const [seedMenu, setSeedMenu] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (seedMenu) return
    const handler = (e) => {
      // Mirror the original "default the rich sidebar on WL pages" behaviour
      // so the first event reaches the panel with the correct seed menu.
      // Subsequent events (after the panel has mounted) are handled by the
      // panel's own listener, which re-evaluates this on each fire.
      const isWeightLoss =
        location.pathname === '/weight-loss' ||
        location.pathname === '/membership' ||
        location.pathname === '/faqs' ||
        location.pathname === '/science'
      const menu =
        (e && e.detail && e.detail.menu) || (isWeightLoss ? 'wl-rich' : 'main')
      setSeedMenu(menu)
    }
    window.addEventListener('open-sidebar', handler)
    window.addEventListener('reopen-sidebar', handler)
    return () => {
      window.removeEventListener('open-sidebar', handler)
      window.removeEventListener('reopen-sidebar', handler)
    }
  }, [seedMenu, location.pathname])

  if (!seedMenu) return null

  return (
    <Suspense fallback={null}>
      <SidebarPanel seedMenu={seedMenu} />
    </Suspense>
  )
}

export default GlobalSidebar
