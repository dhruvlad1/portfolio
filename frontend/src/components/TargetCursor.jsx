import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import useCursor from '../hooks/useCursor'
import './TargetCursor.css'

const idlePositions = [
  { x: -14, y: -14 },
  { x: 2, y: -14 },
  { x: 2, y: 2 },
  { x: -14, y: 2 },
]

function TargetCursor({
  targetSelector = 'a[href], button, [data-cursor="target"], .media-frame',
  spinDuration = 6,
  hideDefaultCursor = true,
}) {
  const { enabled } = useCursor() || {}
  const wrapperRef = useRef(null)
  const dotRef = useRef(null)
  const cornersRef = useRef([])

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-target-cursor')
      return undefined
    }

    const wrapper = wrapperRef.current
    const dot = dotRef.current
    const corners = cornersRef.current
    const pointer = { x: 0, y: 0 }
    let lockedTarget = null
    let spinning = null
    let spinDelay = null
    let inside = false

    const setIdlePositions = (duration = 0.25) => {
      corners.forEach((corner, index) => {
        gsap.to(corner, {
          ...idlePositions[index],
          duration,
          ease: 'power2.out',
          overwrite: true,
        })
      })
    }

    const startSpinning = () => {
      spinning?.kill()
      spinning = gsap.timeline({ repeat: -1 })
        .to(wrapper, { rotation: '+=360', duration: spinDuration, ease: 'none' })
    }

    const releaseTarget = () => {
      if (!lockedTarget) return
      lockedTarget = null
      wrapper.classList.remove('is-locked')
      gsap.killTweensOf(wrapper)
      gsap.to(wrapper, {
        rotation: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      })
      setIdlePositions()
      spinDelay?.kill()
      spinDelay = gsap.delayedCall(0.25, startSpinning)
    }

    const getTargetPositions = () => {
      const rect = lockedTarget.getBoundingClientRect()
      const padding = 4
      return [
        { x: rect.left - padding - pointer.x, y: rect.top - padding - pointer.y },
        { x: rect.right + padding - 12 - pointer.x, y: rect.top - padding - pointer.y },
        { x: rect.right + padding - 12 - pointer.x, y: rect.bottom + padding - 12 - pointer.y },
        { x: rect.left - padding - pointer.x, y: rect.bottom + padding - 12 - pointer.y },
      ]
    }

    const syncTarget = () => {
      if (!lockedTarget) return
      const rect = lockedTarget.getBoundingClientRect()
      if (!lockedTarget.isConnected || rect.width === 0 || rect.height === 0) {
        releaseTarget()
        return
      }

      const positions = getTargetPositions()
      corners.forEach((corner, index) => gsap.set(corner, positions[index]))
    }

    const lockTarget = (target) => {
      if (!target || target === lockedTarget) return
      spinning?.kill()
      spinDelay?.kill()
      lockedTarget = target
      wrapper.classList.add('is-locked')
      const rotation = Number(gsap.getProperty(wrapper, 'rotation')) || 0
      const shortestRotation = ((rotation + 180) % 360) - 180
      gsap.set(wrapper, { rotation: shortestRotation })
      gsap.to(wrapper, {
        rotation: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      })
      const positions = getTargetPositions()
      corners.forEach((corner, index) => {
        gsap.to(corner, {
          ...positions[index],
          duration: 0.25,
          ease: 'power2.out',
          overwrite: true,
        })
      })
    }

    const move = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      inside = true
      wrapper.classList.add('is-visible')
      gsap.to(wrapper, { x: pointer.x, y: pointer.y, duration: 0.1, ease: 'power3.out', overwrite: true })
    }

    const mouseOver = (event) => {
      const target = event.target.closest?.(targetSelector)
      if (target) lockTarget(target)
    }

    const mouseOut = (event) => {
      if (!lockedTarget) return
      const relatedTarget = event.relatedTarget
      if (!relatedTarget || !lockedTarget.contains(relatedTarget)) releaseTarget()
    }

    const hide = () => {
      inside = false
      wrapper.classList.remove('is-visible')
    }

    const show = () => {
      if (inside) wrapper.classList.add('is-visible')
    }

    const press = () => {
      gsap.to(dot, { scale: 0.7, duration: 0.15, overwrite: true })
      gsap.to(wrapper, { scale: 0.92, duration: 0.15, overwrite: true })
    }

    const releasePress = () => {
      gsap.to(dot, { scale: 1, duration: 0.15, overwrite: true })
      gsap.to(wrapper, { scale: 1, duration: 0.15, overwrite: true })
    }

    const handleTicker = () => {
      syncTarget()
    }

    if (hideDefaultCursor) document.documentElement.classList.add('has-target-cursor')
    gsap.set(wrapper, { x: 0, y: 0, rotation: 0, transformOrigin: 'center center' })
    gsap.set(dot, { xPercent: -50, yPercent: -50 })
    setIdlePositions(0)
    startSpinning()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('mouseover', mouseOver)
    window.addEventListener('mouseout', mouseOut)
    window.addEventListener('pointerleave', hide)
    window.addEventListener('pointerenter', show)
    window.addEventListener('blur', hide)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', releasePress)
    gsap.ticker.add(handleTicker)

    return () => {
      document.documentElement.classList.remove('has-target-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('mouseover', mouseOver)
      window.removeEventListener('mouseout', mouseOut)
      window.removeEventListener('pointerleave', hide)
      window.removeEventListener('pointerenter', show)
      window.removeEventListener('blur', hide)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', releasePress)
      gsap.ticker.remove(handleTicker)
      spinning?.kill()
      spinDelay?.kill()
      gsap.killTweensOf([wrapper, dot, ...corners])
    }
  }, [enabled, hideDefaultCursor, spinDuration, targetSelector])

  if (!enabled) return null

  return (
    <div className="target-cursor-wrapper" ref={wrapperRef} aria-hidden="true">
      <span className="target-cursor-dot" ref={dotRef} />
      {['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((position, index) => (
        <span
          className={`target-cursor-corner target-cursor-corner--${position}`}
          ref={(element) => { cornersRef.current[index] = element }}
          key={position}
        />
      ))}
    </div>
  )
}

export default TargetCursor
