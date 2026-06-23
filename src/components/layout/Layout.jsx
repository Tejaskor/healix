import { useEffect, useState, lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar/AnnouncementBar'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

// =============================================
// Performance: defer offcanvases / assessments
// ---------------------------------------------
// LabsOffcanvas, WLOffcanvas, WegovyAssessment and HairAssessment are all
// invisible at first paint and only mount in response to user-driven events
// (`open-labs-offcanvas`, `open-wl-offcanvas`, `open-wegovy-assessment`,
// `open-hair-assessment`). Eagerly importing them used to inflate every
// route's initial JS bundle by the size of four heavy SCSS-laden trees.
// They are now lazy()-imported and gated behind an "armed" boolean — the
// chunk loads only after the first time the matching event fires.
// =============================================
const LabsOffcanvas = lazy(() => import('@/components/sections/LabsOffcanvas/LabsOffcanvas'))
const WLOffcanvas = lazy(() => import('@/components/sections/WLOffcanvas/WLOffcanvas'))
const WegovyAssessment = lazy(() => import('@/components/sections/WegovyAssessment/WegovyAssessment'))
const HairAssessment = lazy(() => import('@/components/sections/HairAssessment/HairAssessment'))
const SexAssessment = lazy(() => import('@/components/sections/SexAssessment/SexAssessment'))
const TestosteroneAssessment = lazy(() => import('@/components/sections/TestosteroneAssessment/TestosteroneAssessment'))
const HealthAssessment = lazy(() => import('@/components/sections/HealthAssessment/HealthAssessment'))

const Layout = () => {
  // Each offcanvas now has TWO bits of state:
  //   armed — has its trigger event ever fired? (controls whether we mount
  //           the lazy component at all)
  //   open  — is it currently visible? (passed to the component)
  const [labsArmed, setLabsArmed] = useState(false)
  const [labsOpen, setLabsOpen] = useState(false)
  const [labsFrom, setLabsFrom] = useState(null)

  const [wlArmed, setWlArmed] = useState(false)
  const [wlOpen, setWlOpen] = useState(false)
  const [wlFrom, setWlFrom] = useState(null)

  const [wegovyArmed, setWegovyArmed] = useState(false)
  const [wegovyOpen, setWegovyOpen] = useState(false)

  const [hairArmed, setHairArmed] = useState(false)
  const [hairOpen, setHairOpen] = useState(false)

  const [sexArmed, setSexArmed] = useState(false)
  const [sexOpen, setSexOpen] = useState(false)

  const [testosteroneArmed, setTestosteroneArmed] = useState(false)
  const [testosteroneOpen, setTestosteroneOpen] = useState(false)

  const [healthArmed, setHealthArmed] = useState(false)
  const [healthOpen, setHealthOpen] = useState(false)

  // NOTE: the auth offcanvas is mounted globally in <AuthGate /> at the
  // router root so it works on every page (including pages that don't use
  // this layout like /labs or /onboarding/*). Do not re-mount it here.
  useEffect(() => {
    const labsHandler = (e) => {
      setLabsFrom((e && e.detail && e.detail.from) || null)
      setLabsArmed(true)
      setLabsOpen(true)
    }
    const wlHandler = (e) => {
      setWlFrom((e && e.detail && e.detail.from) || null)
      setWlArmed(true)
      setWlOpen(true)
    }
    const wegovyHandler = () => {
      setWegovyArmed(true)
      setWegovyOpen(true)
    }
    const hairHandler = () => {
      setHairArmed(true)
      setHairOpen(true)
    }
    const sexHandler = () => {
      setSexArmed(true)
      setSexOpen(true)
    }
    const testosteroneHandler = () => {
      setTestosteroneArmed(true)
      setTestosteroneOpen(true)
    }
    const healthHandler = () => {
      setHealthArmed(true)
      setHealthOpen(true)
    }
    window.addEventListener('open-labs-offcanvas', labsHandler)
    window.addEventListener('open-wl-offcanvas', wlHandler)
    window.addEventListener('open-wegovy-assessment', wegovyHandler)
    window.addEventListener('open-hair-assessment', hairHandler)
    window.addEventListener('open-sex-assessment', sexHandler)
    window.addEventListener('open-testosterone-assessment', testosteroneHandler)
    window.addEventListener('open-health-assessment', healthHandler)
    return () => {
      window.removeEventListener('open-labs-offcanvas', labsHandler)
      window.removeEventListener('open-wl-offcanvas', wlHandler)
      window.removeEventListener('open-wegovy-assessment', wegovyHandler)
      window.removeEventListener('open-hair-assessment', hairHandler)
      window.removeEventListener('open-sex-assessment', sexHandler)
      window.removeEventListener('open-testosterone-assessment', testosteroneHandler)
      window.removeEventListener('open-health-assessment', healthHandler)
    }
  }, [])

  return (
    <div className="app-layout">
      <AnnouncementBar />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />

      {/* Lazy offcanvases — only mounted (and only fetched) once their
          respective event fires for the first time. Suspense fallback is
          null because there is no visible content until the chunk lands. */}
      {labsArmed && (
        <Suspense fallback={null}>
          <LabsOffcanvas
            isOpen={labsOpen}
            onClose={() => setLabsOpen(false)}
            from={labsFrom}
          />
        </Suspense>
      )}
      {wlArmed && (
        <Suspense fallback={null}>
          <WLOffcanvas
            isOpen={wlOpen}
            onClose={() => setWlOpen(false)}
            from={wlFrom}
          />
        </Suspense>
      )}
      {wegovyArmed && (
        <Suspense fallback={null}>
          <WegovyAssessment
            isOpen={wegovyOpen}
            onClose={() => setWegovyOpen(false)}
          />
        </Suspense>
      )}
      {hairArmed && (
        <Suspense fallback={null}>
          <HairAssessment
            isOpen={hairOpen}
            onClose={() => setHairOpen(false)}
          />
        </Suspense>
      )}
      {sexArmed && (
        <Suspense fallback={null}>
          <SexAssessment
            isOpen={sexOpen}
            onClose={() => setSexOpen(false)}
          />
        </Suspense>
      )}
      {testosteroneArmed && (
        <Suspense fallback={null}>
          <TestosteroneAssessment
            isOpen={testosteroneOpen}
            onClose={() => setTestosteroneOpen(false)}
          />
        </Suspense>
      )}
      {healthArmed && (
        <Suspense fallback={null}>
          <HealthAssessment
            isOpen={healthOpen}
            onClose={() => setHealthOpen(false)}
          />
        </Suspense>
      )}
    </div>
  )
}

export default Layout
