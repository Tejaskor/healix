import Container from '@/components/common/Container/Container'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import ProductCard from '@/components/common/ProductCard/ProductCard'
import { products } from '@/data/products'
import './ProductShowcase.scss'

const ProductShowcase = () => {
  return (
    <section className="product-showcase">
      <Container>
        <SectionHeading
          title="Popular treatments"
          subtitle="Clinically proven solutions trusted by millions of men"
        />
        <div className="product-showcase__grid">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default ProductShowcase
