import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="navbar">
        <div className="container navbar-inner">
          <a className="wordmark" href="#top" aria-label="Dhruv home">DHRUV.</a>
          <button
            className="mobile-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
          <nav
            id="primary-navigation"
            className={`nav-links${menuOpen ? ' is-open' : ''}`}
            aria-label="Primary navigation"
          >
            <a className="nav-link" href="#work" onClick={closeMenu}>Work</a>
            <a className="nav-link" href="#about" onClick={closeMenu}>About</a>
            <a className="nav-link" href="#contact" onClick={closeMenu}>Contact</a>
          </nav>
          <div className="nav-meta">
            <span className="status">Open to opportunities</span>
            <a className="resume-link" href="#contact">Resume ↗</a>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
