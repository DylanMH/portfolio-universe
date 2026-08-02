import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import { celestialSections } from '@/content/scene'
import { useSettingsStore } from '@/store/settingsStore'
import { PortfolioPlanet } from './PortfolioPlanet'

interface SolarSystemProps {
  planetPositionsRef: MutableRefObject<Record<string, THREE.Vector3>>
}

export function SolarSystem({ planetPositionsRef }: SolarSystemProps) {
  const planetRefs = useRef<THREE.Group[]>([])
  const reducedMotion = useSettingsStore((state) => state.reducedMotion)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    celestialSections.forEach((section, i) => {
      const speed = reducedMotion ? 0 : section.orbitSpeed
      const angle = section.initialAngle + time * speed
      const orbitRadius = section.orbitRadius
      const x = Math.cos(angle) * orbitRadius
      const z = Math.sin(angle) * orbitRadius
      const y = (i - (celestialSections.length - 1) / 2) * 0.25
      const position = new THREE.Vector3(x, y, z)

      const planet = planetRefs.current[i]
      if (planet) {
        planet.position.copy(position)
      }

      if (planetPositionsRef.current) {
        planetPositionsRef.current[section.id] = position
      }
    })
  })

  useEffect(() => {
    return () => {
      planetRefs.current = []
    }
  }, [])

  return (
    <group>
      {celestialSections.map((section, i) => (
        <group key={section.id}>
          <PortfolioPlanet
            ref={(el) => {
              if (el) planetRefs.current[i] = el
            }}
            section={section}
          />
        </group>
      ))}
    </group>
  )
}
