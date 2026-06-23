const NavigationControls = ({ onContinue, disabled, label = 'Continue' }) => {
  return (
    <div className="assm__nav">
      <button
        type="button"
        className="assm__btn assm__btn--primary"
        onClick={onContinue}
        disabled={disabled}
      >
        {label}
      </button>
    </div>
  )
}

export default NavigationControls
