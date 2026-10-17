import about from '../data/about'
import Reveal from './Reveal'
import Rich, { stripMarkers } from './Rich'
import DecryptText from './DecryptText'
import ScrollRevealText from './ScrollRevealText'
import CountUp from './CountUp'
import CodingStats from './CodingStats'

function About() {
  return (
    <section className="section about" id="about" tabIndex={-1} aria-labelledby="about-title">
      <div className="container">
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
            <Reveal className="about-stats" delay={0.1}>
              <ul>
                {about.stats.map((stat) => (
                  <li key={stat.label}>
                    <strong><CountUp value={stripMarkers(stat.value)} /></strong>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
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
        <Reveal className="coding-stats-block" delay={0.2}>
          <CodingStats />
        </Reveal>
      </div>
    </section>
  )
}

export default About
