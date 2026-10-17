import Reveal from './Reveal'

function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <Reveal>
          <span className="eyebrow">about</span>
          <h2 className="section-title" id="about-title">about.</h2>
        </Reveal>
        <p className="about-copy">
          I&apos;m a computer engineering student at VJTI interested in <strong>AI
          development</strong>, agentic systems, backend engineering, and building
          useful software.
        </p>
      </div>
    </section>
  )
}

export default About
