/**
 * Global offcanvas sidebar controls.
 *
 * The GlobalSidebar component (mounted once at the router root) listens for
 * two custom events:
 *   - `open-sidebar`   — opens the sidebar fresh (main or a specific sub-menu)
 *   - `reopen-sidebar` — reopens it after another offcanvas closes (preserves
 *                       nested state by accepting a `menu` in detail)
 *
 * Rather than dispatching raw events from every page, prefer the helpers
 * below so the API stays consistent across the app.
 *
 * Supported menu keys: 'main' | 'weight-sub' | 'sexual-sub' | 'wl-rich'
 */

export const openSidebar = (menu = 'main') => {
  window.dispatchEvent(new CustomEvent('open-sidebar', { detail: { menu } }))
}

export const reopenSidebar = (menu = 'main') => {
  window.dispatchEvent(new CustomEvent('reopen-sidebar', { detail: { menu } }))
}

// Shortcut used by any page/component that wants to jump straight to the
// Sexual Health nested menu.
export const openSexualHealthMenu = () => openSidebar('sexual-sub')
