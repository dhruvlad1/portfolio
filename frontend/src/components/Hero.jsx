import profile from '../data/profile'
import { ArrowUpRight } from 'lucide-react'
import Rich from './Rich'
import { GitHubIcon, LinkedInIcon } from './icons'
import DecryptText from './DecryptText'

function Hero() {
  return (
    <section className="hero" id="top" tabIndex={-1} aria-labelledby="hero-title">
      <div className="container hero-content">
        <DecryptText className="eyebrow" text="Dhruv · Mumbai" trigger="mount" />
        <h1 id="hero-title">i build software, mostly the <em>AI</em> kind.</h1>
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
    </section>
  )
}

export default Hero
