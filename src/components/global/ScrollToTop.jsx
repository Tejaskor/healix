import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll to the top of the document whenever the route changes, so the
 * hero section of the incoming page is always the first thing the user sees.
 *
 * Mounted once inside <BrowserRouter> at the router root.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  // Turn off the browser's automatic scroll restoration so back/forward
  // navigations don't fight with our reset.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, search])

  return null
}

export default ScrollToTop
