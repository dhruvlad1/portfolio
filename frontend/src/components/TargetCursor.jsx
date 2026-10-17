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
  const spinnerRef = useRef(null)
  const cornersRef = useRef([])

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-target-cursor')
      return undefined
    }

    const wrapper = wrapperRef.current
    const dot = dotRef.current
    const spinner = spinnerRef.current
    const corners = cornersRef.current
    let activeTarget = null
    let spinTl = null
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
      spinTl?.kill()
      gsap.set(spinner, { rotation: 0 })
      spinTl = gsap.timeline({ repeat: -1 })
        .to(spinner, { rotation: '+=360', duration: spinDuration, ease: 'none' })
    }

    const getTargetPositions = (target) => {
      const rect = target.getBoundingClientRect()
      const pad = 4
      const size = 12
      const wrapperX = Number(gsap.getProperty(wrapper, 'x')) || 0
      const wrapperY = Number(gsap.getProperty(wrapper, 'y')) || 0
      return [
        { x: rect.left - pad - wrapperX, y: rect.top - pad - wrapperY },
        { x: rect.right + pad - size - wrapperX, y: rect.top - pad - wrapperY },
        { x: rect.right + pad - size - wrapperX, y: rect.bottom + pad - size - wrapperY },
        { x: rect.left - pad - wrapperX, y: rect.bottom + pad - size - wrapperY },
      ]
    }

    const releaseTarget = () => {
      if (!activeTarget) return
      activeTarget = null
      wrapper.classList.remove('is-locked')
      corners.forEach((corner, index) => {
        gsap.to(corner, {
          ...idlePositions[index],
          duration: 0.25,
          ease: 'power2.out',
          overwrite: true,
        })
      })
      spinTl?.kill()
      spinDelay?.kill()
      spinDelay = gsap.delayedCall(0.25, startSpinning)
    }

    const lockTarget = (target) => {
      if (!target || target === activeTarget) return
      spinTl?.kill()
      spinDelay?.kill()
      gsap.killTweensOf(spinner)
      activeTarget = target
      gsap.set(spinner, { rotation: 0 })
      wrapper.classList.add('is-locked')
      const positions = getTargetPositions(target)
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
      inside = true
      wrapper.classList.add('is-visible')
      gsap.to(wrapper, { x: event.clientX, y: event.clientY, duration: 0.1, ease: 'power3.out', overwrite: true })
    }

    const mouseOver = (event) => {
      const target = event.target.closest?.(targetSelector)
      if (target) lockTarget(target)
    }

    const mouseOut = (event) => {
      if (!activeTarget) return
      const relatedTarget = event.relatedTarget
      if (!relatedTarget || !activeTarget.contains(relatedTarget)) releaseTarget()
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
      gsap.to(spinner, { scale: 0.92, duration: 0.15, overwrite: true })
    }

    const releasePress = () => {
      gsap.to(dot, { scale: 1, duration: 0.15, overwrite: true })
      gsap.to(spinner, { scale: 1, duration: 0.15, overwrite: true })
    }

    const handleTicker = () => {
      if (!activeTarget) return
      const rect = activeTarget.getBoundingClientRect()
      if (!activeTarget.isConnected || rect.width === 0 || rect.height === 0) {
        releaseTarget()
        return
      }
      const positions = getTargetPositions(activeTarget)
      corners.forEach((corner, index) => gsap.set(corner, positions[index]))
    }

    if (hideDefaultCursor) document.documentElement.classList.add('has-target-cursor')
    gsap.set(wrapper, { x: 0, y: 0 })
    gsap.set(spinner, { rotation: 0 })
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
      spinTl?.kill()
      spinDelay?.kill()
      gsap.killTweensOf([wrapper, dot, spinner, ...corners])
    }
  }, [enabled, hideDefaultCursor, spinDuration, targetSelector])

  if (!enabled) return null

  return (
    <div className="target-cursor-wrapper" ref={wrapperRef} aria-hidden="true">
      <span className="target-cursor-dot" ref={dotRef} />
      <span className="target-cursor-spinner" ref={spinnerRef}>
        {['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((position, index) => (
          <span
            className={`target-cursor-corner target-cursor-corner--${position}`}
            ref={(element) => { cornersRef.current[index] = element }}
            key={position}
          />
        ))}
      </span>
    </div>
  )
}

export default TargetCursor
