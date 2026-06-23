import { useState, useEffect, useRef } from 'react'
import './SciencePage.scss'

const videoSources = [
  { minWidth: 1536, base: '/images/h-WL-NN-Pill-D_min1536' },
  { minWidth: 1344, base: '/images/h-WL-NN-Pill-D_1344-1535' },
  { minWidth: 1152, base: '/images/h-WL-NN-Pill-D_1152-1343' },
  { minWidth: 960, base: '/images/h-WL-NN-Pill-D._960-1151' },
  { minWidth: 768, base: '/images/h-WL-NN-Pill-D_768-959' },
  { minWidth: 576, base: '/images/h-WL-NN-Pill-D_576-767' },
  { minWidth: 0, base: '/images/h-WL-NN-Pill-D_max575' },
]

const getVideoBase = (w) => {
  for (const src of videoSources) {
    if (w >= src.minWidth) return src.base
  }
  return videoSources[videoSources.length - 1].base
}

const SciencePage = () => {
  const videoRef = useRef(null)
  const [videoBase, setVideoBase] = useState(() =>
    getVideoBase(typeof window !== 'undefined' ? window.innerWidth : 1200)
  )

  useEffect(() => {
    const onResize = () => {
      const newBase = getVideoBase(window.innerWidth)
      if (newBase !== videoBase) setVideoBase(newBase)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [videoBase])

  useEffect(() => {
    if (videoRef.current) videoRef.current.load()
  }, [videoBase])

  return (
    <div className="science-page">
      {/* Video Hero */}
      <section className="science-hero">
        <video
          ref={videoRef}
          className="science-hero__video"
          autoPlay
          muted
          loop
          playsInline
          key={videoBase}
         preload="metadata">
          <source src={`${videoBase}.webm`} type="video/webm" />
          {/* MP4 fallback disabled — webm is the only source.
              Re-enable for older browsers if needed:
              <source src={`${videoBase}.mp4`} type="video/mp4" /> */}
        </video>

        <div className="science-hero__content">
          <h1 className="science-hero__heading">
            A smarter way
            <br />
            to lose weight
          </h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="science-intro" aria-label="Science intro">
        <img
          src="/images/h-WL-Science-Intro-Padding-Blur-01.webp"
          alt=""
          className="science-intro__img"
         loading="lazy" decoding="async"/>
      </section>

      {/* Biology Section */}
      <section className="science-biology" aria-label="Inspired by biology">
        <img
          src="/images/h-WL-Science-Biology-Padding.webp"
          alt=""
          className="science-biology__bg"
         loading="lazy" decoding="async"/>
        <div className="science-biology__content">
          <div className="science-biology__inner">
            <div className="science-biology__left">
              <img
                src="/images/h-wl-science--how-it-works--inspired-by-biology-text--d.webp"
                alt="Inspired by biology"
                className="science-biology__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Precision Section */}
      <section className="science-precision" aria-label="Developed with precision">
        <img
          src="/images/h-WL-Science-Precision-Padding-D.webp"
          alt=""
          className="science-precision__bg"
         loading="lazy" decoding="async"/>
        <div className="science-precision__content">
          <div className="science-precision__inner">
            <div className="science-precision__left">
              <img
                src="/images/h-wl-science--how-it-works--developed-precision-text--d.webp"
                alt="Developed with precision"
                className="science-precision__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* SNAC Section */}
      <section className="science-snac" aria-label="SNAC technology">
        <img
          src="/images/h-WL-Science-SNAC-Padding-D.webp"
          alt=""
          className="science-snac__bg"
         loading="lazy" decoding="async"/>
        <div className="science-snac__content">
          <div className="science-snac__inner">
            <div className="science-snac__left">
              <img
                src="/images/h-wl-science--how-it-works--snac-tech-text--d.webp"
                alt="SNAC technology"
                className="science-snac__img"
               loading="lazy" decoding="async"/>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Footer Section */}
      <section className="science-soft-footer" aria-label="Science soft footer">
        <img
          src="/images/HH-WL-Science-SoftFooter-D.webp"
          alt=""
          className="science-soft-footer__img"
         loading="lazy" decoding="async"/>
      </section>

      {/* Disclaimer Section */}
      <section className="science-disclaimer" aria-label="Disclaimer">
        <div className="science-disclaimer__inner">
          <p className="science-disclaimer__text">
            <sup>1</sup>GLP-1 medications have been studied in preclinical models. Their full effects are still being researched.
          </p>
          <p className="science-disclaimer__text">
            <sup>2</sup>Research on GLP-1 medications is ongoing, and effects may vary.
          </p>
        </div>
      </section>

    </div>
  )
}

export default SciencePage
