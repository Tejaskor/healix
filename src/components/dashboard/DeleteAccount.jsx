import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { deleteCurrentAccount } from '@/lib/supabaseAuth'
import ConfirmationModal from './ConfirmationModal'

// Inline eye icon for the show/hide-password toggle. Matches the pattern
// used elsewhere in the auth UI (see SignupForm).
const EyeIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.06 10.06 0 0112 20c-7 0-11-8-11-8a20.15 20.15 0 014.22-5.18" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a19.7 19.7 0 01-3.22 4.19" />
        <path d="M1 1l22 22" />
      </>
    )}
  </svg>
)

/**
 * Delete-account flow.
 *
 * Security model
 * --------------------------------------------------------------------
 *  - Email/password users: must re-enter their current password. We call
 *    `supabase.auth.signInWithPassword()` BEFORE invoking the
 *    `delete_my_account` RPC; if reauthentication fails the destructive
 *    RPC is never reached. This blocks a "stolen open laptop" attacker
 *    from one-clicking an account deletion.
 *  - OAuth users (Google/Apple/…): password reauth is impossible (they
 *    have no password). Being signed in via the OAuth provider is itself
 *    proof of identity — the provider re-prompts if the session lapses.
 *
 * Reauthentication implementation
 * --------------------------------------------------------------------
 *  See `deleteCurrentAccount` in src/lib/supabaseAuth.js. The flow is:
 *    1. getUser() — confirm a session exists.
 *    2. signInWithPassword(email, password) — re-verify credentials.
 *    3. rpc('delete_my_account') — Postgres security-definer function
 *       that deletes the user's profile row + auth.users row in one tx.
 *    4. signOut() — clear local Supabase session.
 *
 * UI is gated on:
 *   - password length > 0  (only for email users)
 *   - confirmText === 'DELETE'  (always)
 * The Confirm button stays disabled until both pass.
 */
const DeleteAccount = () => {
  const { user, logout, clearAssessment } = useAuth()
  const navigate = useNavigate()

  // provider is normalised by AuthContext.supabaseUserToHealix:
  //   'email'  → password account
  //   'google' / 'apple' / …  → OAuth account
  const isOauthUser = user?.provider && user.provider !== 'email'

  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwTouched, setPwTouched] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const confirmTextOk = confirmText.trim().toUpperCase() === 'DELETE'
  const passwordOk = password.length > 0
  const canConfirm = isOauthUser
    ? confirmTextOk
    : passwordOk && confirmTextOk

  const openModal = () => {
    setPassword('')
    setShowPw(false)
    setPwTouched(false)
    setConfirmText('')
    setError('')
    setSuccess(false)
    setOpen(true)
  }

  const closeModal = () => {
    if (loading) return
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (!canConfirm || loading) return
    setError('')
    setLoading(true)
    try {
      await deleteCurrentAccount(isOauthUser ? {} : { password })
      setSuccess(true)
      // Brief pause so the success message is visible, then full cleanup.
      setTimeout(() => {
        clearAssessment()
        // logout() also clears healix_user + calls supabase.auth.signOut().
        // signOut is idempotent — safe even though deleteCurrentAccount
        // already signed out.
        logout()
        setOpen(false)
        navigate('/', { replace: true })
      }, 1200)
    } catch (err) {
      const msg = err?.message || 'Something went wrong'
      if (/Failed to fetch|NetworkError/i.test(msg)) {
        setError('Network error — please check your connection and try again.')
      } else if (/JWT|expired|session|not signed in/i.test(msg)) {
        setError('Your session has expired. Please log in again and retry.')
      } else {
        // Includes the translated "Incorrect password" and the SQL-not-set-up
        // message, surfaced verbatim so the developer/user sees the cause.
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  // Inline validation message — shows "Password is required" only after
  // the field has been blurred while empty. We don't show this during
  // initial typing or before the user interacts with the field.
  const inlinePwError =
    !isOauthUser && pwTouched && !passwordOk ? 'Password is required' : ''

  return (
    <section className="dash-card dash-delete">
      <header className="dash-card__header">
        <h2 className="dash-card__title dash-delete__title">Delete account</h2>
      </header>
      <p className="dash-delete__warning">
        Deleting your account is <strong>permanent</strong> and cannot be undone. All your data
        &mdash; including your health assessment, progress, and preferences &mdash; will be removed.
      </p>
      <div>
        <button
          type="button"
          className="dash-btn dash-btn--danger"
          onClick={openModal}
        >
          Delete account
        </button>
      </div>

      <ConfirmationModal
        isOpen={open}
        tone="danger"
        title="Are you sure you want to delete your account?"
        description={(
          <>
            <p>This action is <strong>irreversible</strong>.</p>
            <p>All your health data and progress will be removed.</p>
          </>
        )}
        confirmLabel={success ? 'Deleted' : 'Confirm delete'}
        cancelLabel="Cancel"
        confirmDisabled={!canConfirm}
        loading={loading}
        onCancel={closeModal}
        onConfirm={handleConfirm}
      >
        {success ? (
          <p className="dash-delete__success" role="status">Your account has been deleted.</p>
        ) : (
          <>
            {/* Password — only for email/password accounts. OAuth users
                see the explanation panel below in its place. */}
            {!isOauthUser && (
              <label className="dash-delete__field">
                <span className="dash-delete__label">Password</span>
                <span style={{ position: 'relative', display: 'block' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="dash-delete__input"
                    style={{ paddingRight: '40px' }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError('')
                    }}
                    onBlur={() => setPwTouched(true)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    autoFocus
                    aria-invalid={inlinePwError ? 'true' : 'false'}
                    aria-describedby={inlinePwError ? 'dash-delete-pw-error' : 'dash-delete-pw-help'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    aria-pressed={showPw}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'inherit',
                    }}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </span>
                {inlinePwError && (
                  <span
                    id="dash-delete-pw-error"
                    className="dash-delete__error"
                    role="alert"
                  >
                    {inlinePwError}
                  </span>
                )}
                <span id="dash-delete-pw-help" className="sr-only">
                  Enter the password for your Healix account to confirm deletion.
                </span>
              </label>
            )}

            {/* OAuth users — explanation message. Exact wording per spec. */}
            {isOauthUser && (
              <p
                className="dash-delete__field"
                role="note"
                style={{ color: 'rgba(0,0,0,0.6)' }}
              >
                You signed in using <strong style={{ textTransform: 'capitalize' }}>{user.provider}</strong>,
                so password confirmation is not required.
              </p>
            )}

            <label className="dash-delete__field">
              <span className="dash-delete__label">
                Type <strong>DELETE</strong> to confirm
              </span>
              <input
                type="text"
                className="dash-delete__input"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
                autoFocus={isOauthUser}
                aria-describedby="dash-delete-confirm-help"
              />
              <span id="dash-delete-confirm-help" className="sr-only">
                Type the word DELETE in uppercase to enable the confirm button.
              </span>
            </label>

            {/* Single live region for server-side errors. role="alert" so
                screen readers announce changes; aria-atomic keeps the
                whole message read on update rather than per-character. */}
            <div
              className="dash-delete__error-region"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              {error && (
                <p className="dash-delete__error">{error}</p>
              )}
            </div>
          </>
        )}
      </ConfirmationModal>
    </section>
  )
}

export default DeleteAccount
