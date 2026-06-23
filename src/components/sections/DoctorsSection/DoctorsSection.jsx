import { useRef, useEffect } from 'react'
import DoctorCard from '@/components/common/DoctorCard/DoctorCard'
import { doctors } from '@/data/doctors'
import './DoctorsSection.scss'

const DoctorsSection = () => {
  const trackRef = useRef(null)

  // Simple click-and-drag to scroll for desktop mice. Native scroll
  // (trackpad gesture / touch swipe) works without any JS thanks to
  // `overflow-x: auto` on the track. No elastic / rubber-band logic.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let isDown = false
    let startX = 0
    let scrollStart = 0

    const onMouseDown = (e) => {
      isDown = true
      startX = e.pageX
      scrollStart = track.scrollLeft
      track.style.scrollBehavior = 'auto' // 1:1 drag, no smoothing
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      track.scrollLeft = scrollStart - (e.pageX - startX)
    }

    const onMouseUp = () => {
      isDown = false
      track.style.scrollBehavior = '' // restore smooth scroll
    }

    track.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      track.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <section className="doctors">
      <div className="doctors__header">
        <h2 className="doctors__title-line1">Care led by experts</h2>
        <h2 className="doctors__title-line2">focused on better outcomes</h2>
        <p className="doctors__subtitle">
         A team of specialists delivering modern personalized healthcare.
        </p>
      </div>

      <div className="doctors__track" ref={trackRef}>
        {doctors.map((doc) => (
          <div key={doc.id} className="doctors__card-wrap">
            <DoctorCard {...doc} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default DoctorsSection
