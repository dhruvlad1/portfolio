import { ArrowUp, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import profile from '../data/profile'
import Reveal from './Reveal'
import CursorToggle from './CursorToggle'
import Rich from './Rich'
import { GitHubIcon, LinkedInIcon, MailIcon, ResumeIcon } from './icons'
import DecryptText from './DecryptText'
import MumbaiClock from './MumbaiClock'

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
          <DecryptText className="eyebrow" text="contact" />
          <h2><Rich text="say [[hi]]." /></h2>
          <p className="contact-description">
            <Rich text="open to [[internships]] and interesting projects. email is the fastest way to reach me." />
          </p>
          <div className="contact-email-row">
            <a className="contact-email" href={`mailto:${profile.email}`}>
              <MailIcon size="0.8em" />
              {profile.email}
            </a>
            <button
              className="copy-email"
              type="button"
              aria-label="copy email address"
              onClick={copyEmail}
            >
              {copied ? <Check className="copy-icon--warm" aria-hidden="true" size={14} strokeWidth={1.75} /> : <Copy aria-hidden="true" size={14} strokeWidth={1.75} />}
              <span className="sr-only">{copied ? 'email copied' : 'copy email address'}</span>
              <span aria-hidden="true">copy</span>
            </button>
            <span className="sr-only" aria-live="polite">{copied ? 'email copied' : ''}</span>
          </div>
          <div className="contact-links">
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
              <GitHubIcon />GitHub
            </a>
            <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon />LinkedIn
            </a>
            <a className="text-link" href={profile.resumeUrl}>
              <ResumeIcon />resume
            </a>
          </div>
        </Reveal>
      </div>
      <div className="container footer">
        <span className="footer-name">{profile.name.toUpperCase()}.</span>
        <MumbaiClock />
        <div className="footer-links">
          <a className="text-link" href="#top">
            <ArrowUp aria-hidden="true" size={14} strokeWidth={1.75} />top
          </a>
          <CursorToggle />
        </div>
        <span>© {year} {profile.fullName}</span>
      </div>
    </footer>
  )
}

export default Footer
