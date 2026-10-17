function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact">
      <div className="container contact">
        <span className="eyebrow">Get in touch</span>
        <h2>Have something<br />interesting in mind?</h2>
        <a className="contact-email" href="mailto:hello@example.com">hello@example.com ↗</a>
      </div>
      <div className="container footer">
        <span className="footer-name">DHRUV.</span>
        <div className="footer-links">
          <a className="text-link" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
          <a className="text-link" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <span>© {year} Dhruv</span>
      </div>
    </footer>
  )
}

export default Footer
