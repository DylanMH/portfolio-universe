import { FlaskConical, ExternalLink, Github } from 'lucide-react'
import { labExperiments } from '@/content/lab'

export function LabSection() {
  return (
    <section className="space-y-6 text-text">
      <div>
        <h2 className="text-3xl font-bold text-white">Lab</h2>
        <p className="mt-2 text-space-muted">Experiments, prototypes, and research projects.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {labExperiments.map((exp) => (
          <article
            key={exp.id}
            className="flex flex-col rounded-2xl border border-space-panel-border/50 bg-space-panel/50 p-5 transition hover:border-accent-rose/50"
          >
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-accent-rose" />
              <h3 className="text-lg font-semibold text-white">{exp.name}</h3>
            </div>
            <p className="mt-2 text-sm text-space-muted">{exp.summary}</p>
            <p className="mt-3 text-sm leading-relaxed">{exp.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <span key={tech} className="rounded-md bg-white/5 px-2 py-1 text-xs text-space-muted">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-4">
              {exp.demoUrl && (
                <a href={exp.demoUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
                  <ExternalLink className="h-3 w-3" />
                  Demo
                </a>
              )}
              {exp.repositoryUrl && (
                <a href={exp.repositoryUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
                  <Github className="h-3 w-3" />
                  Source
                </a>
              )}
              <span className="ml-auto text-xs text-space-muted">{exp.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
