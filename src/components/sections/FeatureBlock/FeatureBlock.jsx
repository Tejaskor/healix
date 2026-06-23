import Container from '@/components/common/Container/Container'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Button from '@/components/common/Button/Button'
import './FeatureBlock.scss'

const FeatureBlock = ({ title, description, image, variant = 'left', cta }) => {
  return (
    <section className={`feature-block feature-block--${variant}`}>
      <Container>
        <div className="feature-block__grid">
          <div className="feature-block__image-col">
            <div className="feature-block__image-wrapper">
              <img
                src={image}
                alt={title}
                className="feature-block__image"
                loading="lazy"
               decoding="async"/>
            </div>
          </div>
          <div className="feature-block__content-col">
            <SectionHeading title={title} subtitle={description} align="left" />
            {cta && (
              <Button variant="primary" href={cta.href}>
                {cta.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FeatureBlock
