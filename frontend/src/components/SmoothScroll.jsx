import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { setLenis } from './lenisInstance'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    })
    let frameId
    lenisRef.current = lenis
    setLenis(lenis)

    const animate = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(animate)
    }

    const scrollToHash = (hash, immediate = false) => {
      if (!hash) return
      const targetElement = hash === '#top' ? document.getElementById('top') : document.querySelector(hash)
      if (!targetElement) return

      const navbar = document.querySelector('.navbar')
      const offset = navbar ? -navbar.getBoundingClientRect().height : 0
      lenis.scrollTo(targetElement, { offset, immediate })
      targetElement.focus({ preventScroll: true })
    }

    const handleClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]')
      if (!anchor || anchor.target === '_blank') return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#' || (hash !== '#top' && !document.querySelector(hash))) return

      event.preventDefault()
      scrollToHash(hash)
      window.history.pushState({}, '', hash)
    }

    const handlePopState = () => {
      scrollToHash(window.location.hash || '#top')
    }

    document.addEventListener('click', handleClick)
    window.addEventListener('popstate', handlePopState)
    if (window.location.hash) scrollToHash(window.location.hash, true)
    frameId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('popstate', handlePopState)
      cancelAnimationFrame(frameId)
      lenis.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [])

  return children
}

export default SmoothScroll
