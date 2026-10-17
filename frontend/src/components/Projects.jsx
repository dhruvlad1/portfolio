const projects = [
  {
    number: '01',
    title: 'Voyexa AI',
    description: 'A project in progress. Details and case study to be added as the work takes shape.',
    technologies: ['AI', 'Product'],
    preview: 'VOYEXA',
  },
  {
    number: '02',
    title: 'GestureFlow',
    description: 'A project in progress. Details and case study to be added as the work takes shape.',
    technologies: ['Interaction', 'Systems'],
    preview: 'GESTURE',
  },
  {
    number: '03',
    title: 'SmartCV',
    description: 'A project in progress. Details and case study to be added as the work takes shape.',
    technologies: ['AI', 'Web'],
    preview: 'SMARTCV',
  },
]

function Projects() {
  return (
    <section className="section projects" id="work" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 className="section-title" id="projects-title">Things I&apos;m<br />working on.</h2>
          </div>
          <span className="section-index">/ 03</span>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <span className="project-number">{project.number}</span>
              <div className="project-preview" aria-label={`${project.title} preview placeholder`}>
                <span className="preview-word">{project.preview}</span>
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <div className="tech-list" aria-label="Technologies">
                  {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <div className="project-links">
                  <a className="text-link" href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a>
                  <a className="text-link" href="#contact">Live demo ↗</a>
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
