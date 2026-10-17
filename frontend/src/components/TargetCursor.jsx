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
    let lastTarget = null
    let spinTl = null
    let spinDelay = null
    const snap = { value: 0 }

    const setIdlePositions = () => {
      corners.forEach((corner, index) => {
        gsap.set(corner, idlePositions[index])
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

    const getInterpolatedPositions = (target) => {
      const targetPositions = getTargetPositions(target)
      return targetPositions.map((position, index) => ({
        x: idlePositions[index].x + (position.x - idlePositions[index].x) * snap.value,
        y: idlePositions[index].y + (position.y - idlePositions[index].y) * snap.value,
      }))
    }

    const finishRelease = () => {
      if (activeTarget) return
      lastTarget = null
      snap.value = 0
      setIdlePositions()
      startSpinning()
    }

    const releaseTarget = () => {
      if (!activeTarget) return
      lastTarget = activeTarget
      activeTarget = null
      wrapper.classList.remove('is-locked')
      spinTl?.kill()
      spinDelay?.kill()
      gsap.to(snap, {
        value: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: finishRelease,
      })
    }

    const lockTarget = (target) => {
      if (!target || target === activeTarget) return
      spinTl?.kill()
      spinDelay?.kill()
      gsap.killTweensOf(spinner)
      activeTarget = target
      lastTarget = target
      gsap.set(spinner, { rotation: 0 })
      wrapper.classList.add('is-locked')
      gsap.to(snap, {
        value: 1,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const move = (event) => {
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
      wrapper.classList.remove('is-visible')
    }

    const show = (event) => {
      wrapper.classList.add('is-visible')
      if (event) {
        gsap.to(wrapper, {
          x: event.clientX,
          y: event.clientY,
          duration: 0.1,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) hide()
    }

    const press = () => {
      gsap.to(dot, { scale: 0.7, duration: 0.15, overwrite: 'auto' })
      if (!activeTarget) {
        gsap.to(spinner, { scale: 0.92, duration: 0.15, overwrite: 'auto' })
      }
    }

    const releasePress = () => {
      gsap.to(dot, { scale: 1, duration: 0.15, overwrite: 'auto' })
      gsap.to(spinner, { scale: 1, duration: 0.15, overwrite: 'auto' })
    }

    const handleTicker = () => {
      if (!lastTarget || snap.value <= 0) return
      const rect = lastTarget.getBoundingClientRect()
      if (!lastTarget.isConnected || rect.width === 0 || rect.height === 0) {
        if (activeTarget) releaseTarget()
        else finishRelease()
        return
      }
      const positions = getInterpolatedPositions(lastTarget)
      corners.forEach((corner, index) => gsap.set(corner, positions[index]))
    }

    if (hideDefaultCursor) document.documentElement.classList.add('has-target-cursor')
    gsap.set(wrapper, { x: 0, y: 0 })
    gsap.set(spinner, { rotation: 0 })
    setIdlePositions()
    startSpinning()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('mouseover', mouseOver)
    window.addEventListener('mouseout', mouseOut)
    document.documentElement.addEventListener('mouseleave', hide)
    document.documentElement.addEventListener('mouseenter', show)
    window.addEventListener('blur', hide)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', releasePress)
    gsap.ticker.add(handleTicker)

    return () => {
      document.documentElement.classList.remove('has-target-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('mouseover', mouseOver)
      window.removeEventListener('mouseout', mouseOut)
      document.documentElement.removeEventListener('mouseleave', hide)
      document.documentElement.removeEventListener('mouseenter', show)
      window.removeEventListener('blur', hide)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
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
