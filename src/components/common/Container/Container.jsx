import './Container.scss'

const Container = ({ children, className = '', narrow = false }) => {
  const classes = `container ${narrow ? 'container--narrow' : ''} ${className}`.trim()

  return <div className={classes}>{children}</div>
}

export default Container
