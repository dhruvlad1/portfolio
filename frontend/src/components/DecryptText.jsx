import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}=+*^?#'
const STATIC_CHARS = new Set([' ', '·', '–', '.'])

function scramble(text) {
  return [...text].map((character) => (
    STATIC_CHARS.has(character) ? character : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  )).join('')
}

function DecryptText({
  text,
  as: Element = 'span',
  trigger = 'view',
  duration = 800,
  className = '',
}) {
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const canAnimate = !reducedMotion && (trigger === 'mount' || trigger === 'view')
  const [displayText, setDisplayText] = useState(() => canAnimate ? scramble(text) : text)
  const [revealedCount, setRevealedCount] = useState(() => canAnimate ? 0 : text.length)
  const wrapperRef = useRef(null)
  const runningRef = useRef(false)
  const hasRunRef = useRef(false)
  const rafRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) {
      return undefined
    }

    const finish = () => {
      runningRef.current = false
      hasRunRef.current = true
      rafRef.current = null
      setDisplayText(text)
    }

    const start = (runDuration = duration, canRepeat = false) => {
      if (runningRef.current || (!canRepeat && hasRunRef.current)) return
      runningRef.current = true
      setRevealedCount(0)
      setDisplayText(scramble(text))
      const startedAt = performance.now()
      let lastTick = startedAt

      const tick = (now) => {
        if (now - lastTick < 30) {
          rafRef.current = requestAnimationFrame(tick)
          return
        }
        lastTick = now
        const progress = Math.min((now - startedAt) / runDuration, 1)
        const revealed = Math.floor(progress * text.length)
        setRevealedCount(revealed)
        setDisplayText([...text].map((character, index) => (
          index < revealed || STATIC_CHARS.has(character)
            ? character
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        )).join(''))
        if (progress >= 1) {
          finish()
          return
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const element = wrapperRef.current
    if (!element) return undefined

    let observer
    if (trigger === 'mount') {
      timeoutRef.current = window.setTimeout(() => start(), 150)
    } else if (trigger === 'view') {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          start()
          observer.disconnect()
        }
      }, { threshold: 0.6 })
      observer.observe(element)
    }

    const handlePointerEnter = () => {
      if (trigger === 'hover') start(400, true)
    }
    const handleFocus = () => {
      if (trigger === 'hover') start(400, true)
    }
    if (trigger === 'hover') {
      element.addEventListener('mouseenter', handlePointerEnter)
      element.addEventListener('focusin', handleFocus)
    }

    return () => {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      runningRef.current = false
      if (observer) observer.disconnect()
      if (trigger === 'hover') {
        element.removeEventListener('mouseenter', handlePointerEnter)
        element.removeEventListener('focusin', handleFocus)
      }
    }
  }, [duration, reducedMotion, text, trigger])

  return (
    <Element ref={wrapperRef} className={`decrypt-text${className ? ` ${className}` : ''}`}>
      <span className="decrypt-text-size" aria-hidden="true">{text}</span>
      <span className="decrypt-text-animation" aria-hidden="true">
        {[...displayText].map((character, index) => (
          <span className={index < revealedCount || STATIC_CHARS.has(text[index]) ? 'decrypt-text-revealed' : 'decrypt-text-scrambled'} key={`${index}-${text[index]}`}>
            {character}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </Element>
  )
}

export default DecryptText
