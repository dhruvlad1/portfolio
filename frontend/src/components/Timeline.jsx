import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import timeline from '../data/timeline'
import Reveal from './Reveal'

function Timeline() {
  const listRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 80%', 'end 60%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="section timeline" id="timeline" aria-labelledby="timeline-title">
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
                <Reveal className="timeline-item-inner" delay={Math.min(index, 4) * 0.05}>
                  <div className="timeline-period">
                    <span>{item.period}</span>
                    <small>{item.type}</small>
                  </div>
                  <div className="timeline-content">
                    <span className={`timeline-dot${item.current ? ' is-current' : ''}`} aria-hidden="true" />
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
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Timeline
