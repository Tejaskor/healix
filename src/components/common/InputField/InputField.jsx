import './InputField.scss'

const InputField = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  name,
  className = '',
  ...rest
}) => {
  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`.trim()}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field__input"
        {...rest}
      />
      {error && <span className="input-field__error">{error}</span>}
    </div>
  )
}

export default InputField
