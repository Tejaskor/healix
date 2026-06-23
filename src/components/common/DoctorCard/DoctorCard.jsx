import './DoctorCard.scss'

const DoctorCard = ({ image, name, role, tags, description }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-card__image-wrapper">
        <img src={image} alt={name} className="doctor-card__image" loading="lazy"  decoding="async"/>
        <div className="doctor-card__meta">
          <p className="doctor-card__role">{role}</p>
          {tags && tags.length > 0 && (
            <div className="doctor-card__tags">
              {tags.map((tag) => (
                <span key={tag} className="doctor-card__tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="doctor-card__info">
        <h3 className="doctor-card__name">{name}</h3>
        <p className="doctor-card__description">{description}</p>
      </div>
    </div>
  )
}

export default DoctorCard
