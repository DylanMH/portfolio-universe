import { useMemo } from 'react'
import { ExternalLink, Github, Star } from 'lucide-react'
import { projects } from '@/content/projects'
import { cn } from '@/utils/cn'

export function ProjectsSection() {
  const featured = useMemo(() => projects.filter((p) => p.featured), [])

  return (
    <section className="space-y-8 text-text">
      <div>
        <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
        <p className="mt-2 text-space-muted">Selected work across AI, games, web, and data.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} featured />
        ))}
      </div>

      {/* {other.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-white">More Projects</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {other.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )} */}
    </section>
  )
}

function ProjectCard({ project, featured = false }: { project: (typeof projects)[0]; featured?: boolean }) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-2xl border border-space-panel-border/50 bg-space-panel/50 p-5 transition hover:border-accent/50',
        featured && 'ring-1 ring-accent/20'
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        {featured && <Star className="h-4 w-4 text-accent-amber" fill="currentColor" />}
      </div>
      <p className="mt-2 text-sm text-space-muted">{project.summary}</p>
      <p className="mt-3 text-sm leading-relaxed">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, 5).map((tech) => (
          <span key={tech} className="rounded-md bg-white/5 px-2 py-1 text-xs text-space-muted">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-3 pt-4">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
            <ExternalLink className="h-3 w-3" />
            Live Demo
          </a>
        )}
        {project.repositoryUrl && (
          <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
            <Github className="h-3 w-3" />
            Source
          </a>
        )}
        <span className="ml-auto text-xs text-space-muted">{project.status}</span>
      </div>
    </article>
  )
}
