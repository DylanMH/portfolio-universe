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
  const anglesRef = useRef<number[]>(celestialSections.map((s) => s.initialAngle))
  const reducedMotion = useSettingsStore((state) => state.reducedMotion)

  useFrame((_, delta) => {
    // Accumulate from clamped deltas instead of absolute clock time so that
    // browser tab switches / RAF hitches never teleport the planets.
    const dt = reducedMotion ? 0 : Math.min(delta, 0.1)

    celestialSections.forEach((section, i) => {
      anglesRef.current[i] += dt * section.orbitSpeed
      const angle = anglesRef.current[i]
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
