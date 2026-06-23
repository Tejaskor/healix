import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/routes/ProtectedRoute'
import AuthGate from '@/components/global/AuthGate'
import GlobalSidebar from '@/components/global/GlobalSidebar'
import ScrollToTop from '@/components/global/ScrollToTop'

// =============================================
// Performance: route-level code splitting
// ---------------------------------------------
// Eagerly loading every page kept the initial JS bundle huge — visiting "/"
// downloaded the code for Labs, Cancer Screening, Dashboard, Onboarding, and
// every other page the user might never reach. Each lazy() call below splits
// that page into its own chunk that Vite/Rollup will only fetch when the
// matching route is actually visited, dramatically improving FCP/LCP/TTI on
// the landing page and on every cold navigation.
// =============================================
const HomePage = lazy(() => import('@/pages/HomePage'))
const WeightLossPage = lazy(() => import('@/pages/WeightLossPage'))
const MembershipPage = lazy(() => import('@/pages/MembershipPage'))
const FaqPage = lazy(() => import('@/pages/FaqPage'))
const SciencePage = lazy(() => import('@/pages/SciencePage'))
const LabsPage = lazy(() => import('@/pages/LabsPage'))
const WhatWeTestPage = lazy(() => import('@/pages/WhatWeTestPage'))
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'))
const ActionPlanPage = lazy(() => import('@/pages/ActionPlanPage'))
const CancerScreeningPage = lazy(() => import('@/pages/CancerScreeningPage'))
const ErectileDysfunctionPage = lazy(() => import('@/pages/ErectileDysfunctionPage'))
const EarlyClimaxPage = lazy(() => import('@/pages/EarlyClimaxPage'))
const HardMintsPage = lazy(() => import('@/pages/HardMintsPage'))
const AssessmentPage = lazy(() => import('@/pages/AssessmentPage'))
const OnboardingAssessmentPage = lazy(() => import('@/pages/OnboardingAssessmentPage'))
const OnboardingResultPage = lazy(() => import('@/pages/OnboardingResultPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const OAuthSuccessPage = lazy(() => import('@/pages/OAuthSuccessPage'))
const OAuthFailurePage = lazy(() => import('@/pages/OAuthFailurePage'))
const SitemapPage = lazy(() => import('@/pages/SitemapPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const TelehealthConsentPage = lazy(() => import('@/pages/TelehealthConsentPage'))
const ConsumerHealthDataPage = lazy(() => import('@/pages/ConsumerHealthDataPage'))

// Lightweight transitional fallback — intentionally unstyled and tiny so it
// adds no extra render cost. The Suspense boundary swaps it out the instant
// the lazy chunk resolves.
const RouteFallback = () => (
  <div
    aria-hidden="true"
    style={{
      minHeight: '60vh',
      width: '100%',
      background: 'transparent',
    }}
  />
)

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Reset scroll to the top of the page on every route change so
            the hero section is always visible first. */}
        <ScrollToTop />

        {/* Auth offcanvas + main sidebar live outside the Routes so they're
            available on every page, regardless of which layout the route uses. */}
        <AuthGate />
        <GlobalSidebar />

        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/weight-loss" element={<WeightLossPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/faqs" element={<FaqPage />} />
              <Route path="/science" element={<SciencePage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/telehealth-consent" element={<TelehealthConsentPage />} />
              <Route path="/consumer-health-data-policy" element={<ConsumerHealthDataPage />} />
              <Route
                path="/dashboard"
                element={(
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                )}
              />
            </Route>
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/labs/what-we-test" element={<WhatWeTestPage />} />
            <Route path="/labs/how-it-works" element={<HowItWorksPage />} />
            <Route path="/labs/action-plan" element={<ActionPlanPage />} />
            <Route path="/labs/cancer-screening" element={<CancerScreeningPage />} />
            <Route path="/sexual-health/erectile-dysfunction" element={<ErectileDysfunctionPage />} />
            <Route path="/sexual-health/early-climax" element={<EarlyClimaxPage />} />
            <Route path="/sexual-health/hard-mints" element={<HardMintsPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/success" element={<OAuthSuccessPage />} />
            <Route path="/auth/failure" element={<OAuthFailurePage />} />
            <Route
              path="/onboarding/assessment"
              element={(
                <ProtectedRoute requireAssessment={false}>
                  <OnboardingAssessmentPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/onboarding/results"
              element={(
                <ProtectedRoute requireAssessment={false}>
                  <OnboardingResultPage />
                </ProtectedRoute>
              )}
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRouter
