import projects from '../data/projects'
import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'

function Projects() {
  return (
    <section className="section projects" id="work" aria-labelledby="projects-title">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">selected work</span>
            <h2 className="section-title" id="projects-title">selected work.</h2>
          </div>
          <span className="section-index">/ {String(projects.length).padStart(2, '0')}</span>
        </Reveal>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal
              className="project-reveal"
              delay={Math.min(index, 4) * 0.06}
              key={project.id}
            >
            <article
              className={`project-card${index % 2 === 1 ? ' project-card--even' : ''}`}
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
                  <a className="text-link" href={project.links.github} target="_blank" rel="noreferrer">github <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} /></a>
                  <a className="text-link" href={project.links.live}>live demo <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} /></a>
                </div>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
