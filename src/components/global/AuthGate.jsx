import { useEffect, useState, lazy, Suspense } from 'react'

/**
 * Global owner of the auth offcanvas.
 *
 * Performance: the heavy <OffcanvasAuth> tree (LoginForm + SignupForm + their
 * SCSS) is now lazy-loaded. It does not ship in the initial JS bundle, only
 * when the user (or any code path) dispatches the `open-auth` event for the
 * first time. Until then we render nothing — the bundle bytes for this
 * subtree never leave the server.
 *
 * Trigger from anywhere:
 *   window.dispatchEvent(new CustomEvent('open-auth', { detail: { view: 'login' } }))
 *
 * Or (preferred) use <LoginButton /> from @/components/common/LoginButton.
 */

const OffcanvasAuth = lazy(() =>
  import('@/components/sections/AuthOffcanvas/OffcanvasAuth')
)

const AuthGate = () => {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('login')

  useEffect(() => {
    const handler = (e) => {
      setView((e && e.detail && e.detail.view) || 'login')
      setMounted(true)
      setOpen(true)
    }
    window.addEventListener('open-auth', handler)
    return () => window.removeEventListener('open-auth', handler)
  }, [])

  // Don't pay for the offcanvas chunk until the user actually triggers auth.
  if (!mounted) return null

  return (
    <Suspense fallback={null}>
      <OffcanvasAuth
        isOpen={open}
        onClose={() => setOpen(false)}
        initialView={view}
      />
    </Suspense>
  )
}

export default AuthGate
