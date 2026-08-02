import type { Vector3Tuple } from 'three'

export type QualityLevel = 'auto' | 'high' | 'medium' | 'low' | '2d'

export type TransitionState = 'idle' | 'traveling' | 'arriving' | 'content'

export interface CelestialSection {
  id: string
  route: string
  label: string
  description: string
  orbitRadius: number
  orbitSpeed: number
  size: number
  initialAngle: number
  axialTilt: number
  visualType: 'blue' | 'dark' | 'violet' | 'amber' | 'cyan' | 'experimental'
  color: string
  atmosphereColor: string
  cameraOffset: Vector3Tuple
  mobileCameraOffset: Vector3Tuple
  hasRings?: boolean
  moonCount?: number
}

export interface SceneTarget {
  objectId: string | null
  position: Vector3Tuple
  lookAt: Vector3Tuple
}

export interface SceneState {
  currentSection: string | null
  selectedObject: string | null
  hoveredObject: string | null
  previousObject: string | null
  transitionState: TransitionState
  introCompleted: boolean
  contentPanelOpen: boolean
  interactionLocked: boolean
  cameraTarget: SceneTarget | null
  reducedMotion: boolean
}

export type RouteToSectionMap = Record<string, string | null>

export const ROUTE_MAP: RouteToSectionMap = {
  '/': null,
  '/about': 'about',
  '/projects': 'projects',
  '/github': 'github',
  '/skills': 'skills',
  '/resume': 'resume',
  '/contact': 'contact',
}
