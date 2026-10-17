import profile from '../data/profile'

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero-content">
        <span className="eyebrow">{profile.role}</span>
        <h1 id="hero-title">I build things that <em>work.</em><br />And work well.</h1>
        <p className="hero-description">
          I&apos;m {profile.name}, a computer engineering student at VJTI building AI-powered
          products, intelligent systems, and reliable backend applications.
        </p>
        <div className="hero-actions">
          <a className="button" href="#work">Explore my work <span aria-hidden="true">&nbsp;↗</span></a>
          <a className="button button-secondary" href={profile.resumeUrl}>Resume <span aria-hidden="true">&nbsp;↗</span></a>
        </div>
        <div className="hero-footer">
          <span className="social-label">Find me on</span>
          <div className="social-links">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </div>
      <div className="scroll-note" aria-hidden="true">Scroll to explore</div>
    </section>
  )
}

export default Hero
