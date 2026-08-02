import type { GithubRepo } from '../types/content'

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'DylanMH'
const FALLBACK_CACHE_KEY = 'github-repos-fallback-v2'
const CACHE_KEY = 'github-repos-cache-v2'
const CACHE_TTL = 1000 * 60 * 60 * 2 // 2 hours

const fallbackRepos: GithubRepo[] = [
  {
    id: 1,
    name: 'vantage-stats',
    fullName: 'DylanMH/vantage-stats',
    description: 'A flexible analytics dashboard for sports and esports statistics.',
    htmlUrl: 'https://github.com/DylanMH/vantage-stats',
    language: 'TypeScript',
    topics: ['react', 'analytics', 'dashboard'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-07-01T00:00:00Z',
    visibility: 'public',
  },
  {
    id: 2,
    name: 'LocateMVP',
    fullName: 'DylanMH/LocateMVP',
    description: 'A full-stack utility locate ticket management system for field technicians and ops teams.',
    htmlUrl: 'https://github.com/DylanMH/LocateMVP',
    language: 'TypeScript',
    topics: ['react-native', 'expo', 'express', 'offline-first'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-08-02T00:00:00Z',
    visibility: 'public',
  },
  {
    id: 3,
    name: 'vault-rush',
    fullName: 'DylanMH/vault-rush',
    description: 'A high-velocity browser arcade game with real-time leaderboards.',
    htmlUrl: 'https://github.com/DylanMH/vault-rush',
    language: 'TypeScript',
    topics: ['game', 'arcade', 'typescript'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-25T00:00:00Z',
    visibility: 'public',
  },
  {
    id: 4,
    name: 'tones-catering',
    fullName: 'DylanMH/tones-catering',
    description: 'Catering business website and booking system.',
    htmlUrl: 'https://github.com/DylanMH/tones-catering',
    language: 'TypeScript',
    topics: ['website', 'booking'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-01T00:00:00Z',
    visibility: 'public',
  },
  {
    id: 5,
    name: 'MixCalculatorApp',
    fullName: 'DylanMH/MixCalculatorApp',
    description: 'A calculator utility for mixing ratios and measurements.',
    htmlUrl: 'https://github.com/DylanMH/MixCalculatorApp',
    language: 'TypeScript',
    topics: ['calculator', 'utility'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-04-01T00:00:00Z',
    visibility: 'public',
  },
]

interface GithubApiRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  updated_at: string
  visibility: 'public' | 'private'
  homepage?: string | null
}

function mapRepo(repo: GithubApiRepo): GithubRepo {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    htmlUrl: repo.html_url,
    language: repo.language || 'Unknown',
    topics: repo.topics || [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    visibility: repo.visibility,
    homepage: repo.homepage ?? undefined,
  }
}

function getCachedRepos(): GithubRepo[] | null {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  try {
    const { timestamp, repos } = JSON.parse(raw) as { timestamp: number; repos: GithubRepo[] }
    if (Date.now() - timestamp > CACHE_TTL) return null
    if (!Array.isArray(repos) || repos.length === 0) return null
    return repos
  } catch {
    return null
  }
}

function setCachedRepos(repos: GithubRepo[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), repos }))
}

function processRepos(data: GithubApiRepo[]): GithubRepo[] {
  return data.map(mapRepo)
}

export async function fetchGithubRepos(): Promise<{
  repos: GithubRepo[]
  fromCache: boolean
  error?: string
}> {
  const cached = getCachedRepos()
  if (cached) return { repos: cached, fromCache: true }

  // Try the serverless proxy first (uses the PAT server-side)
  try {
    const proxyResponse = await fetch('/api/github-repos')
    if (proxyResponse.ok) {
      const data = (await proxyResponse.json()) as GithubApiRepo[]
      const repos = processRepos(data)
      setCachedRepos(repos)
      localStorage.setItem(FALLBACK_CACHE_KEY, JSON.stringify(repos))
      return { repos, fromCache: false }
    }
  } catch {
    // Proxy not available; fall through to direct GitHub API
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
      headers: { Accept: 'application/vnd.github+json' },
    })

    if (!response.ok) {
      if (response.status === 403) {
        return { repos: fallbackRepos, fromCache: false, error: 'GitHub API rate limit reached. Showing fallback data.' }
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = (await response.json()) as GithubApiRepo[]
    const repos = processRepos(data)

    setCachedRepos(repos)
    localStorage.setItem(FALLBACK_CACHE_KEY, JSON.stringify(repos))
    return { repos, fromCache: false }
  } catch {
    const storedFallback = localStorage.getItem(FALLBACK_CACHE_KEY)
    if (storedFallback) {
      try {
        return { repos: JSON.parse(storedFallback) as GithubRepo[], fromCache: true, error: 'Using cached GitHub data.' }
      } catch {
        // fall through
      }
    }
    return { repos: fallbackRepos, fromCache: false, error: 'GitHub API unavailable. Showing fallback data.' }
  }
}
