import { useEffect, useRef } from 'react'

const DOT_SPACING = 26
const MAX_DPR = 2

function parseColor(value) {
  const match = value.match(/\d+(?:\.\d+)?/g)
  if (match?.length >= 3) return match.slice(0, 3).map(Number)
  const hex = value.trim().replace('#', '')
  if (hex.length === 6) return [0, 1, 2].map((index) => parseInt(hex.slice(index * 2, index * 2 + 2), 16))
  return [255, 255, 255]
}

function rgba(color, alpha) {
  return `rgba(${color.join(',')},${alpha})`
}

function HeroDots() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return undefined

    const context = canvas.getContext('2d')
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let dpr = 1
    let textColor = [255, 255, 255]
    let accentColor = [255, 255, 255]
    let target = { x: 0, y: 0 }
    let pointer = { x: 0, y: 0 }
    let targetAlpha = 0
    let alpha = 0
    let frameId = null
    let visible = true
    let eligible = mediaQuery.matches && !reducedMotionQuery.matches

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement)
      textColor = parseColor(styles.getPropertyValue('--text'))
      accentColor = parseColor(styles.getPropertyValue('--accent'))
    }

    const draw = () => {
      if (!width || !height) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.save()
      context.scale(dpr, dpr)
      for (let y = 0; y <= height; y += DOT_SPACING) {
        for (let x = 0; x <= width; x += DOT_SPACING) {
          const distance = Math.hypot(x - pointer.x, y - pointer.y)
          const influence = eligible ? Math.max(0, 1 - distance / 170) * alpha : 0
          const radius = 1.1 + influence * 2.5
          const color = textColor.map((channel, index) => Math.round(channel + (accentColor[index] - channel) * influence))
          context.beginPath()
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.fillStyle = rgba(color, 0.14 + influence * 0.5)
          context.fill()
        }
      }
      context.restore()
    }

    const animate = () => {
      frameId = null
      if (!visible) return
      pointer.x += (target.x - pointer.x) * 0.15
      pointer.y += (target.y - pointer.y) * 0.15
      alpha += (targetAlpha - alpha) * 0.15
      draw()
      if (targetAlpha > 0 || alpha >= 0.01 || Math.abs(pointer.x - target.x) > 0.5 || Math.abs(pointer.y - target.y) > 0.5) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    const startAnimation = () => {
      if (eligible && visible && frameId === null) frameId = window.requestAnimationFrame(animate)
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width = window.innerWidth
      height = rect.height + 64
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.ceil(width * dpr)
      canvas.height = Math.ceil(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      draw()
    }

    const setPointer = (event) => {
      const rect = canvas.getBoundingClientRect()
      const parentRect = parent.getBoundingClientRect()
      const inside = event.clientX >= parentRect.left
        && event.clientX <= parentRect.right
        && event.clientY >= parentRect.top
        && event.clientY <= parentRect.bottom
      if (inside && eligible) {
        target.x = event.clientX - rect.left
        target.y = event.clientY - rect.top
        targetAlpha = 1
      } else {
        targetAlpha = 0
      }
      startAnimation()
    }

    const themeChanged = () => {
      readColors()
      draw()
    }

    const visibilityChanged = () => {
      visible = document.visibilityState === 'visible'
      if (visible) {
        draw()
        startAnimation()
      } else if (frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    const mediaChanged = () => {
      eligible = mediaQuery.matches && !reducedMotionQuery.matches
      targetAlpha = 0
      alpha = 0
      if (eligible) bindInteractive()
      else unbindInteractive()
      readColors()
      draw()
    }
    const pointerLeftWindow = (event) => {
      if (!event.relatedTarget) {
        targetAlpha = 0
        startAnimation()
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === 'visible'
      if (visible) startAnimation()
      else if (frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    }, { threshold: 0 })
    const resizeObserver = new ResizeObserver(resize)
    const themeObserver = new MutationObserver(themeChanged)
    let interactiveBound = false
    const bindInteractive = () => {
      if (interactiveBound) return
      interactiveBound = true
      observer.observe(parent)
      window.addEventListener('pointermove', setPointer, { passive: true })
      document.addEventListener('visibilitychange', visibilityChanged)
      document.addEventListener('pointerout', pointerLeftWindow)
    }
    const unbindInteractive = () => {
      if (!interactiveBound) return
      interactiveBound = false
      observer.unobserve(parent)
      window.removeEventListener('pointermove', setPointer)
      document.removeEventListener('visibilitychange', visibilityChanged)
      document.removeEventListener('pointerout', pointerLeftWindow)
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
    }

    readColors()
    resize()
    resizeObserver.observe(parent)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    mediaQuery.addEventListener('change', mediaChanged)
    reducedMotionQuery.addEventListener('change', mediaChanged)
    if (eligible) bindInteractive()

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      observer.disconnect()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      unbindInteractive()
      mediaQuery.removeEventListener('change', mediaChanged)
      reducedMotionQuery.removeEventListener('change', mediaChanged)
    }
  }, [])

  return <canvas className="hero-dots" ref={canvasRef} aria-hidden="true" />
}

export default HeroDots
