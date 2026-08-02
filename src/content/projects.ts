import type { PortfolioProject } from '../types/content'

export const projects: PortfolioProject[] = [
  {
    id: 'agent-mesh',
    slug: 'agent-mesh',
    name: 'Agent Mesh',
    summary: 'A distributed network of autonomous agents that coordinate tasks in real time.',
    description:
      'Agent Mesh explores the next generation of AI coordination by connecting specialized agents over a lightweight event bus. Each agent can propose, accept, and delegate tasks while maintaining a shared memory graph.',
    technologies: ['TypeScript', 'Node.js', 'Redis', 'GraphQL', 'WebSockets', 'OpenAI'],
    categories: ['AI', 'Backend', 'Distributed Systems'],
    role: 'Lead Developer',
    status: 'active',
    featured: false,
    image: '/projects/agent-mesh.jpg',
    demoUrl: 'https://agent-mesh.example.com',
    repositoryUrl: 'https://github.com/DylanMH/agent-mesh',
    achievements: [
      'Reduced task latency by 40% using a custom gossip protocol',
      'Built a visual debugging dashboard for agent state',
    ],
    challenges: [
      'Maintaining consensus across unreliable agents',
      'Designing an intuitive mental model for users',
    ],
  },
  {
    id: 'gate-ascension',
    slug: 'gate-ascension',
    name: 'Gate Ascension',
    summary: 'A narrative puzzle platformer with a procedural gate system.',
    description:
      'Gate Ascension is a 2D puzzle platformer where players manipulate time gates to solve increasingly complex levels. The game uses a custom procedural generator to ensure no two runs feel the same.',
    technologies: ['Unity', 'C#', 'Aseprite', 'FMOD'],
    categories: ['Game Development', 'Procedural Generation'],
    role: 'Solo Developer',
    status: 'prototype',
    featured: false,
    image: '/projects/gate-ascension.jpg',
    repositoryUrl: 'https://github.com/DylanMH/gate-ascension',
    achievements: [
      'Implemented a deterministic replay system',
      'Designed 60+ puzzle rooms with a modular toolset',
    ],
    challenges: [
      'Balancing difficulty for speedrunners and casual players',
      'Keeping deterministic physics consistent across platforms',
    ],
  },
  {
    id: 'vault-rush',
    slug: 'vault-rush',
    name: 'Vault Rush',
    summary: 'A high-velocity browser arcade game with real-time leaderboards.',
    description:
      'Vault Rush is a fast-paced browser arcade game where players race through vaults, dodging traps and collecting data caches. It includes a WebSocket-powered leaderboard and daily challenge modes.',
    technologies: ['TypeScript', 'Phaser', 'WebSockets', 'Supabase', 'Tailwind CSS'],
    categories: ['Game Development', 'Web'],
    role: 'Developer & Designer',
    status: 'completed',
    featured: false,
    image: '/projects/vault-rush.jpg',
    demoUrl: 'https://vault-rush.example.com',
    repositoryUrl: 'https://github.com/DylanMH/vault-rush',
    achievements: [
      'Reached 10,000 plays in the first month',
      'Achieved 60 FPS on mid-range mobile devices',
    ],
    challenges: [
      'Optimizing WebSocket message handling for low latency',
      'Designing touch controls that feel precise',
    ],
  },
  {
    id: 'vantage-stats',
    slug: 'vantage-stats',
    name: 'Vantage Stats',
    summary: 'A flexible analytics dashboard for sports and esports statistics.',
    description:
      'Vantage Stats aggregates match data from multiple sources and turns it into actionable insights. Coaches and analysts can build custom reports, compare player performance, and share visualizations.',
    technologies: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL'],
    categories: ['Data', 'Frontend', 'Visualization'],
    role: 'Full-stack Developer',
    status: 'completed',
    featured: true,
    image: '/projects/vantage-stats.jpg',
    repositoryUrl: 'https://github.com/DylanMH/vantage-stats',
    achievements: [
      'Built a query builder that generates complex SQL safely',
      'Reduced dashboard load time by 50%',
    ],
    challenges: [
      'Normalizing data from incompatible third-party APIs',
      'Designing charts that remain readable on mobile',
    ],
  },
  {
    id: 'locatemvp',
    slug: 'locatemvp',
    name: 'LocateMVP',
    summary: 'A full-stack utility locate ticket management system for field technicians and ops teams.',
    description:
      'LocateMVP models the real-world 811 "Call Before You Dig" workflow end to end: a simulated 811 dispatch center generates locate tickets, an Express backend ingests and auto-assigns them via a 4-level geo-territory hierarchy, an offline-first Expo/React Native app lets field techs work tickets with WatermelonDB sync, and a real-time web portal gives supervisors live operational visibility over REST + SSE.',
    technologies: ['TypeScript', 'React Native', 'Expo', 'Express', 'Fastify', 'SQLite', 'WatermelonDB'],
    categories: ['Mobile', 'Full-Stack', 'Web'],
    role: 'Solo Developer',
    status: 'active',
    featured: true,
    repositoryUrl: 'https://github.com/DylanMH/LocateMVP',
    achievements: [
      'Built an offline-first mobile sync engine using an outbox pattern with idempotent event ingest',
      'Designed a 4-level territory hierarchy driving both ticket routing and data visibility',
    ],
    challenges: [
      'Resolving out-of-order ticket lineage across systems during ingestion',
      'Keeping mobile sync reliable in low-connectivity field conditions',
    ],
  },
  {
    id: 'solana-dex-analytics',
    slug: 'solana-dex-analytics',
    name: 'Solana DEX Analytics Platform',
    summary: 'Real-time analytics for decentralized exchanges on Solana.',
    description:
      'This platform tracks on-chain DEX activity, surfaces arbitrage opportunities, and provides historical trend analysis for Solana traders.',
    technologies: ['Rust', 'TypeScript', 'React', 'PostgreSQL', 'Solana Web3.js'],
    categories: ['Web3', 'Data', 'Backend'],
    role: 'Backend & Data Engineer',
    status: 'archived',
    featured: false,
    image: '/projects/solana-dex.jpg',
    repositoryUrl: 'https://github.com/DylanMH/solana-dex-analytics',
    achievements: [
      'Processed millions of on-chain events in real time',
      'Built a queryable REST API with sub-second response times',
    ],
    challenges: [
      'Handling chain reorgs and missed blocks gracefully',
      'Designing schemas for high-volume time-series data',
    ],
  },
]

export const projectCategories = Array.from(
  new Set(projects.flatMap((p) => p.categories))
).sort()

export const projectTechnologies = Array.from(
  new Set(projects.flatMap((p) => p.technologies))
).sort()
