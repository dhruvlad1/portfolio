import { useEffect, useRef, useState } from 'react'

function parseValue(value) {
  const match = value.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: '', number: 0, suffix: value, decimals: 0, comma: false }
  const numberText = match[2]
  return {
    prefix: match[1],
    number: Number(numberText.replace(/,/g, '')),
    suffix: match[3],
    decimals: (numberText.split('.')[1] || '').length,
    comma: numberText.includes(','),
  }
}

function formatNumber(number, decimals, comma) {
  const fixed = number.toFixed(decimals)
  if (!comma) return fixed
  const [whole, fraction] = fixed.split('.')
  return `${Number(whole).toLocaleString('en-US')}${fraction ? `.${fraction}` : ''}`
}

function CountUp({ value }) {
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const parsed = parseValue(value)
  const [displayed, setDisplayed] = useState(reducedMotion ? parsed.number : 0)
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const observerRef = useRef(null)
  const currentRef = useRef(displayed)
  const hasAnimatedRef = useRef(reducedMotion)
  const previousNumberRef = useRef(parsed.number)

  useEffect(() => {
    const animate = (from, to, duration) => {
      window.cancelAnimationFrame(rafRef.current)
      const startedAt = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - ((1 - progress) ** 3)
        const next = from + (to - from) * eased
        currentRef.current = next
        setDisplayed(next)
        if (progress < 1) rafRef.current = requestAnimationFrame(tick)
        else rafRef.current = null
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (reducedMotion) return undefined
    const element = containerRef.current
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true
        animate(0, parsed.number, 1200)
        observerRef.current.disconnect()
      }
    }, { threshold: 0.6 })
    observerRef.current.observe(element)
    return () => {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      observerRef.current?.disconnect()
    }
  }, [parsed.number, reducedMotion])

  useEffect(() => {
    if (reducedMotion || !hasAnimatedRef.current || previousNumberRef.current === parsed.number) return
    const from = currentRef.current
    previousNumberRef.current = parsed.number
    const startedAt = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / 600, 1)
      const eased = 1 - ((1 - progress) ** 3)
      const next = from + (parsed.number - from) * eased
      currentRef.current = next
      setDisplayed(next)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      else rafRef.current = null
    }
    window.cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafRef.current)
  }, [parsed.number, reducedMotion])

  const formatted = `${parsed.prefix}${formatNumber(displayed, parsed.decimals, parsed.comma)}${parsed.suffix}`
  return (
    <span ref={containerRef} className="count-up">
      <span className="count-up-size" aria-hidden="true">{value}</span>
      <span className="count-up-value" aria-hidden="true">{formatted}</span>
      <span className="sr-only">{value}</span>
    </span>
  )
}

export default CountUp
