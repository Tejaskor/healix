import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

const USER_KEY = 'healix_user'
const ASSESSMENT_KEY = 'healix_assessment'

const AuthContext = createContext(null)

// ─── storage helpers ──────────────────────────────────────────────────

const readUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeUser = (user) => {
  if (user == null) localStorage.removeItem(USER_KEY)
  else localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Normalise a Supabase user record into the same `{ email, fullName, ... }`
 * shape that the rest of the app (ProtectedRoute, dashboard greeting, etc.)
 * already expects from the legacy localStorage user record. This is the
 * single point of translation between Supabase's schema and Healix's.
 */
const supabaseUserToHealix = (sbUser) => {
  if (!sbUser) return null
  return {
    email: sbUser.email,
    fullName:
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.fullName ||
      '',
    provider: sbUser.app_metadata?.provider || 'email',
    supabaseId: sbUser.id,
    loggedInAt: Date.now(),
  }
}

/**
 * Assessment record shape:
 *   { answers: {...}, step: 'questionId' | null, completedAt: number | null }
 *
 * Backward-compat: older builds stored the answers object directly at this
 * key, so if we see a plain answers object we migrate it in memory.
 */
const readAssessment = () => {
  try {
    const raw = localStorage.getItem(ASSESSMENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !('answers' in parsed)) {
      const hasAnswers = Object.keys(parsed).length > 0
      return hasAnswers ? { answers: parsed, step: null, completedAt: Date.now() } : null
    }
    return parsed
  } catch {
    return null
  }
}

const writeAssessment = (record) => {
  if (record == null) localStorage.removeItem(ASSESSMENT_KEY)
  else localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(record))
}

export const AuthProvider = ({ children }) => {
  // Seed with the legacy localStorage user so first paint doesn't flash
  // an unauthenticated UI while we wait for getSession() to resolve.
  const [user, setUser] = useState(() => readUser())
  const [assessmentRecord, setAssessmentRecord] = useState(() => readAssessment())

  // ─── Supabase session bootstrap + subscription ────────────────────
  // Source-of-truth for the user is now `supabase.auth`. On mount we
  // resolve the existing session (if any) and then subscribe to changes
  // so the context updates after sign-in, sign-out, token refresh, and
  // OAuth redirects — even from another tab.
  useEffect(() => {
    let mounted = true

    // 1. Restore the session that Supabase already persisted to localStorage
    //    under the `healix-supabase-auth` key. This is what survives a
    //    refresh / new tab.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data?.session?.user) {
        const next = supabaseUserToHealix(data.session.user)
        writeUser(next)
        setUser(next)
      }
      // If there's no Supabase session but the legacy `healix_user` is
      // still in localStorage (e.g. an account created by the old Express
      // flow), we leave it alone — the user keeps being "logged in" via
      // the legacy mechanism. They'll be migrated naturally on next sign-in.
    })

    // 2. Subscribe to every subsequent auth change.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT') {
        writeUser(null)
        setUser(null)
        return
      }
      if (session?.user) {
        const next = supabaseUserToHealix(session.user)
        writeUser(next)
        setUser(next)
      }
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // Cross-tab sync for the assessment record. Supabase already syncs its
  // own session storage across tabs internally, so we only need to
  // mirror the assessment key.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ASSESSMENT_KEY) setAssessmentRecord(readAssessment())
      if (e.key === USER_KEY) setUser(readUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /**
   * Imperative login.
   *
   * Still callable from anywhere that already wires up `onSuccess(user)
   * → login(user)` (signup form, login form, OAuth callback page). We
   * write the legacy `healix_user` slot for backward compat; Supabase's
   * own subscription will eventually overwrite it with the canonical
   * shape if a real Supabase session exists.
   */
  const login = useCallback((data) => {
    const next = { ...data, loggedInAt: Date.now() }
    writeUser(next)
    setUser(next)
  }, [])

  /**
   * Sign out of both the Supabase session and the legacy localStorage
   * record. The Supabase signOut() fires SIGNED_OUT on the listener,
   * which is what actually clears `user` — but we also clear immediately
   * here so the UI flips without waiting for the round-trip.
   */
  const logout = useCallback(async () => {
    writeUser(null)
    setUser(null)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      // Even if Supabase signOut fails (e.g. offline) we've already
      // cleared local state, so the user is "out" from the UI's
      // perspective. Surface the failure in the console for debugging.
      // eslint-disable-next-line no-console
      console.warn('[auth] supabase.signOut failed', err)
    }
  }, [])

  /**
   * Persist partial progress. Does NOT mark the assessment as completed.
   * Called throughout the flow so a refresh mid-assessment can resume.
   */
  const saveAssessmentProgress = useCallback(({ answers, step } = {}) => {
    setAssessmentRecord((prev) => {
      const next = {
        answers: answers ?? prev?.answers ?? {},
        step: step ?? prev?.step ?? null,
        completedAt: prev?.completedAt ?? null,
      }
      writeAssessment(next)
      return next
    })
  }, [])

  /**
   * Mark the assessment fully completed. This is the ONLY place where
   * `completedAt` is ever set. Called from the final-submit handler.
   */
  const completeAssessment = useCallback((answers) => {
    const next = {
      answers: answers ?? {},
      step: null,
      completedAt: Date.now(),
    }
    writeAssessment(next)
    setAssessmentRecord(next)
  }, [])

  const clearAssessment = useCallback(() => {
    writeAssessment(null)
    setAssessmentRecord(null)
  }, [])

  const value = useMemo(() => ({
    user,
    isLoggedIn: !!user,

    // Completed flag is derived ONLY from the explicit timestamp.
    assessmentCompleted: !!assessmentRecord?.completedAt,
    assessmentData: assessmentRecord?.answers || null,
    assessmentStep: assessmentRecord?.step || null,
    assessmentStartedAt: assessmentRecord && !assessmentRecord.completedAt,

    login,
    logout,
    saveAssessmentProgress,
    completeAssessment,
    clearAssessment,

    // Back-compat alias.
    saveAssessment: completeAssessment,
  }), [user, assessmentRecord, login, logout, saveAssessmentProgress, completeAssessment, clearAssessment])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
