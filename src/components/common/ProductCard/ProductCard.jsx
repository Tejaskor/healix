import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import './ProductCard.scss'

const ProductCard = ({ image, title, subtitle, price, badge, href = '#' }) => {
  return (
    <div className="product-card">
      <Link to={href} className="product-card__image-wrapper">
        {badge && <span className="product-card__badge">{badge}</span>}
        <img src={image} alt={title} className="product-card__image" loading="lazy"  decoding="async"/>
      </Link>
      <div className="product-card__content">
        <h3 className="product-card__title">{title}</h3>
        {subtitle && <p className="product-card__subtitle">{subtitle}</p>}
        <p className="product-card__price">{price}</p>
        <Button variant="secondary" size="sm" href={href}>
          Learn more
        </Button>
      </div>
    </div>
  )
}

export default ProductCard
