import { useEffect, useRef, useState } from 'react'
import './MembershipSection.scss'

const videoSources = [
  { minWidth: 1536, base: '/images/h-membership-main_1536' },
  { minWidth: 1344, base: '/images/h-membership-main_1344-1535' },
  { minWidth: 1152, base: '/images/h-membership-main_1152-1343' },
  { minWidth: 960, base: '/images/h-membership-main_960-1151' },
  { minWidth: 768, base: '/images/h-membership-main_768-959' },
  { minWidth: 576, base: '/images/h-membership-main_576-767' },
  { minWidth: 0, base: '/images/h-membership-main_max575' },
]

const getVideoSrc = (width) => {
  for (const src of videoSources) {
    if (width >= src.minWidth) return src.base
  }
  return videoSources[videoSources.length - 1].base
}

const MembershipSection = () => {
  const videoRef = useRef(null)
  const [videoBase, setVideoBase] = useState(() => getVideoSrc(typeof window !== 'undefined' ? window.innerWidth : 1200))

  useEffect(() => {
    const handleResize = () => {
      const newBase = getVideoSrc(window.innerWidth)
      if (newBase !== videoBase) {
        setVideoBase(newBase)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [videoBase])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [videoBase])

  return (
    <section className="membership">
      <div className="membership__inner">
        <div className="membership__content">
          <h2 className="membership__heading">
            Expert support whenever 
            <br />
            you need it
          </h2>

          <ul className="membership__list">
            <li className="membership__list-item">
              <span className="membership__check">&#10003;</span>
              Personalized treatment guidance
            </li>
            <li className="membership__list-item">
              <span className="membership__check">&#10003;</span>
              Access to licensed providers
            </li>
            <li className="membership__list-item">
              <span className="membership__check">&#10003;</span>
              Ongoing progress tracking
            </li>
          </ul>

          <button className="membership__btn" aria-disabled="true">Start your consultation</button>
        </div>

        <div className="membership__video-wrap">
          <video
            ref={videoRef}
            className="membership__video"
            autoPlay
            muted
            loop
            playsInline
            key={videoBase}
           preload="metadata">
            <source src={`${videoBase}.webm`} type="video/webm" />
            {/* MP4 fallback disabled — webm only.
                Re-enable for older browsers:
                <source src={`${videoBase}.mp4`} type="video/mp4" /> */}
          </video>
        </div>
      </div>
    </section>
  )
}

export default MembershipSection
