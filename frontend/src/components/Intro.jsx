import { motion, useReducedMotion } from 'motion/react'
import profile from '../data/profile'
import about from '../data/about'
import { ArrowUpRight } from 'lucide-react'
import Rich from './Rich'
import { GitHubIcon, LinkedInIcon } from './icons'
import DecryptText from './DecryptText'
import Reveal from './Reveal'
import ScrollRevealText from './ScrollRevealText'
import HeroDots from './HeroDots'

function Name() {
  const shouldReduceMotion = useReducedMotion()
  const words = [
    { text: 'DHRUV', outlined: false },
    { text: 'LAD', outlined: true },
  ]
  let letterIndex = 0

  return (
    <h1 className="intro-name" id="intro-name" aria-label="Dhruv Lad">
      {words.map((word, wordIndex) => (
        <span className={`intro-name-word${word.outlined ? ' intro-name-word--outlined' : ''}`} key={word.text}>
          {word.text.split('').map((letter) => {
            const index = letterIndex
            letterIndex += 1
            const Letter = shouldReduceMotion ? 'span' : motion.span
            return (
              <Letter
                className="intro-name-letter"
                key={`${word.text}-${letter}`}
                aria-hidden="true"
                {...(!shouldReduceMotion && {
                  initial: { opacity: 0, y: '0.35em' },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: index * 0.045, duration: 0.6, ease: 'easeOut' },
                })}
              >
                {letter}
              </Letter>
            )
          })}
          {wordIndex === 0 && ' '}
        </span>
      ))}
    </h1>
  )
}

function Intro() {
  return (
    <section className="intro" id="top" tabIndex={-1} aria-labelledby="intro-name">
      <div className="container intro-hero">
        <HeroDots />
        <DecryptText className="eyebrow" text="hi, i'm" trigger="mount" />
        <Name />
        <p className="intro-tagline">software, models, and a mild obsession with <em>edge cases</em>.</p>
        <p className="hero-description">
          <Rich text="computer engineering student at [[VJTI]]. i like making things that work, and then making them work better." />
        </p>
        <div className="hero-actions">
          <a className="button" href="#work">explore my work <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} /></a>
          <a className="button button-secondary" href={profile.resumeUrl}>resume <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} /></a>
        </div>
        <div className="hero-footer">
          <span className="social-label">find me on</span>
          <div className="social-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <GitHubIcon />GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon />LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="container intro-about" id="about" tabIndex={-1} aria-labelledby="about-title">
        <div className="about-grid">
          <Reveal>
            <DecryptText className="eyebrow" text="about" />
            <h2 className="section-title" id="about-title">about.</h2>
          </Reveal>
          <div className="about-details">
            <Reveal delay={0}>
              <ScrollRevealText className="about-statement" text={about.statement} />
              <p className="about-body"><Rich text={about.body} /></p>
            </Reveal>
            <Reveal className="about-facts" delay={0.05}>
              <dl>
                {about.facts.map((fact) => (
                  <div className="about-fact" key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
        <Reveal className="skills-block" delay={0.15}>
          <DecryptText className="eyebrow" text="stack" />
          <dl className="skills-list">
            {about.skills.map((skill) => (
              <div className="skill-row" key={skill.label}>
                <dt>{skill.label}</dt>
                <dd>{skill.items.map((item, index) => (
                  <span key={item}>
                    {index > 0 && <span className="skill-slash" aria-hidden="true"> / </span>}
                    {item}
                  </span>
                ))}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

export default Intro
