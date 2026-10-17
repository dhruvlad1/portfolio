import projects from '../data/projects'
import ProjectMedia from './ProjectMedia'
import Reveal from './Reveal'
import Rich, { stripMarkers } from './Rich'
import { GitHubIcon, LiveIcon } from './icons'
import DecryptText from './DecryptText'

function Projects() {
  return (
    <section className="section projects" id="work" tabIndex={-1} aria-labelledby="projects-title">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <DecryptText className="eyebrow" text="featured work" />
            <h2 className="section-title" id="projects-title">selected work.</h2>
          </div>
          <span className="section-index">/ {String(projects.length).padStart(2, '0')}</span>
        </Reveal>
        <div className="project-list">
          {projects.map((project) => (
            <Reveal className="project-reveal" key={project.id}>
              <article className="project-row">
                <ProjectMedia media={project.media} title={project.title} />
                <div className="project-content">
                  <span className="project-number">{project.number} · {project.year}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-tagline"><Rich text={project.tagline} /></p>
                  <p className="project-description"><Rich text={project.description} /></p>
                  <ul className="project-highlights">
                    {project.highlights.map((highlight) => (
                      <li key={stripMarkers(highlight)}><Rich text={highlight} /></li>
                    ))}
                  </ul>
                  <div className="tech-list" aria-label="Technologies">
                    {project.tech.map((technology) => <span key={technology}>{technology}</span>)}
                  </div>
                  <div className="project-links">
                    <a className="text-link" href={project.links.github} target="_blank" rel="noreferrer">
                      <GitHubIcon />GitHub
                    </a>
                    {project.links.live && (
                      <a className="text-link" href={project.links.live} target="_blank" rel="noreferrer">
                        <LiveIcon />live
                      </a>
                    )}
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
