import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import timeline from '../data/timeline'
import Reveal from './Reveal'

function TimelineEntry({ item, delay, child = false }) {
  const dotRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const dotInView = useInView(dotRef, {
    once: true,
    margin: '-20% 0px -20% 0px',
  })
  const dotFilled = shouldReduceMotion || dotInView

  return (
    <Reveal className={child ? 'timeline-child-reveal' : 'timeline-item-inner'} delay={delay}>
      <div className={child ? 'timeline-child-inner' : 'timeline-item-inner-grid'}>
        <div className="timeline-period">
          <span>{item.period}</span>
          <small>{item.type}</small>
        </div>
        <div className={child ? 'timeline-content timeline-child-content' : 'timeline-content'}>
          <motion.span
            ref={dotRef}
            className={`timeline-dot${item.current ? ' is-current' : ''}${child && dotFilled ? ' is-filled' : ''}`}
            aria-hidden="true"
            initial={false}
            animate={child ? { scale: dotFilled ? 1 : 0.85 } : undefined}
            transition={{ duration: 0.15 }}
          />
          <h3>{item.title}</h3>
          <p className="timeline-org">
            {item.org}
            {item.location && <span> · {item.location}</span>}
          </p>
          {item.summary && <p className="timeline-summary">{item.summary}</p>}
          {item.badges && (
            <div className="timeline-badges" aria-label="Highlights">
              {item.badges.map((badge) => <span key={badge}>{badge}</span>)}
            </div>
          )}
          {item.link && (
            <a
              className="timeline-proof-link"
              href={item.link.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${item.link.label} for ${item.title} (opens in a new tab)`}
            >
              {item.link.label}
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  )
}

function TimelineBranch({ item }) {
  const branchRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: branchRef,
    offset: ['start 85%', 'end 60%'],
  })
  const branchLineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div className="timeline-branch" ref={branchRef}>
      <span className="timeline-branch-label">{item.branchLabel}</span>
      <svg className="timeline-fork" viewBox="0 0 40 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 C0 24 40 16 40 48" />
      </svg>
      <span className="timeline-branch-line" aria-hidden="true" />
      <motion.span
        className="timeline-branch-line timeline-branch-line--foreground"
        aria-hidden="true"
        style={{ scaleY: shouldReduceMotion ? 1 : branchLineScale }}
      />
      <ol aria-label="experiences at VJTI">
        {item.children.map((child, index) => (
          <li key={child.id}>
            <TimelineEntry item={child} child delay={Math.min(index, 3) * 0.06} />
          </li>
        ))}
      </ol>
    </div>
  )
}

function Timeline() {
  const listRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 80%', 'end 60%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="section timeline" id="timeline" tabIndex={-1} aria-labelledby="timeline-title">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">background</span>
            <h2 className="section-title" id="timeline-title">timeline.</h2>
          </div>
        </Reveal>
        <div className="timeline-list" ref={listRef}>
          <span className="timeline-line" aria-hidden="true" />
          <motion.span
            className="timeline-line timeline-line--foreground"
            aria-hidden="true"
            style={{ scaleY: shouldReduceMotion ? 1 : lineScale }}
          />
          <ol>
            {timeline.map((item, index) => (
              <li className="timeline-item" key={item.id}>
                <TimelineEntry item={item} delay={Math.min(index, 4) * 0.05} />
                {item.children && <TimelineBranch item={item} />}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Timeline
