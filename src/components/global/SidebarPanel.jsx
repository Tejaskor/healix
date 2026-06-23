import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import useScrollLock from '@/hooks/useScrollLock'

/**
 * Global main-navigation sidebar.
 *
 * Mounted once at the router root so the main-menu offcanvas (and the
 * weight-loss rich variant) is available on every route — including
 * standalone pages like /labs that don't render the Navbar layout.
 *
 * Open it from anywhere by dispatching either event:
 *   window.dispatchEvent(new Event('open-sidebar'))
 *   window.dispatchEvent(new CustomEvent('reopen-sidebar', { detail: { menu: 'main' | 'wl-rich' } }))
 *
 * The original markup here lived inside Navbar — moving it here lets the
 * sidebar render over any page without duplicating listeners.
 */

const sidebarLinks = [
  { label: 'Weight Loss', href: '#' },
  { label: 'Labs', href: '#' },
  { label: 'Sexual Health', href: '#' },
  // The five below are placeholders with no real destinations yet. The
  // `disabled` flag is rendered as aria-disabled — the global rule in
  // styles/global.scss removes the pointer cursor + neutralizes hover.
  { label: 'Testosterone', href: '#', disabled: true },
  { label: 'Hair Regrowth', href: '#', disabled: true },
  { label: 'Mental Health', href: '#', disabled: true },
  { label: 'Skin', href: '#', disabled: true },
  { label: 'Everyday Health', href: '#', disabled: true },
]

const topTreatments = [
  { name: 'GLP-1 Pill', sub: '(Oral Semaglutide)', img: '/images/product_wegovy-pill.png', rx: true, highlight: true },
  { name: 'GLP-1 Pen', sub: '(Injectable Semaglutide)', img: '/images/product_wegovy-pen.png', rx: true, highlight: true },
  { name: 'Ozempic®', sub: '(Injectable Semaglutide)', img: '/images/product_ozempic.png', rx: true },
  { name: 'Mounjaro®', sub: '(Injectable Tirzepatide)', img: '/images/product_mounjaro.png', rx: true },
  { name: 'Zepbound®', sub: '(Injectable Tirzepatide)', img: '/images/product_zepbound.png', rx: true },
  { name: 'Generic Liraglutide', sub: '(Injectable)', img: '/images/product_liraglutide.png', rx: true },
]

const wlLearnLinks = [
  // Placeholders — `disabled` is rendered as aria-disabled so the global
  // rule in styles/global.scss removes the pointer cursor + neutralizes
  // hover. Drop the flag on any entry once it has a real destination.
  { label: 'About Healix', href: '#', disabled: true },
  { label: 'Clinical Excellence', href: '#', disabled: true },
  { label: 'The Science', href: '#', disabled: true },
  { label: 'Blog', href: '#', disabled: true },
  { label: 'Healix Benefits', href: '#', disabled: true },
]

