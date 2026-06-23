import './Pill.scss'

const Pill = ({ label, icon, active = false, onClick }) => {
  return (
    <button
      className={`pill ${active ? 'pill--active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="pill__icon">{icon}</span>}
      <span className="pill__label">{label}</span>
    </button>
  )
}

export default Pill
