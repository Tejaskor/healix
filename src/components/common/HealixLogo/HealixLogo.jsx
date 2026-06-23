import './HealixLogo.scss'

const HealixLogo = ({ color = 'dark', size = 'md' }) => {
  return (
    <span className={`healix-logo healix-logo--${color} healix-logo--${size}`}>
      he<span className="healix-logo__accent">a</span>lix
    </span>
  )
}

export default HealixLogo
