import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react'
import { useState } from 'react'
import profile from '../data/profile'
import Reveal from './Reveal'

function Footer() {
  const [copied, setCopied] = useState(false)
  const year = new Date().getFullYear()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <footer id="contact" tabIndex={-1}>
      <div className="container contact">
        <Reveal>
          <span className="eyebrow">contact</span>
          <h2>say hi.</h2>
          <p className="contact-description">
            open to internships and interesting projects. email is the fastest way to reach me.
          </p>
          <div className="contact-email-row">
            <a className="contact-email" href={`mailto:${profile.email}`}>
              <Mail aria-hidden="true" size={16} strokeWidth={1.75} />
              {profile.email}
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
            </a>
            <button
              className="copy-email"
              type="button"
              aria-label="copy email address"
              onClick={copyEmail}
            >
              {copied ? <Check aria-hidden="true" size={14} strokeWidth={1.75} /> : <Copy aria-hidden="true" size={14} strokeWidth={1.75} />}
              <span className="sr-only">{copied ? 'email copied' : 'copy email address'}</span>
              <span aria-hidden="true">copy</span>
            </button>
            <span className="sr-only" aria-live="polite">{copied ? 'email copied' : ''}</span>
          </div>
          <div className="contact-links">
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
              github <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
            </a>
            <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
              linkedin <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
            </a>
            <a className="text-link" href={profile.resumeUrl}>
              resume <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
            </a>
          </div>
        </Reveal>
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
        <span>© {year} {profile.fullName}</span>
      </div>
    </footer>
  )
}

export default Footer
