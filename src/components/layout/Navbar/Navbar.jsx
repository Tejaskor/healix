import { Link, useLocation, useNavigate } from 'react-router-dom'
import useScrollPosition from '@/hooks/useScrollPosition'
import HealixLogo from '@/components/common/HealixLogo/HealixLogo'
import UserMenu from '@/components/common/UserMenu/UserMenu'
import './Navbar.scss'

const Navbar = () => {
  const { isScrolled } = useScrollPosition()
  const location = useLocation()
  const navigate = useNavigate()

  const isWeightLoss =
    location.pathname === '/weight-loss' ||
    location.pathname === '/membership' ||
    location.pathname === '/faqs' ||
    location.pathname === '/science'

  // The sidebar itself lives in <GlobalSidebar /> at the router root so
  // it's available on every page. The hamburger just dispatches an event.
  const openSidebar = () => {
    const menu = isWeightLoss ? 'wl-rich' : 'main'
    window.dispatchEvent(new CustomEvent('open-sidebar', { detail: { menu } }))
  }

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${isWeightLoss ? 'navbar--weight' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" aria-label="Healix homepage">
          <HealixLogo color="dark" size="md" />
        </Link>

        {isWeightLoss && (
          <div className="navbar__center">
            {[
              { label: 'Treatment', to: '/weight-loss' },
              { label: 'Membership', to: '/membership' },
              { label: 'The Science', to: '/science' },
              { label: 'FAQs', to: '/faqs' },
            ].map((item) => {
              const isActive = location.pathname === item.to
              return (
                <button
                  key={item.to}
                  className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                  onClick={() => navigate(item.to)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        )}

        <div className="navbar__right">
          {/* UserMenu transparently renders the original "Log in" button
              when logged out, and the avatar + dropdown when logged in.
              Same className passes through, so navbar layout/responsive
              behaviour is preserved either way. */}
          <UserMenu className="navbar__login" />
          <button
            className="navbar__hamburger"
            onClick={openSidebar}
            aria-label="Open menu"
            aria-controls="sidebar-menu"
          >
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