// --- Sexual Health sub-menu data ---
const sexualExplore = ['Erectile Dysfunction', 'Early Climax', 'Hard Mints']
const sexualSupport = ['Getting Hard And Staying Hard', 'Boost In The Bedroom']
const sexualTreatments = [
  { label: 'Hard Mints', pills: [{ text: 'Rx', type: 'rx' }, { text: 'New', type: 'new' }] },
  { label: 'Generic For Viagra\u00ae', sub: 'Sildenafil', pills: [{ text: 'Rx', type: 'rx' }, { text: 'Popular', type: 'pop' }] },
  { label: 'Generic For Cialis\u00ae', sub: 'Tadalafil', pills: [{ text: 'Rx', type: 'rx' }, { text: 'Popular', type: 'pop' }] },
  { label: 'Viagra\u00ae', pills: [{ text: 'Rx', type: 'rx' }] },
  { label: 'Cialis\u00ae', pills: [{ text: 'Rx', type: 'rx' }] },
  { label: 'Valacyclovir', sub: 'Genital Herpes Treatment' },
  { label: 'Compare All Treatments' },
]
const sexualOtc = ['Climax Daily Wipes']
const sexualAccessories = [
  'Thrill Ride Prostate Massager',
  'Standing O Penis Rings',
  'OMG Ring Vibrator',
  'Roller Coaster Bullet Vibrator',
  'Glide Water-Based Lube',
  'Climax Delay Condoms',
  'Ultra Thin Condoms',
]
const sexualTopTreatments = [
  { name: 'Hard Mints\u2122 by healix', img: '/images/product_wegovy-pill.png', rx: true },
  { name: 'Viagra\u00ae', sub: '(Sildenafil Citrate)', img: '/images/product_wegovy-pill.png', rx: true },
]
const sexualPopularReads = [
  { title: 'Losing an Erection During Sex: Top Reasons', readTime: '10 min read', img: '/images/product_wegovy-pen.png' },
  { title: 'How to Get Hard: The Complete Guide', readTime: '11 min read', img: '/images/product_wegovy-pen.png' },
]

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * SidebarPanel
 * ---------------------------------------------
 * The full sidebar UI. Loaded lazily by `GlobalSidebar.jsx` only after the
 * user triggers `open-sidebar` / `reopen-sidebar` for the first time, so its
 * 500+ lines of JSX/CSS/data never ship to visitors who don't open the menu.
 *
 * `seedMenu` is the menu that should be opened on initial mount — passed by
 * the wrapper because the FIRST event was caught before this chunk had loaded.
 * Subsequent events are picked up by the listeners below as before.
 */
