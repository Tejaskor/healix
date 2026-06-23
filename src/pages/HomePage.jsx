import Hero from '@/components/sections/Hero/Hero'
import WegovySpotlight from '@/components/sections/WegovySpotlight/WegovySpotlight'
import TestosteroneSection from '@/components/sections/TestosteroneSection/TestosteroneSection'
import ImageMarquee from '@/components/sections/ImageMarquee/ImageMarquee'
import DoctorsSection from '@/components/sections/DoctorsSection/DoctorsSection'
import EmailSignup from '@/components/sections/EmailSignup/EmailSignup'

const HomePage = () => {
  return (
    <>
      <Hero />
      <WegovySpotlight />
      <TestosteroneSection />
      <ImageMarquee />
<DoctorsSection />
      <EmailSignup />
    </>
  )
}

export default HomePage
