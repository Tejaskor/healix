/**
 * Single source of truth for "open the login offcanvas".
 *
 * Props:
 *  - view: 'login' | 'signup' (default 'login')
 *  - className: className to apply for page-specific styling
 *  - children: button label (default 'Log in')
 *  - as: 'button' | 'a' — render element (default 'button')
 *  - ...rest: forwarded to the underlying element
 */
export const openAuth = (view = 'login') => {
  window.dispatchEvent(new CustomEvent('open-auth', { detail: { view } }))
}

const LoginButton = ({
  view = 'login',
  className = '',
  children = 'Log in',
  as = 'button',
  onClick,
  ...rest
}) => {
  const handleClick = (e) => {
    // Preserve consumer onClick (e.g., close an offcanvas) then open auth.
    onClick?.(e)
    if (e.defaultPrevented) return
    e.preventDefault?.()
    openAuth(view)
  }

  if (as === 'a') {
    return (
      <a href="#login" className={className} onClick={handleClick} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={className} onClick={handleClick} {...rest}>
      {children}
    </button>
  )
}

export default LoginButton
