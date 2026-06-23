import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoginButton from '@/components/common/LoginButton/LoginButton'
import './UserMenu.scss'

/**
 * Authenticated-user dropdown for the navbar.
 *
 * Drop-in replacement for <LoginButton>: when the AuthContext reports no
 * user it delegates rendering to LoginButton (so existing classNames keep
 * styling the trigger). When a user is signed in it renders the avatar
 * trigger + menu.
 *
 * Avatar character:
 *   1st letter of user.fullName, uppercased.
 *   Fallback to 1st letter of user.email when name is missing.
 *   '?' if both are missing (edge case — fresh OAuth user before profile sync).
 *
 * Routing of Profile / Orders / Settings:
 *   All three currently land on /dashboard — those individual routes don't
 *   exist yet. Once they do, just change `to=` on each <Link> and the
 *   wiring is done; the rest of the component is route-agnostic.
 *
 * Accessibility:
 *   - Trigger uses aria-haspopup="menu" + aria-expanded.
 *   - Panel uses role="menu" and child items use role="menuitem".
 *   - Escape closes. Outside pointer/touch closes.
 *   - Focus is left where the user puts it (no focus-trap inside the menu
 *     — items are reachable by Tab from the trigger, which matches native
 *     <select> behaviour and avoids surprising sighted keyboard users).
 */

const initialFor = (user) => {
  const source = user?.fullName?.trim() || user?.email?.trim() || ''
  const ch = source.charAt(0)
  return ch ? ch.toUpperCase() : '?'
}

const firstNameOrHandle = (user) => {
  const name = user?.fullName?.trim()
  if (name) return name.split(/\s+/)[0]
  if (user?.email) return user.email.split('@')[0]
  return 'there'
}

const UserMenu = ({ className = '' }) => {
  const { user, isLoggedIn, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const navigate = useNavigate()

  // Outside click + Escape — only when the panel is actually open.
  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Not signed in — fall through to the existing login button so all the
  // hosts using <LoginButton className="X" /> can swap to <UserMenu /> with
  // zero visual regression in the logged-out state.
  if (!isLoggedIn) {
    return <LoginButton className={className} />
  }

  const handleLogout = async () => {
    setOpen(false)
    try {
      await logout() // AuthContext.logout = signOut Supabase + clear local user
    } catch {
      // logout() already swallows + logs Supabase errors; UI state is
      // already cleared at this point, so navigating home is safe.
    }
    navigate('/', { replace: true })
  }

  const closeAnd = (fn) => () => {
    setOpen(false)
    fn?.()
  }

  const handleNavClick = () => setOpen(false)

  return (
    <div className={`user-menu ${className}`} ref={rootRef}>
      <button
        type="button"
        className={`user-menu__trigger ${open ? 'user-menu__trigger--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${firstNameOrHandle(user)}`}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {initialFor(user)}
        </span>
        <svg
          className="user-menu__chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="user-menu__panel"
          role="menu"
          aria-label="Account menu"
        >
          <div className="user-menu__greeting">
            <p className="user-menu__hello">
              Hi, <strong>{firstNameOrHandle(user)}</strong>
            </p>
            {user?.email && (
              <p className="user-menu__email" title={user.email}>
                {user.email}
              </p>
            )}
          </div>

          <div className="user-menu__divider" role="separator" />

          <Link
            to="/dashboard"
            className="user-menu__item"
            role="menuitem"
            onClick={handleNavClick}
          >
            Profile
          </Link>
          <Link
            to="/dashboard"
            className="user-menu__item"
            role="menuitem"
            onClick={handleNavClick}
          >
            Orders
          </Link>
          <Link
            to="/dashboard"
            className="user-menu__item"
            role="menuitem"
            onClick={handleNavClick}
          >
            Settings
          </Link>

          <div className="user-menu__divider" role="separator" />

          <button
            type="button"
            className="user-menu__item user-menu__item--logout"
            role="menuitem"
            onClick={closeAnd(handleLogout)}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
