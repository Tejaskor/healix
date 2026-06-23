import { useState } from 'react'
import Container from '@/components/common/Container/Container'
import Pill from '@/components/common/Pill/Pill'
import { categories } from '@/data/categories'
import './CategoryPills.scss'

const CategoryPills = () => {
  const [activeId, setActiveId] = useState(null)

  return (
    <section className="category-pills">
      <Container>
        <div className="category-pills__wrapper">
          {categories.map((cat) => (
            <Pill
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              active={activeId === cat.id}
              onClick={() => setActiveId(cat.id)}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default CategoryPills
