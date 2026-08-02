import { useEffect, useState } from 'react'
import { Github, Star, GitFork, AlertCircle } from 'lucide-react'
import { fetchGithubRepos } from '@/services/github'
import { LoadingScreen } from '@/components/common/LoadingScreen'

export function GithubSection() {
  const [repos, setRepos] = useState<Awaited<ReturnType<typeof fetchGithubRepos>>['repos']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let canceled = false
    fetchGithubRepos()
      .then((data) => {
        if (!canceled) {
          setRepos(data.repos)
          setError(data.error || null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!canceled) {
          setError('Unable to load repositories.')
          setLoading(false)
        }
      })
    return () => {
      canceled = true
    }
  }, [])

  if (loading) return <LoadingScreen fullScreen={false} message="Loading repositories..." />

  return (
    <section className="space-y-6 text-text">
      <div>
        <h2 className="text-3xl font-bold text-white">GitHub Universe</h2>
        <p className="mt-2 text-space-muted">Public repositories and open-source contributions.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-accent-rose/10 p-4 text-accent-rose">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-space-panel-border/50 bg-space-panel/50 p-5 no-underline transition-all duration-200 hover:-translate-y-1 hover:border-accent/60 hover:bg-space-panel/80 hover:no-underline hover:shadow-lg hover:shadow-accent/10"
          >
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-space-muted transition-colors group-hover:text-accent" />
              <h3 className="font-semibold text-white transition-colors group-hover:text-accent">{repo.name}</h3>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-space-muted">{repo.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-space-muted">
              {repo.language && <span>{repo.language}</span>}
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" /> {repo.forks}
              </span>
              <span className="ml-auto">{new Date(repo.updatedAt).toLocaleDateString()}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
