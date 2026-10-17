import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import Rich, { parseRich } from './Rich'

function RevealWord({ word, index, total, progress, type }) {
  const start = total > 1 ? (index / (total - 1)) * 0.9 : 0
  const end = Math.min(start + 0.2, 1)
  const opacity = useTransform(progress, [start, end], [0.18, 1])
  const blur = useTransform(progress, [start, end], ['blur(4px)', 'blur(0px)'])
  return (
    <motion.span className={type === 'hl' ? 'hl' : type === 'warm' ? 'hl hl-warm' : undefined} style={{ opacity, filter: blur }}>
      {word}
    </motion.span>
  )
}

function ScrollRevealText({ text, className = '' }) {
  const paragraphRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.85', 'start 0.4'],
  })

  if (shouldReduceMotion) return <p className={className}><Rich text={text} /></p>

  const words = parseRich(text).flatMap((token) => {
    const parts = token.text.split(/(\s+)/)
    return parts.filter(Boolean).map((part) => ({ text: part, type: token.type }))
  })
  const wordCount = words.filter(({ text: word }) => !/^\s+$/.test(word)).length

  return (
    <p ref={paragraphRef} className={className}>
      {words.map(({ text: word, type }, index) => {
        if (/^\s+$/.test(word)) return word
        const currentIndex = words.slice(0, index).filter(({ text: previousWord }) => !/^\s+$/.test(previousWord)).length
        return <RevealWord key={`${word}-${index}`} word={word} index={currentIndex} total={wordCount} progress={scrollYProgress} type={type} />
      })}
    </p>
  )
}

export default ScrollRevealText
