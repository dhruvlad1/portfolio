import profile from '../data/profile'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact">
      <div className="container contact">
        <span className="eyebrow">Get in touch</span>
        <h2>Have something<br />interesting in mind?</h2>
        <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email} ↗</a>
      </div>
      <div className="container footer">
        <span className="footer-name">{profile.name.toUpperCase()}.</span>
        <div className="footer-links">
          <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <span>© {year} {profile.name}</span>
      </div>
    </footer>
  )
}

export default Footer
