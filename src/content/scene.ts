import type { CelestialSection } from '../types/scene'

export const BLACK_HOLE_ID = 'about'

export const celestialSections: CelestialSection[] = [
  {
    id: 'projects',
    route: '/projects',
    label: 'Featured Projects',
    description: 'Hand-selected projects and case studies.',
    orbitRadius: 45,
    orbitSpeed: 0.085,
    size: 5.0,
    initialAngle: 0,
    axialTilt: 0.25,
    visualType: 'blue',
    color: '#3b82f6',
    atmosphereColor: '#60a5fa',
    cameraOffset: [0, 2.5, 12],
    mobileCameraOffset: [0, 3, 17],
  },
  {
    id: 'github',
    route: '/github',
    label: 'GitHub Universe',
    description: 'Public repositories and open-source work.',
    orbitRadius: 62,
    orbitSpeed: 0.085,
    size: 4.6,
    initialAngle: Math.PI / 3,
    axialTilt: -0.4,
    visualType: 'dark',
    color: '#475569',
    atmosphereColor: '#94a3b8',
    cameraOffset: [0, 2.5, 12],
    mobileCameraOffset: [0, 3, 17],
    hasRings: true,
  },
  {
    id: 'skills',
    route: '/skills',
    label: 'Skills',
    description: 'Technical skills and competencies.',
    orbitRadius: 80,
    orbitSpeed: 0.085,
    size: 5.4,
    initialAngle: (Math.PI * 2) / 3,
    axialTilt: 0.5,
    visualType: 'violet',
    color: '#8b5cf6',
    atmosphereColor: '#c084fc',
    cameraOffset: [0, 3, 13],
    mobileCameraOffset: [0, 3.5, 18],
    moonCount: 3,
  },
  {
    id: 'resume',
    route: '/resume',
    label: 'Resume & Experience',
    description: 'Work history, education, and achievements.',
    orbitRadius: 98,
    orbitSpeed: 0.085,
    size: 4.2,
    initialAngle: Math.PI,
    axialTilt: -0.2,
    visualType: 'amber',
    color: '#f59e0b',
    atmosphereColor: '#fbbf24',
    cameraOffset: [0, 2.5, 12],
    mobileCameraOffset: [0, 3, 17],
  },
  {
    id: 'contact',
    route: '/contact',
    label: 'Contact',
    description: 'Send a message or connect.',
    orbitRadius: 118,
    orbitSpeed: 0.085,
    size: 3.8,
    initialAngle: (Math.PI * 4) / 3,
    axialTilt: 0.35,
    visualType: 'cyan',
    color: '#06b6d4',
    atmosphereColor: '#22d3ee',
    cameraOffset: [0, 2.5, 12],
    mobileCameraOffset: [0, 3, 17],
    hasRings: true,
  },
]

export const CELESTIAL_IDS = [BLACK_HOLE_ID, ...celestialSections.map((s) => s.id)]

export const getCelestialById = (id: string): CelestialSection | undefined =>
  id === BLACK_HOLE_ID ? undefined : celestialSections.find((s) => s.id === id)

export const getSectionByRoute = (route: string): CelestialSection | undefined =>
  celestialSections.find((s) => s.route === route)
