import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import timeline from '../data/timeline'
import Reveal from './Reveal'
import Rich, { stripMarkers } from './Rich'
import { BadgeIcon } from './icons'
import DecryptText from './DecryptText'

function sortByStart(items) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (a.item.start && b.item.start) return a.item.start.localeCompare(b.item.start)
      if (a.item.start) return -1
      if (b.item.start) return 1
      return a.index - b.index
    })
    .map(({ item }) => item)
}

const sortedTimeline = sortByStart(timeline).map((item) => (
  item.children ? { ...item, children: sortByStart(item.children) } : item
))

function measureLine(container, selector) {
  if (!container) return null
  const containerRect = container.getBoundingClientRect()
  const firstDot = container.querySelector(`${selector} .timeline-dot`)
  const lastContent = container.querySelector(`${selector}:last-child`)
  if (!firstDot || !lastContent) return null
  const dotRect = firstDot.getBoundingClientRect()
  const lastRect = lastContent.getBoundingClientRect()
  const start = dotRect.top + dotRect.height / 2 - containerRect.top
  const end = lastRect.bottom - containerRect.top
  return { start, end, span: Math.max(end - start, 1) }
}

function TimelineEntry({ item, delay, child = false, progress, lineRef, lineMetrics }) {
  const entryRef = useRef(null)
  const dotRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [ignited, setIgnited] = useState(() => shouldReduceMotion)
  const [ratio, setRatio] = useState(0)
  const { scrollYProgress: entryProgress } = useScroll({
    target: entryRef,
    offset: ['start 0.8', 'end 0.2'],
  })
  const animatedOpacity = useTransform(entryProgress, [0, 0.2, 0.8, 1], [0.45, 1, 1, 0.45])
  const contentOpacity = shouldReduceMotion ? 1 : animatedOpacity

  useEffect(() => {
    if (!entryRef.current || !lineRef.current || !dotRef.current) return undefined
    const measure = () => {
      const lineRect = lineRef.current.getBoundingClientRect()
      const dotRect = dotRef.current.getBoundingClientRect()
      const start = lineMetrics?.start ?? 0
      const span = lineMetrics?.span ?? lineRect.height
      setRatio(Math.max(0, Math.min(1, (dotRect.top + dotRect.height / 2 - lineRect.top - start) / Math.max(span, 1))))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(entryRef.current)
    observer.observe(lineRef.current)
    measure()
    return () => observer.disconnect()
  }, [lineMetrics, lineRef])

  useEffect(() => {
    if (shouldReduceMotion) return undefined
    return progress.on('change', (value) => setIgnited(value >= ratio))
  }, [progress, ratio, shouldReduceMotion])

  return (
    <Reveal className={child ? 'timeline-child-reveal' : 'timeline-item-inner'} delay={delay}>
      <div
        className={child ? 'timeline-child-inner' : 'timeline-item-inner-grid'}
        ref={entryRef}
        data-timeline-start={item.start}
      >
        <motion.div className="timeline-period" data-type={item.type} style={{ opacity: contentOpacity }}>
          <span><Rich text={item.period} /></span>
          <small>{item.type}</small>
        </motion.div>
        <div className={child ? 'timeline-content timeline-child-content' : 'timeline-content'}>
          <motion.span
            ref={dotRef}
            className={`timeline-dot${item.current ? ' is-current' : ''}${ignited ? ' is-ignited' : ''}${child ? ' timeline-dot--branch' : ''}`}
            aria-hidden="true"
            initial={false}
            animate={{ scale: ignited ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div className="timeline-text" style={{ opacity: contentOpacity }}>
            <h3>{item.title}</h3>
            <p className="timeline-org">
              {item.org}
              {item.location && <span> · {item.location}</span>}
            </p>
            {item.summary && stripMarkers(item.summary).length > 0 && (
              <p className="timeline-summary"><Rich text={item.summary} /></p>
            )}
            {item.badges && (
              <div className="timeline-badges" aria-label="Highlights">
                {item.badges.map((badge) => <span key={stripMarkers(badge)}><Rich text={badge} /></span>)}
              </div>
            )}
            {item.tag && <span className="timeline-tag">{item.tag}</span>}
            {item.link && (
              <a
                className="timeline-proof-link"
                href={item.link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${item.link.label} for ${item.title} (opens in a new tab)`}
              >
                <BadgeIcon />
                {item.link.label}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </Reveal>
  )
}

function TimelineBranch({ item }) {
  const branchRef = useRef(null)
  const [lineMetrics, setLineMetrics] = useState(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: branchRef,
    offset: ['start 85%', 'end 60%'],
  })
  const branchLineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const branchCometY = useTransform(scrollYProgress, [0, 1], [0, lineMetrics?.span || 0])
  const branchCometOpacity = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0])
  const forkProgress = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  useEffect(() => {
    if (!branchRef.current) return undefined
    const measure = () => {
      const next = measureLine(branchRef.current, ':scope > ol > li')
      if (next) {
        setLineMetrics(next)
        branchRef.current.style.setProperty('--branch-line-start', `${next.start}px`)
        branchRef.current.style.setProperty('--branch-line-span', `${next.span}px`)
      }
    }
    const observer = new ResizeObserver(measure)
    observer.observe(branchRef.current)
    measure()
    return () => observer.disconnect()
  }, [])

  return (
    <div className="timeline-branch" ref={branchRef}>
      <span className="timeline-branch-label">{item.branchLabel}</span>
      <svg className="timeline-fork" viewBox="0 0 40 48" preserveAspectRatio="none" aria-hidden="true">
        <path className="timeline-fork-base" d="M0 0 C0 24 40 16 40 48" />
        <motion.path d="M0 0 C0 24 40 16 40 48" style={{ pathLength: shouldReduceMotion ? 1 : forkProgress }} />
      </svg>
      <span className="timeline-branch-line" aria-hidden="true" />
      <motion.span
        className="timeline-branch-line timeline-branch-line--foreground"
        aria-hidden="true"
        style={{ scaleY: shouldReduceMotion ? 1 : branchLineScale }}
      />
      {!shouldReduceMotion && (
        <motion.span className="timeline-comet timeline-comet--branch" style={{ y: branchCometY, opacity: branchCometOpacity }} aria-hidden="true" />
      )}
      <ol aria-label={`${stripMarkers(item.branchLabel)} (${item.title}), oldest first`}>
        {item.children.map((child, index) => (
          <li key={child.id}>
            <TimelineEntry
              item={child}
              child
              lineRef={branchRef}
              lineMetrics={lineMetrics}
              progress={scrollYProgress}
              delay={Math.min(index, 3) * 0.06}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}

function Timeline() {
  const listRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [lineMetrics, setLineMetrics] = useState(null)
  const [tickerKeyframes, setTickerKeyframes] = useState({ input: [0, 1], output: [0, new Date().getFullYear()] })
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 80%', 'end 60%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const cometY = useTransform(scrollYProgress, [0, 1], [0, lineMetrics?.span || 0])
  const cometOpacity = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0])
  const tickerYear = useTransform(scrollYProgress, tickerKeyframes.input, tickerKeyframes.output)
  const [year, setYear] = useState(tickerKeyframes.output[0])

  useEffect(() => {
    if (!listRef.current) return undefined
    const measure = () => {
      const next = measureLine(listRef.current, '.timeline-list-content > ol > li')
      if (!next) return
      setLineMetrics(next)
      listRef.current.style.setProperty('--main-line-start', `${next.start}px`)
      listRef.current.style.setProperty('--main-line-span', `${next.span}px`)

      const nodes = [...listRef.current.querySelectorAll('[data-timeline-start]')]
      const rawRatios = nodes.map((node) => {
        const dot = node.querySelector('.timeline-dot')
        if (!dot) return null
        const rect = dot.getBoundingClientRect()
        return {
          ratio: (rect.top + rect.height / 2 - listRef.current.getBoundingClientRect().top - next.start) / next.span,
          year: Number(node.dataset.timelineStart?.slice(0, 4)),
        }
      }).filter((entry) => entry && Number.isFinite(entry.year))
      const input = []
      const output = []
      rawRatios.forEach((entry) => {
        const ratio = Math.max((input.at(-1) || 0) + 0.001, Math.min(entry.ratio, 0.999))
        if (ratio < 1) {
          input.push(ratio)
          output.push(entry.year)
        }
      })
      input.unshift(0)
      output.unshift(rawRatios[0]?.year || new Date().getFullYear())
      input.push(1)
      output.push(new Date().getFullYear())
      setTickerKeyframes({ input, output })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(listRef.current)
    measure()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (shouldReduceMotion) return undefined
    return tickerYear.on('change', (value) => setYear(Math.round(value)))
  }, [shouldReduceMotion, tickerYear])

  return (
    <section className="section timeline" id="timeline" tabIndex={-1} aria-labelledby="timeline-title">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <DecryptText className="eyebrow" text="background" />
            <h2 className="section-title" id="timeline-title">timeline.</h2>
          </div>
        </Reveal>
        <div className="timeline-list" ref={listRef}>
          <span className="timeline-line" aria-hidden="true" />
          <motion.span className="timeline-line timeline-line--foreground" aria-hidden="true" style={{ scaleY: shouldReduceMotion ? 1 : lineScale }} />
          {!shouldReduceMotion && <motion.span className="timeline-comet" style={{ y: cometY, opacity: cometOpacity }} aria-hidden="true" />}
          <div className="timeline-list-content">
            <ol aria-label="education and experience, oldest first">
              {sortedTimeline.map((item, index) => (
                <li className="timeline-item" key={item.id}>
                  <TimelineEntry item={item} lineRef={listRef} lineMetrics={lineMetrics} progress={scrollYProgress} delay={Math.min(index, 4) * 0.05} />
                  {item.children && <TimelineBranch item={item} />}
                </li>
              ))}
            </ol>
          </div>
          <aside className="timeline-year-ticker" aria-hidden="true">
            <motion.span key={year} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>{year}</motion.span>
            <small>year</small>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Timeline
