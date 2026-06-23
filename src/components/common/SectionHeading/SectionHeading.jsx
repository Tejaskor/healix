import './SectionHeading.scss'

const SectionHeading = ({
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) => {
  const classes = `section-heading section-heading--${align} ${light ? 'section-heading--light' : ''} ${className}`.trim()

  return (
    <div className={classes}>
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
    </div>
  )
}

export default SectionHeading
