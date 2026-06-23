const PlanCard = ({ title, description, recommended, onView }) => (
  <article className={`dash-plan ${recommended ? 'dash-plan--recommended' : ''}`}>
    {recommended && <span className="dash-plan__badge">Recommended</span>}
    <h3 className="dash-plan__title">{title}</h3>
    <p className="dash-plan__desc">{description}</p>
    <button type="button" className="dash-plan__btn" onClick={onView}>View plan</button>
  </article>
)

export default PlanCard
