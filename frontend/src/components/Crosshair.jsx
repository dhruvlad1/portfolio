import { useEffect, useRef } from 'react'
import useCursor from '../hooks/useCursor'
import './Crosshair.css'

function Crosshair() {
  const { enabled } = useCursor() || {}
  const rootRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, inside: false, target: null })

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('crosshair-enabled')
      return undefined
    }

    const root = rootRef.current
    const pointer = pointerRef.current
    let frameId = 0
    let dirty = true

    const update = () => {
      if (dirty) {
        const { x, y, inside, target } = pointer
        root.classList.toggle('is-visible', inside)
        root.classList.toggle('is-target', Boolean(target))
        root.style.setProperty('--cursor-x', `${x}px`)
        root.style.setProperty('--cursor-y', `${y}px`)
        root.querySelector('.crosshair-coordinates').textContent = `x ${Math.round(x)} · y ${Math.round(y)}`

        if (target) {
          const bounds = target.getBoundingClientRect()
          root.style.setProperty('--target-left', `${bounds.left}px`)
          root.style.setProperty('--target-top', `${bounds.top}px`)
          root.style.setProperty('--target-width', `${bounds.width}px`)
          root.style.setProperty('--target-height', `${bounds.height}px`)
        }
        dirty = false
      }
      frameId = requestAnimationFrame(update)
    }

    const updatePointer = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.target = event.target.closest?.('a, button, [data-cursor="target"]') || null
      pointer.inside = true
      dirty = true
    }
    const hide = () => {
      pointer.inside = false
      pointer.target = null
      dirty = true
    }
    const handleScroll = () => { dirty = true }

    document.documentElement.classList.add('crosshair-enabled')
    window.addEventListener('pointermove', updatePointer, { passive: true })
    window.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('scroll', handleScroll, { passive: true })
    frameId = requestAnimationFrame(update)

    return () => {
      document.documentElement.classList.remove('crosshair-enabled')
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frameId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="crosshair" ref={rootRef} aria-hidden="true">
      <span className="crosshair-line crosshair-line-horizontal" />
      <span className="crosshair-line crosshair-line-vertical" />
      <span className="crosshair-mark" />
      <span className="crosshair-target" />
      <span className="crosshair-coordinates">x 0 · y 0</span>
    </div>
  )
}

export default Crosshair
