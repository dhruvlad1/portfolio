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
const timelineYears = [2012, 2022, 2024, 2024, 2024, 2024, 2025, 2025]

function TimelineEntry({ item, delay, child = false, progress, lineRef }) {
  const entryRef = useRef(null)
  const dotRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [ignited, setIgnited] = useState(() => shouldReduceMotion)
  const [ratio, setRatio] = useState(0)
  const { scrollYProgress: entryProgress } = useScroll({
    target: entryRef,
    offset: ['start 0.8', 'end 0.2'],
  })
  const animatedContentOpacity = useTransform(entryProgress, [0, 0.2, 0.8, 1], [0.45, 1, 1, 0.45])
  const contentOpacity = shouldReduceMotion ? 1 : animatedContentOpacity

  useEffect(() => {
    if (!entryRef.current || !lineRef.current) return undefined
    const measure = () => {
      const entry = entryRef.current.getBoundingClientRect()
      const line = lineRef.current.getBoundingClientRect()
      setRatio(Math.max(0, Math.min(1, (entry.top - line.top) / Math.max(line.height, 1))))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(entryRef.current)
    observer.observe(lineRef.current)
    measure()
    return () => observer.disconnect()
  }, [lineRef])

  useEffect(() => {
    if (shouldReduceMotion) return undefined
    return progress.on('change', (value) => setIgnited(value >= ratio))
  }, [progress, ratio, shouldReduceMotion])

  return (
    <Reveal className={child ? 'timeline-child-reveal' : 'timeline-item-inner'} delay={delay}>
      <div className={child ? 'timeline-child-inner' : 'timeline-item-inner-grid'}>
        <div className="timeline-period" data-type={item.type}>
          <span><Rich text={item.period} /></span>
          <small>{item.type}</small>
        </div>
        <motion.div
          ref={entryRef}
          className={child ? 'timeline-content timeline-child-content' : 'timeline-content'}
          style={{ opacity: contentOpacity }}
        >
          <motion.span
            ref={dotRef}
            className={`timeline-dot${item.current ? ' is-current' : ''}${ignited ? ' is-ignited' : ''}${child ? ' timeline-dot--branch' : ''}`}
            aria-hidden="true"
            initial={false}
            animate={{ scale: ignited ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.6 }}
          />
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
    </Reveal>
  )
}

function TimelineBranch({ item }) {
  const branchRef = useRef(null)
  const [branchHeight, setBranchHeight] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: branchRef,
    offset: ['start 85%', 'end 60%'],
  })
  const branchLineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const branchCometY = useTransform(scrollYProgress, [0, 1], [0, branchHeight])
  const branchCometOpacity = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0])
  const forkProgress = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  useEffect(() => {
    if (!branchRef.current) return undefined
    const observer = new ResizeObserver(([entry]) => setBranchHeight(entry.contentRect.height))
    observer.observe(branchRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="timeline-branch" ref={branchRef}>
      <span className="timeline-branch-label">{item.branchLabel}</span>
      <svg className="timeline-fork" viewBox="0 0 40 48" preserveAspectRatio="none" aria-hidden="true">
        <motion.path d="M0 0 C0 24 40 16 40 48" style={{ pathLength: shouldReduceMotion ? 1 : forkProgress }} />
      </svg>
      <span className="timeline-branch-line" aria-hidden="true" />
      <motion.span
        className="timeline-branch-line timeline-branch-line--foreground"
        aria-hidden="true"
        style={{ scaleY: shouldReduceMotion ? 1 : branchLineScale }}
      />
      {!shouldReduceMotion && <motion.span className="timeline-comet timeline-comet--branch" style={{ scaleY: branchCometY, opacity: branchCometOpacity }} aria-hidden="true" />}
      <ol aria-label={`${stripMarkers(item.branchLabel)} (${item.title}), oldest first`}>
        {item.children.map((child, index) => (
          <li key={child.id}>
            <TimelineEntry item={child} child lineRef={branchRef} progress={scrollYProgress} delay={Math.min(index, 3) * 0.06} />
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
  const [listHeight, setListHeight] = useState(0)
  const cometY = useTransform(scrollYProgress, [0, 1], [0, listHeight])
  const cometOpacity = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0])
  useEffect(() => {
    if (!listRef.current) return undefined
    const observer = new ResizeObserver(([entry]) => setListHeight(entry.contentRect.height))
    observer.observe(listRef.current)
    return () => observer.disconnect()
  }, [])
  const [year, setYear] = useState(timelineYears[0])
  useEffect(() => {
    if (shouldReduceMotion) return undefined
    return scrollYProgress.on('change', (value) => {
      const index = Math.min(timelineYears.length - 1, Math.floor(value * timelineYears.length))
      setYear(value >= 0.98 ? new Date().getFullYear() : timelineYears[index])
    })
  }, [scrollYProgress, shouldReduceMotion])

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
          <motion.span
            className="timeline-line timeline-line--foreground"
            aria-hidden="true"
            style={{ scaleY: shouldReduceMotion ? 1 : lineScale }}
          />
          {!shouldReduceMotion && <motion.span className="timeline-comet" style={{ y: cometY, opacity: cometOpacity }} aria-hidden="true" />}
          <div className="timeline-list-content">
          <ol aria-label="education and experience, oldest first">
            {sortedTimeline.map((item, index) => (
              <li className="timeline-item" key={item.id}>
                <TimelineEntry item={item} lineRef={listRef} progress={scrollYProgress} delay={Math.min(index, 4) * 0.05} />
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
