import type { SkillCategory } from '../types/content'

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    color: '#22d3ee',
    skills: [
      { id: 'react', name: 'React', category: 'frontend', experience: 'expert', yearsUsed: 5, description: 'Component architecture, hooks, performance, and ecosystem tooling.' },
      { id: 'typescript', name: 'TypeScript', category: 'frontend', experience: 'expert', yearsUsed: 5, description: 'Strict typing, advanced generics, and large-scale application design.' },
      { id: 'nextjs', name: 'Next.js', category: 'frontend', experience: 'advanced', yearsUsed: 4, description: 'App Router, SSR, ISR, and API routes.' },
      { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', experience: 'advanced', yearsUsed: 4, description: 'Utility-first styling, design systems, and responsive layouts.' },
      { id: 'threejs', name: 'Three.js / WebGL', category: 'frontend', experience: 'advanced', yearsUsed: 3, description: 'Real-time 3D, shaders, and interactive scenes.' },
      { id: 'framer-motion', name: 'Framer Motion', category: 'frontend', experience: 'advanced', yearsUsed: 3, description: 'Declarative animations and gesture-driven interactions.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    color: '#818cf8',
    skills: [
      { id: 'nodejs', name: 'Node.js', category: 'backend', experience: 'advanced', yearsUsed: 4, description: 'Event-driven servers, streams, and scalable APIs.' },
      { id: 'graphql', name: 'GraphQL', category: 'backend', experience: 'intermediate', yearsUsed: 3, description: 'Schema design, resolvers, and federation.' },
      { id: 'postgresql', name: 'PostgreSQL', category: 'backend', experience: 'advanced', yearsUsed: 4, description: 'Schema design, indexing, and complex queries.' },
      { id: 'python', name: 'Python', category: 'backend', experience: 'intermediate', yearsUsed: 3, description: 'Data pipelines, scripting, and backend services.' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    color: '#34d399',
    skills: [
      { id: 'react-native', name: 'React Native', category: 'mobile', experience: 'advanced', yearsUsed: 3, description: 'Cross-platform apps with native module integration.' },
      { id: 'expo', name: 'Expo', category: 'mobile', experience: 'intermediate', yearsUsed: 2, description: 'Managed workflows and Over-the-Air updates.' },
      { id: 'ios', name: 'iOS Basics', category: 'mobile', experience: 'intermediate', yearsUsed: 2, description: 'SwiftUI and App Store release workflows.' },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    color: '#fbbf24',
    skills: [
      { id: 'redis', name: 'Redis', category: 'databases', experience: 'intermediate', yearsUsed: 3, description: 'Caching, pub/sub, and rate limiting.' },
      { id: 'supabase', name: 'Supabase', category: 'databases', experience: 'advanced', yearsUsed: 3, description: 'Postgres as a service, auth, and real-time subscriptions.' },
      { id: 'sqlite', name: 'SQLite', category: 'databases', experience: 'advanced', yearsUsed: 4, description: 'Local-first apps and embedded persistence.' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    color: '#f87171',
    skills: [
      { id: 'docker', name: 'Docker', category: 'devops', experience: 'intermediate', yearsUsed: 3, description: 'Containerization and multi-stage builds.' },
      { id: 'github-actions', name: 'GitHub Actions', category: 'devops', experience: 'advanced', yearsUsed: 4, description: 'CI/CD pipelines, testing, and deployment.' },
      { id: 'vercel', name: 'Vercel', category: 'devops', experience: 'advanced', yearsUsed: 4, description: 'Edge functions, deployments, and analytics.' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    color: '#60a5fa',
    skills: [
      { id: 'aws', name: 'AWS', category: 'cloud', experience: 'intermediate', yearsUsed: 2, description: 'S3, Lambda, RDS, and EC2 fundamentals.' },
      { id: 'gcp', name: 'Google Cloud', category: 'cloud', experience: 'intermediate', yearsUsed: 2, description: 'Cloud Run, Firestore, and serverless functions.' },
      { id: 'supabase-cloud', name: 'Supabase Platform', category: 'cloud', experience: 'advanced', yearsUsed: 3, description: 'Managed Postgres, edge functions, and auth.' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    color: '#c084fc',
    skills: [
      { id: 'openai', name: 'OpenAI API', category: 'ai', experience: 'advanced', yearsUsed: 3, description: 'Prompt engineering, function calling, and agents.' },
      { id: 'langchain', name: 'LangChain', category: 'ai', experience: 'intermediate', yearsUsed: 2, description: 'Retrieval chains and tool orchestration.' },
      { id: 'pytorch', name: 'PyTorch', category: 'ai', experience: 'beginner', yearsUsed: 1, description: 'Neural network experiments and data loading.' },
    ],
  },
  {
    id: 'game',
    label: 'Game Development',
    color: '#fb923c',
    skills: [
      { id: 'unity', name: 'Unity', category: 'game', experience: 'advanced', yearsUsed: 4, description: '2D/3D gameplay, physics, and editor tooling.' },
      { id: 'csharp', name: 'C#', category: 'game', experience: 'advanced', yearsUsed: 5, description: 'Game logic, tooling, and performance-sensitive code.' },
      { id: 'godot', name: 'Godot', category: 'game', experience: 'intermediate', yearsUsed: 2, description: 'GDScript, scene system, and UI.' },
    ],
  },
  {
    id: 'design',
    label: 'Design Tools',
    color: '#f472b6',
    skills: [
      { id: 'figma', name: 'Figma', category: 'design', experience: 'advanced', yearsUsed: 4, description: 'Design systems, prototyping, and developer handoff.' },
      { id: 'blender', name: 'Blender', category: 'design', experience: 'intermediate', yearsUsed: 2, description: '3D modeling, materials, and rendering.' },
      { id: 'aseprite', name: 'Aseprite', category: 'design', experience: 'intermediate', yearsUsed: 3, description: 'Pixel art and sprite animation.' },
    ],
  },
  {
    id: 'tools',
    label: 'Development Tools',
    color: '#94a3b8',
    skills: [
      { id: 'git', name: 'Git', category: 'tools', experience: 'expert', yearsUsed: 6, description: 'Branching strategies, rebasing, and CI integration.' },
      { id: 'vite', name: 'Vite', category: 'tools', experience: 'advanced', yearsUsed: 3, description: 'Fast builds, HMR, and plugin authoring.' },
      { id: 'vitest', name: 'Vitest', category: 'tools', experience: 'advanced', yearsUsed: 3, description: 'Unit testing and component testing.' },
      { id: 'playwright', name: 'Playwright', category: 'tools', experience: 'intermediate', yearsUsed: 2, description: 'End-to-end testing and browser automation.' },
    ],
  },
]