const SidebarPanel = ({ seedMenu = 'main' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true) // armed by parent
  // ── Layered state ─────────────────────────────────────────────────
  // The sidebar is two layers stacked:
  //   baseMenu   = which base is visible behind everything (main | wl-rich)
  //   panelOpen  = which sub-panel is currently slid over the base
  //                (null | 'weight-sub' | 'sexual-sub')
  // Keeping them separate means opening or closing a panel never
  // unmounts the base — eliminating the "blank black flash" that the
  // old single-`activeMenu` flow produced when wl-rich had to be torn
  // down before a panel could slide in.
  const [baseMenu, setBaseMenu] = useState(
    seedMenu === 'wl-rich' ? 'wl-rich' : 'main'
  )
  const [panelOpen, setPanelOpen] = useState(
    seedMenu === 'weight-sub' || seedMenu === 'sexual-sub' ? seedMenu : null
  )
  // Derived for places that still want a single "current view" value.
  const activeMenu = panelOpen || baseMenu

  // Backward-compat wrapper — translates legacy `setActiveMenu(x)` calls.
  // - panel values ('weight-sub' / 'sexual-sub') open that panel.
  // - 'main' closes any open panel WITHOUT touching the base (so a
  //   back tap returns to whichever base the user came from).
  // - 'wl-rich' clears panels and flips the base.
  const setActiveMenu = useCallback((next) => {
    if (next === 'weight-sub' || next === 'sexual-sub') {
      setPanelOpen(next)
    } else if (next === 'wl-rich') {
      setPanelOpen(null)
      setBaseMenu('wl-rich')
    } else {
      // 'main' or anything else → close panel, keep base.
      setPanelOpen(null)
    }
  }, [])

  const location = useLocation()
  const navigate = useNavigate()

  const isWeightLoss =
    location.pathname === '/weight-loss' ||
    location.pathname === '/membership' ||
    location.pathname === '/faqs' ||
    location.pathname === '/science'

  // Apply a menu choice from an external event to the layered state.
  const applyExternalMenu = useCallback((menu) => {
    if (menu === 'weight-sub' || menu === 'sexual-sub') {
      // Keep the base as-is (wl-rich on WL pages, otherwise main); just
      // open the panel.
      setPanelOpen(menu)
    } else if (menu === 'wl-rich') {
      setBaseMenu('wl-rich')
      setPanelOpen(null)
    } else {
      setBaseMenu('main')
      setPanelOpen(null)
    }
  }, [])

  // Default the rich sidebar for the WL pages; any explicit `open-sidebar`
  // dispatch with a menu in the detail wins over this.
  useEffect(() => {
    const openHandler = (e) => {
      const menu = (e && e.detail && e.detail.menu) || (isWeightLoss ? 'wl-rich' : 'main')
      applyExternalMenu(menu)
      setSidebarOpen(true)
    }
    const reopenHandler = (e) => {
      const menu = (e && e.detail && e.detail.menu) || 'main'
      applyExternalMenu(menu)
      setSidebarOpen(true)
    }
    // External signal — fired by overlay offcanvases (Labs, WL) when
    // the user hits their back button. Lets the sidebar slide out at
    // the SAME time as the layered offcanvas instead of leaking behind.
    const closeHandler = () => {
      setSidebarOpen(false)
      setPanelOpen(null)
    }
    window.addEventListener('open-sidebar', openHandler)
    window.addEventListener('reopen-sidebar', reopenHandler)
    window.addEventListener('close-sidebar', closeHandler)
    return () => {
      window.removeEventListener('open-sidebar', openHandler)
      window.removeEventListener('reopen-sidebar', reopenHandler)
      window.removeEventListener('close-sidebar', closeHandler)
    }
  }, [isWeightLoss, applyExternalMenu])

  // Lock background scroll while open (scrollbar-width compensated, no flicker).
  useScrollLock(sidebarOpen)

  // Close the sidebar (and any open panel) whenever the route actually
  // changes. This lets the layered navigation flow finish naturally:
  // the user clicks a link → React Router updates the path → this
  // effect collapses everything so the next page renders cleanly.
  // First-mount comparison via ref so we don't close on initial open.
  const prevPathRef = useRef(location.pathname)
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setSidebarOpen(false)
      setPanelOpen(null)
      prevPathRef.current = location.pathname
    }
  }, [location.pathname])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setSidebarOpen(false)
  }, [])

  useEffect(() => {
    if (!sidebarOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen, handleKeyDown])

  const closeSidebar = () => {
    setSidebarOpen(false)
    // Close any open panel so reopening starts from the base.
    setPanelOpen(null)
  }

  return (
    <>
      <div
        className={`navbar__overlay ${sidebarOpen ? 'navbar__overlay--visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        id="sidebar-menu"
        className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}
        aria-label="Main navigation"
      >
        {/* Main base content — header + EXPLORE — only rendered when
            the base is actually `main`. The sub-panels are rendered
            below as top-level siblings so they stay mounted across
            base switches and slide cleanly without flicker. */}
        {baseMenu === 'main' && (
          <>
            <div className="sidebar__header">
              <span className="sidebar__title">Menu</span>
              <button className="sidebar__close" onClick={closeSidebar} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <div className="sidebar__section">
              <span className="sidebar__section-label">EXPLORE</span>
              <nav>
                <ul className="sidebar__links">
                  {sidebarLinks.map((link) => (
                    <li key={link.label}>
                      <NavLink
                        to={link.href}
                        className="sidebar__link"
                        aria-disabled={link.disabled ? 'true' : undefined}
                        onClick={(e) => {
                          if (link.label === 'Weight Loss') {
                            e.preventDefault()
                            setActiveMenu('weight-sub')
                          } else if (link.label === 'Sexual Health') {
                            e.preventDefault()
                            setActiveMenu('sexual-sub')
                          } else if (link.label === 'Labs') {
                            e.preventDefault()
                            // Open the Labs offcanvas directly on top of
                            // the current sidebar — no close/reopen dance.
                            window.dispatchEvent(new CustomEvent('open-labs-offcanvas', { detail: { from: 'main' } }))
                          } else {
                            closeSidebar()
                          }
                        }}
                      >
                        <span>{link.label}</span>
                        <ChevronRight />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </>
        )}

        {/* Sub-panels — top-level siblings of the base layers, so they
            stay mounted while the sidebar is open and slide cleanly
            over wl-rich or main with no unmount/remount flicker. */}
        <div
          className="sidebar__panel"
          style={{
            transform: panelOpen === 'weight-sub' ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
              <div className="sidebar__header sidebar__header--panel">
                <button className="sidebar__close" onClick={() => setPanelOpen(null)} aria-label="Back">
                  <BackIcon />
                </button>
                <span className="sidebar__title">Weight Loss</span>
                <button className="sidebar__close" onClick={closeSidebar} aria-label="Close menu">
                  <CloseIcon />
                </button>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">EXPLORE</span>
                <ul className="sidebar__links">
                  <li>
                    <button className="sidebar__link" onClick={() => { closeSidebar(); navigate('/weight-loss') }}>
                      <span>Weight loss treatments</span>
                      <ChevronRight />
                    </button>
                  </li>
                  <li><button className="sidebar__link" onClick={() => { closeSidebar(); navigate('/membership') }}><span>Membership</span><ChevronRight /></button></li>
                  <li><button className="sidebar__link" onClick={() => { closeSidebar(); navigate('/science') }}><span>The Science</span><ChevronRight /></button></li>
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">TREATMENTS</span>
                <ul className="sidebar__links">
                  <li><button className="sidebar__link" aria-disabled="true"><span>GLP-1 Pill</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>GLP-1 Pen</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>Ozempic®</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>Generic Liraglutide</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>Zepbound®</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>Mounjaro®</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>Meal replacement kits</span></button></li>
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">LEARN</span>
                <ul className="sidebar__links">
                  <li><button className="sidebar__link" aria-disabled="true"><span>Pricing</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>FSA/HSA Reimbursements</span></button></li>
                  <li><button className="sidebar__link" aria-disabled="true"><span>Healix Benefits</span></button></li>
                </ul>
              </div>
            </div>

            {/* Sexual Health sub-menu panel (slides over whichever base is active) */}
            <div
              className="sidebar__panel sexual-sub"
              style={{
                transform: panelOpen === 'sexual-sub' ? 'translateX(0)' : 'translateX(100%)',
              }}
            >
              <div className="sidebar__header sidebar__header--panel">
                <button className="sidebar__close" onClick={() => setPanelOpen(null)} aria-label="Back">
                  <BackIcon />
                </button>
                <span className="sidebar__title">Sexual Health</span>
                <div className="sexual-sub__header-icons">
                  <button className="sidebar__close" aria-label="Profile" aria-disabled="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button className="sidebar__close" onClick={closeSidebar} aria-label="Close menu">
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">EXPLORE</span>
                <ul className="sidebar__links">
                  {sexualExplore.map((item) => (
                    <li key={item}>
                      <button
                        className="sidebar__link"
                        onClick={() => {
                          if (item === 'Erectile Dysfunction') {
                            closeSidebar()
                            navigate('/sexual-health/erectile-dysfunction')
                          } else if (item === 'Early Climax') {
                            closeSidebar()
                            navigate('/sexual-health/early-climax')
                          } else if (item === 'Hard Mints') {
                            closeSidebar()
                            navigate('/sexual-health/hard-mints')
                          }
                        }}
                      >
                        <span>{item}</span>
                        <ChevronRight />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">GET SUPPORT FOR</span>
                <ul className="sidebar__links">
                  {sexualSupport.map((item) => (
                    <li key={item}>
                      <button className="sidebar__link" aria-disabled="true"><span>{item}</span></button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">TREATMENTS</span>
                <ul className="sidebar__links">
                  {sexualTreatments.map((item) => (
                    <li key={item.label}>
                      <button className="sidebar__link sexual-sub__row" aria-disabled="true">
                        <span className="sexual-sub__row-main">
                          <span className="sexual-sub__row-title">
                            {item.label}
                            {item.pills && item.pills.map((p) => (
                              <span key={p.text} className={`sexual-sub__pill sexual-sub__pill--${p.type}`}>{p.text}</span>
                            ))}
                          </span>
                          {item.sub && <span className="sexual-sub__row-sub">{item.sub}</span>}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">OVER-THE-COUNTER</span>
                <ul className="sidebar__links">
                  {sexualOtc.map((item) => (
                    <li key={item}>
                      <button className="sidebar__link" aria-disabled="true"><span>{item}</span></button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">SEX TOYS &amp; ACCESSORIES</span>
                <ul className="sidebar__links">
                  {sexualAccessories.map((item) => (
                    <li key={item}>
                      <button className="sidebar__link" aria-disabled="true"><span>{item}</span></button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">LEARN MORE</span>
                <ul className="sidebar__links">
                  <li>
                    <button className="sidebar__link" aria-disabled="true"><span>About Sexual Health</span><ChevronRight /></button>
                  </li>
                </ul>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">TOP TREATMENTS</span>
                <div className="sexual-sub__cards">
                  {sexualTopTreatments.map((item) => (
                    <div key={item.name} className="sexual-sub__card">
                      {item.rx && <span className="sexual-sub__pill sexual-sub__pill--rx sexual-sub__card-rx">Rx</span>}
                      <div className="sexual-sub__card-img">
                        <img src={item.img} alt={item.name} loading="lazy"  decoding="async"/>
                      </div>
                      <span className="sexual-sub__card-name">{item.name}</span>
                      {item.sub && <span className="sexual-sub__card-sub">{item.sub}</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar__section">
                <span className="sidebar__section-label">POPULAR READS</span>
                <div className="sexual-sub__reads">
                  {sexualPopularReads.map((item) => (
                    <div key={item.title} className="sexual-sub__read">
                      <div className="sexual-sub__read-img">
                        <img src={item.img} alt="" loading="lazy"  decoding="async"/>
                      </div>
                      <span className="sexual-sub__read-title">{item.title}</span>
                      <span className="sexual-sub__read-time">{item.readTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

        {baseMenu === 'wl-rich' && (
          <div className="sidebar-wl">
            <div className="sidebar-wl__header">
              <span className="sidebar-wl__title">Menu</span>
              <div className="sidebar-wl__header-icons">
                <button className="sidebar__close" aria-label="Profile" aria-disabled="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <button className="sidebar__close" onClick={closeSidebar} aria-label="Close menu">
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="sidebar-wl__section">
              <span className="sidebar-wl__section-label">EXPLORE</span>
              <ul className="sidebar__links">
                {sidebarLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      className="sidebar__link"
                      aria-disabled={link.disabled ? 'true' : undefined}
                      onClick={() => {
                        if (link.label === 'Weight Loss') {
                          // Layer the WL offcanvas over the sidebar
                          // directly — no close/reopen slide.
                          window.dispatchEvent(new CustomEvent('open-wl-offcanvas', { detail: { from: 'wl-rich' } }))
                        } else if (link.label === 'Labs') {
                          // Layer the Labs offcanvas over the sidebar.
                          window.dispatchEvent(new CustomEvent('open-labs-offcanvas', { detail: { from: 'wl-rich' } }))
                        } else if (link.label === 'Sexual Health') {
                          // Panel is always mounted (rendered outside the
                          // base conditionals) so it can slide directly
                          // over wl-rich — no main-menu intermediate step
                          // and no unmount/remount flicker.
                          setPanelOpen('sexual-sub')
                        } else {
                          closeSidebar()
                        }
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronRight />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-wl__treatments">
              <span className="sidebar-wl__section-label">TOP TREATMENTS</span>
              <div className="sidebar-wl__cards-track">
                {topTreatments.map((item) => (
                  <div key={item.name} className="sidebar-wl__card">
                    <div className="sidebar-wl__card-badges">
                      {item.rx && <span className="sidebar-wl__badge-rx">Rx</span>}
                      {item.highlight && <span className="sidebar-wl__badge-tag">Now at Healix</span>}
                    </div>
                    <div className="sidebar-wl__card-img">
                      <img src={item.img} alt={item.name} loading="lazy"  decoding="async"/>
                    </div>
                    <span className="sidebar-wl__card-name">{item.name}</span>
                    {item.sub && <span className="sidebar-wl__card-sub">{item.sub}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-wl__section">
              <span className="sidebar-wl__section-label">LEARN</span>
              <ul className="sidebar__links">
                {wlLearnLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      className="sidebar__link"
                      aria-disabled={link.disabled ? 'true' : undefined}
                      onClick={() => {
                        closeSidebar()
                        if (link.label === 'The Science') navigate('/science')
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronRight />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </aside>
    </>
  )
}

export default SidebarPanel
