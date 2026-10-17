import { useState } from 'react'
import profile from '../data/profile'
import useActiveSection from '../hooks/useActiveSection'
import ThemeToggle from './ThemeToggle'
import { ResumeIcon } from './icons'

const sectionIds = ['timeline', 'work', 'about', 'contact']

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(sectionIds)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="navbar">
        <div className="container navbar-inner">
          <a className="wordmark" href="#top" aria-label={`${profile.name} home`}>
            {profile.name.toUpperCase()}.
          </a>
          <button
            className="mobile-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
          <nav
            id="primary-navigation"
            className={`nav-links${menuOpen ? ' is-open' : ''}`}
            aria-label="Primary navigation"
          >
            {sectionIds.map((id) => (
              <a
                className={`nav-link${activeSection === id ? ' is-active' : ''}`}
                href={`#${id}`}
                aria-current={activeSection === id ? 'true' : undefined}
                onClick={closeMenu}
                key={id}
              >
                {id}
              </a>
            ))}
            <a className="resume-link mobile-resume-link" href={profile.resumeUrl} onClick={closeMenu}>
              <ResumeIcon size={14} />resume
            </a>
            <ThemeToggle mobile />
          </nav>
          <div className="nav-meta">
            <span className="status">open to opportunities</span>
            <a className="resume-link" href={profile.resumeUrl}><ResumeIcon size={14} />resume</a>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
