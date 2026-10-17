import projects from '../data/projects'

function Projects() {
  return (
    <section className="section projects" id="work" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 className="section-title" id="projects-title">Things I&apos;m<br />working on.</h2>
          </div>
          <span className="section-index">/ {String(projects.length).padStart(2, '0')}</span>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article
              className={`project-card${index % 2 === 1 ? ' project-card--even' : ''}`}
              key={project.id}
            >
              <span className="project-number">{project.number}</span>
              <div className="project-preview" aria-label={`${project.title} preview placeholder`}>
                <span className="preview-word">{project.title}</span>
              </div>
              <p className="project-tagline">{project.tagline}</p>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <div className="tech-list" aria-label="Technologies">
                  {project.tech.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <div className="project-links">
                  <a className="text-link" href={project.links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                  <a className="text-link" href={project.links.live}>Live demo ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
