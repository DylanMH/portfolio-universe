export type ProjectStatus = 'completed' | 'active' | 'prototype' | 'archived'

export interface PortfolioProject {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  technologies: string[]
  categories: string[]
  role?: string
  status: ProjectStatus
  featured: boolean
  image?: string
  gallery?: string[]
  videoUrl?: string
  demoUrl?: string
  repositoryUrl?: string
  achievements?: string[]
  challenges?: string[]
}

export interface Profile {
  name: string
  title: string
  location: string
  focus: string
  bio: string
  mission: string
  yearsOfExperience: number
  avatar?: string
  currentRole?: string
  email: string
  availability: string
}

export interface Skill {
  id: string
  name: string
  category: string
  experience: 'expert' | 'advanced' | 'intermediate' | 'beginner'
  yearsUsed: number
  relatedProjects?: string[]
  icon?: string
  description?: string
}

export interface SkillCategory {
  id: string
  label: string
  color: string
  skills: Skill[]
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  current: boolean
  location?: string
  summary: string
  responsibilities: string[]
  technologies: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current: boolean
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date?: string
  url?: string
  image?: string
}

export interface SocialLink {
  id: string
  label: string
  url: string
  icon: string
}

export interface GithubRepo {
  id: number
  name: string
  fullName: string
  description: string
  htmlUrl: string
  language: string
  topics: string[]
  stars: number
  forks: number
  updatedAt: string
  visibility: 'public' | 'private'
  homepage?: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  honeypot: string
}

export interface LabExperiment {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  status: ProjectStatus
  technologies: string[]
  demoUrl?: string
  repositoryUrl?: string
  image?: string
}
