const LoadingScreen = ({ message = 'Building your plan...' }) => (
  <div className="assm-loading">
    <div className="assm-loading__dots">
      <span /><span /><span />
    </div>
    <p className="assm-loading__text">{message}</p>
  </div>
)

export default LoadingScreen
