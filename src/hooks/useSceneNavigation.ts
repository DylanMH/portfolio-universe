import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSceneStore } from '../store/sceneStore'
import { ROUTE_MAP } from '../types/scene'

const SECTION_TO_ROUTE: Record<string, string> = {
  about: '/about',
  projects: '/projects',
  github: '/github',
  skills: '/skills',
  resume: '/resume',
  contact: '/contact',
}

export function useSceneNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectSection = useSceneStore((state) => state.selectSection)
  const returnHome = useSceneStore((state) => state.returnHome)

  const goToSection = useCallback(
    (id: string) => {
      const route = SECTION_TO_ROUTE[id]
      if (!route) return
      selectSection(id)
      if (location.pathname !== route) {
        navigate(route)
      }
    },
    [navigate, selectSection, location.pathname]
  )

  const goHome = useCallback(() => {
    returnHome()
    if (location.pathname !== '/') {
      navigate('/')
    }
  }, [navigate, returnHome, location.pathname])

  const syncRouteToSection = useCallback(() => {
    const sectionId = ROUTE_MAP[location.pathname]
    if (sectionId) {
      selectSection(sectionId)
    } else if (location.pathname === '/') {
      returnHome()
    }
  }, [location.pathname, selectSection, returnHome])

  return { goToSection, goHome, syncRouteToSection, currentSection: ROUTE_MAP[location.pathname] }
}
