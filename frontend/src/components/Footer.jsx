import profile from '../data/profile'
import { ArrowUpRight, Mail } from 'lucide-react'
import Reveal from './Reveal'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact">
      <div className="container contact">
        <span className="eyebrow">contact</span>
        <Reveal><h2>say hi.</h2></Reveal>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          <Mail aria-hidden="true" size={16} strokeWidth={1.75} /> {profile.email}
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
        </a>
      </div>
      <div className="container footer">
        <span className="footer-name">{profile.name.toUpperCase()}.</span>
        <div className="footer-links">
          <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
            github <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
          </a>
          <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
            linkedin <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
          </a>
        </div>
        <span>© {year} {profile.name}</span>
      </div>
    </footer>
  )
}

export default Footer
