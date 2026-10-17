import { useState } from 'react'
import profile from '../data/profile'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

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
            <a className="nav-link" href="#work" onClick={closeMenu}>work</a>
            <a className="nav-link" href="#timeline" onClick={closeMenu}>timeline</a>
            <a className="nav-link" href="#about" onClick={closeMenu}>about</a>
            <a className="nav-link" href="#contact" onClick={closeMenu}>contact</a>
            <a className="resume-link mobile-resume-link" href={profile.resumeUrl} onClick={closeMenu}>
              resume
            </a>
          </nav>
          <div className="nav-meta">
            <span className="status">open to opportunities</span>
            <a className="resume-link" href={profile.resumeUrl}>resume</a>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
