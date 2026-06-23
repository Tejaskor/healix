import { useRef, useEffect, useState, useCallback } from 'react'
import './WegovyHero.scss'

const REPEL_RADIUS = 150
const REPEL_STRENGTH = 55
const RETURN_SPEED = 0.06
const DOT_COUNT_DESKTOP = 180
const DOT_COUNT_MOBILE = 70

const WegovyHero = () => {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const dotsData = useRef([])
  const rafRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  const initDots = useCallback((count, w, h) => {
    const dots = []
    // Desktop: original spread. Smaller screens: wider spread to fill bigger image
    const circleRadius = w >= 1280 ? 0.28 : w >= 1024 ? 0.26 : w >= 768 ? 0.28 : 0.3

    // Extra dots at top-left and top-right corners
    const cornerCount = Math.floor(count * 0.15)
    for (let c = 0; c < cornerCount; c++) {
      const side = c % 2 === 0 ? -1 : 1 // alternate left/right
      const xPct = 0.5 + side * (0.15 + Math.random() * 0.18)
      const yPct = 0.06 + Math.random() * 0.14

      dots.push({
        baseX: xPct * w,
        baseY: yPct * h,
        offsetX: 0,
        offsetY: 0,
        size: 3 + Math.random() * 7,
        opacity: 0.35 + Math.random() * 0.45,
        depth: 0.2 + Math.random() * 0.7,
        color: Math.random() > 0.3 ? 'rgba(255,255,255,' : 'rgba(255,216,158,',
        pulseSpeed: 0.8 + Math.random() * 1.2,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const rawRadius = Math.pow(Math.random(), 0.6) * circleRadius
      const xPct = 0.5 + Math.cos(angle) * rawRadius
      const yPct = 0.22 + Math.sin(angle) * (rawRadius * 0.6)

      dots.push({
        baseX: xPct * w,
        baseY: yPct * h,
        offsetX: 0,
        offsetY: 0,
        size: 3 + Math.random() * 9,
        opacity: 0.45 + Math.random() * 0.55,
        depth: 0.1 + Math.random() * 0.9,
        color: Math.random() > 0.25 ? 'rgba(255,255,255,' : (Math.random() > 0.5 ? 'rgba(255,216,158,' : 'rgba(255,228,184,'),
        pulseSpeed: 0.8 + Math.random() * 1.2,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }
    return dots
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    let w = section.offsetWidth
    let h = section.offsetHeight
    canvas.width = w
    canvas.height = h

    const count = isMobile ? DOT_COUNT_MOBILE : DOT_COUNT_DESKTOP
    dotsData.current = initDots(count, w, h)

    const onResize = () => {
      const oldW = w
      const oldH = h
      w = section.offsetWidth
      h = section.offsetHeight
      canvas.width = w
      canvas.height = h
      // Rescale dot positions
      dotsData.current.forEach((dot) => {
        dot.baseX = (dot.baseX / oldW) * w
        dot.baseY = (dot.baseY / oldH) * h
      })
    }

    const onMouseMove = (e) => {
      const rect = section.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 }
    }

    window.addEventListener('resize', onResize)
    section.addEventListener('mousemove', onMouseMove)
    section.addEventListener('mouseleave', onMouseLeave)

    let time = 0
    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let i = 0; i < dotsData.current.length; i++) {
        const dot = dotsData.current[i]

        // Vector from cursor to dot
        const dx = dot.baseX - mx
        const dy = dot.baseY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_RADIUS && dist > 0.5 && mx > 0 && !isMobile) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS)
          const forceEased = force * force
          const strength = REPEL_STRENGTH * (0.6 + dot.depth * 0.8)
          const pushX = (dx / dist) * forceEased * strength
          const pushY = (dy / dist) * forceEased * strength

          dot.offsetX += (pushX - dot.offsetX) * 0.35
          dot.offsetY += (pushY - dot.offsetY) * 0.35
        } else {
          dot.offsetX *= (1 - RETURN_SPEED)
          dot.offsetY *= (1 - RETURN_SPEED)
        }

        // Pulse animation
        const pulse = Math.sin(time * dot.pulseSpeed + dot.pulseOffset)
        const pulseScale = 0.7 + pulse * 0.3
        const pulseOpacity = dot.opacity * (0.4 + pulse * 0.25)

        // Scale boost near cursor
        const visualDist = Math.sqrt(
          (dot.baseX + dot.offsetX - mx) ** 2 +
          (dot.baseY + dot.offsetY - my) ** 2
        )
        const cursorScale = (visualDist < REPEL_RADIUS && mx > 0 && !isMobile)
          ? 1 + ((REPEL_RADIUS - visualDist) / REPEL_RADIUS) * 0.6
          : 1

        const finalSize = dot.size * pulseScale * cursorScale
        const finalX = dot.baseX + dot.offsetX
        const finalY = dot.baseY + dot.offsetY

        // Draw dot
        ctx.beginPath()
        ctx.arc(finalX, finalY, finalSize / 2, 0, Math.PI * 2)
        ctx.fillStyle = dot.color + pulseOpacity.toFixed(2) + ')'
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(finalX, finalY, finalSize / 2 + 2, 0, Math.PI * 2)
        ctx.fillStyle = dot.color + (pulseOpacity * 0.12).toFixed(2) + ')'
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', onResize)
      section.removeEventListener('mousemove', onMouseMove)
      section.removeEventListener('mouseleave', onMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, initDots])

  return (
    <section className="wegovy-hero" ref={sectionRef}>
      {/* Background image */}
      <div className="wegovy-hero__bg">
        <img
          src="/images/h_bg_image_xl (1).png"
          alt=""
          className="wegovy-hero__bg-img"
         loading="lazy" decoding="async"/>
      </div>

      {/* Canvas for dots — much better performance than DOM elements */}
      <canvas ref={canvasRef} className="wegovy-hero__canvas" />

      {/* Content */}
      <div className="wegovy-hero__content">
        <span className="wegovy-hero__tag">Now at Healix</span>
        <h1 className="wegovy-hero__heading">
          Same science.
          <br />
          Better experience.
        </h1>
        <div className="wegovy-hero__buttons">
          <button className="wegovy-hero__btn wegovy-hero__btn--primary" aria-disabled="true">
            <img src="/images/cta_image.png" alt="" className="wegovy-hero__btn-icon"  loading="lazy" decoding="async"/>
            Explore GLP-1 Pill
          </button>
        </div>
      </div>
    </section>
  )
}

export default WegovyHero
