import { useEffect, useRef } from 'react'

function CursorGrid() {
  const gridRef = useRef(null)

  useEffect(() => {
    const element = gridRef.current
    if (!element) return undefined

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return undefined

    let frameId = null
    let visible = document.visibilityState === 'visible'
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let targetAlpha = 0
    let currentAlpha = 0

    const stop = () => {
      frameId = null
    }

    const animate = () => {
      frameId = null
      if (!visible) return
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18
      currentAlpha += (targetAlpha - currentAlpha) * 0.15
      element.style.setProperty('--cursor-x', `${currentX}px`)
      element.style.setProperty('--cursor-y', `${currentY}px`)
      element.style.setProperty('--cursor-alpha', String(currentAlpha))
      const settling = Math.abs(targetX - currentX) > 0.5
        || Math.abs(targetY - currentY) > 0.5
        || Math.abs(targetAlpha - currentAlpha) > 0.01
      if (settling || targetAlpha > 0) frameId = window.requestAnimationFrame(animate)
      else stop()
    }

    const start = () => {
      if (frameId === null && visible) frameId = window.requestAnimationFrame(animate)
    }

    const move = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      targetAlpha = 1
      start()
    }

    const leave = (event) => {
      if (!event.relatedTarget) {
        targetAlpha = 0
        start()
      }
    }

    const visibilityChange = () => {
      visible = document.visibilityState === 'visible'
      if (visible) start()
      else if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', leave)
    document.addEventListener('visibilitychange', visibilityChange)

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', leave)
      document.removeEventListener('visibilitychange', visibilityChange)
    }
  }, [])

  return <div className="cursor-grid" ref={gridRef} aria-hidden="true" />
}

export default CursorGrid
