import { forwardRef, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { CelestialSection } from '@/types/scene'
import { useSceneStore } from '@/store/sceneStore'
import { useSceneNavigation } from '@/hooks/useSceneNavigation'
import { useResolvedQuality } from '@/hooks/useResolvedQuality'
import { useTextureAsync } from '@/hooks/useTextureAsync'

interface PortfolioPlanetProps {
  section: CelestialSection
}

type TexturePlanetId = 'contact' | 'github' | 'projects' | 'resume' | 'skills'

const moonTextureSources: Record<TexturePlanetId, TexturePlanetId> = {
  contact: 'skills',
  github: 'resume',
  projects: 'contact',
  resume: 'github',
  skills: 'projects',
}

const ringTextureSources: Record<TexturePlanetId, TexturePlanetId> = {
  contact: 'github',
  github: 'contact',
  projects: 'contact',
  resume: 'skills',
  skills: 'github',
}

function texturePaths(id: TexturePlanetId) {
  return {
    albedo: `/assets/planets/${id}-albedo.jpg`,
    normal: `/assets/planets/${id}-normal.jpg`,
  }
}

function TexturedPlanetSurface({
  planetId,
  size,
  config,
}: {
  planetId: TexturePlanetId
  size: number
  config: (typeof materialConfigs)[string]
}) {
  const albedo = useTextureAsync(texturePaths(planetId).albedo)
  const normal = useTextureAsync(texturePaths(planetId).normal, THREE.NoColorSpace)

  if (!albedo) {
    return <BasicPlanetSurface size={size} config={config} />
  }

  return (
    <mesh>
      <sphereGeometry args={[size, 64, 48]} />
      <meshStandardMaterial
        map={albedo}
        normalMap={normal || undefined}
        color={config.color}
        emissive={config.emissive}
        emissiveIntensity={config.emissiveIntensity * 0.12}
        roughness={0.95}
        metalness={0}
        normalScale={normal ? new THREE.Vector2(0.5, 0.5) : undefined}
      />
    </mesh>
  )
}

function TexturedMoon({ planetId, size, tint }: { planetId: TexturePlanetId; size: number; tint: number }) {
  const albedo = useTextureAsync(texturePaths(planetId).albedo)
  const normal = useTextureAsync(texturePaths(planetId).normal, THREE.NoColorSpace)

  if (!albedo) {
    return <BasicMoon size={size} tint={tint} />
  }

  return (
    <mesh>
      <sphereGeometry args={[size, 24, 18]} />
      <meshStandardMaterial
        map={albedo}
        normalMap={normal || undefined}
        color={tint}
        roughness={0.92}
        metalness={0}
        normalScale={normal ? new THREE.Vector2(0.6, 0.6) : undefined}
      />
    </mesh>
  )
}

function TexturedRing({ planetId, color, opacity, innerRadius, outerRadius }: {
  planetId: TexturePlanetId
  color: string
  opacity: number
  innerRadius: number
  outerRadius: number
}) {
  const albedo = useTextureAsync(texturePaths(planetId).albedo)
  const normal = useTextureAsync(texturePaths(planetId).normal, THREE.NoColorSpace)

  if (!albedo) {
    return <BasicRing color={color} opacity={opacity} innerRadius={innerRadius} outerRadius={outerRadius} />
  }

  return (
    <mesh>
      <ringGeometry args={[innerRadius, outerRadius, 96]} />
      <meshStandardMaterial
        map={albedo}
        normalMap={normal || undefined}
        color={color}
        transparent
        opacity={opacity}
        roughness={0.9}
        metalness={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function BasicPlanetSurface({
  size,
  config,
}: {
  size: number
  config: (typeof materialConfigs)[string]
}) {
  return (
    <mesh>
      <sphereGeometry args={[size, 24, 18]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.emissive}
        emissiveIntensity={config.emissiveIntensity * 0.12}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  )
}

function BasicMoon({ size, tint }: { size: number; tint: number }) {
  return (
    <mesh>
      <sphereGeometry args={[size, 16, 12]} />
      <meshStandardMaterial color={tint} roughness={0.92} metalness={0} />
    </mesh>
  )
}

function BasicRing({
  color,
  opacity,
  innerRadius,
  outerRadius,
}: {
  color: string
  opacity: number
  innerRadius: number
  outerRadius: number
}) {
  return (
    <mesh>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

const materialConfigs: Record<string, { color: number; emissive: number; emissiveIntensity: number }> = {
  blue: { color: 0x3b82f6, emissive: 0x1e40af, emissiveIntensity: 0.2 },
  dark: { color: 0x334155, emissive: 0x0f172a, emissiveIntensity: 0.3 },
  violet: { color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 0.2 },
  amber: { color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.2 },
  cyan: { color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.2 },
  experimental: { color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.25 },
}

export const PortfolioPlanet = forwardRef<THREE.Group, PortfolioPlanetProps>(
  function PortfolioPlanet({ section }, ref) {
    const planetRef = useRef<THREE.Mesh>(null)
    const atmosphereRef = useRef<THREE.Mesh>(null)
    const cloudRef = useRef<THREE.Mesh>(null)
    const ringRef = useRef<THREE.Mesh>(null)
    const moonRefs = useRef<THREE.Group[]>([])
    const { setHoveredObject, selectedObject, hoveredObject } = useSceneStore()
    const { goToSection } = useSceneNavigation()
    const isHovered = hoveredObject === section.id
    const isSelected = selectedObject === section.id
    const quality = useResolvedQuality()
    const isLow = quality === 'low'
    const config = materialConfigs[section.visualType] || materialConfigs.blue
    const planetId = section.id as TexturePlanetId
    const moonPlanetId = moonTextureSources[planetId]
    const ringPlanetId = ringTextureSources[planetId]
    const moonData = useMemo(() => {
      return Array.from({ length: section.moonCount ?? 0 }, (_, i) => {
        const angle = (i / (section.moonCount ?? 1)) * Math.PI * 2
        const distance = section.size * (2.7 + i * 0.35)
        return {
          position: [Math.cos(angle) * distance, 0, Math.sin(angle) * distance] as [number, number, number],
          size: section.size * (0.16 + (i % 2) * 0.04),
          distance,
          angle,
          tint: i % 2 ? 0x94a3b8 : 0xcbd5e1,
        }
      })
    }, [section.moonCount, section.size])

    useFrame((state, delta) => {
      if (planetRef.current) planetRef.current.rotation.y += delta * 0.05
      if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.07
      if (ringRef.current) ringRef.current.rotation.z += delta * 0.03
      moonData.forEach((moon, i) => {
        const moonGroup = moonRefs.current[i]
        if (moonGroup) {
          const orbitAngle = moon.angle + state.clock.getElapsedTime() * (0.18 + i * 0.05)
          moonGroup.position.set(
            Math.cos(orbitAngle) * moon.distance,
            0,
            Math.sin(orbitAngle) * moon.distance,
          )
        }
      })
      if (atmosphereRef.current) {
        atmosphereRef.current.rotation.y -= delta * 0.02
        const scale = 1 + Math.sin(performance.now() * 0.001) * 0.01
        atmosphereRef.current.scale.setScalar(scale)
      }
    })

    const handlePointerOver = () => {
      setHoveredObject(section.id)
      document.body.style.cursor = 'pointer'
    }

    const handlePointerOut = () => {
      setHoveredObject(null)
      document.body.style.cursor = 'auto'
    }

    const handleClick = () => {
      goToSection(section.id)
    }

    return (
      <group
        ref={ref}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <group ref={planetRef} rotation={[0, 0, section.axialTilt]}>
          {isLow ? (
            <BasicPlanetSurface size={section.size} config={config} />
          ) : (
            <TexturedPlanetSurface planetId={planetId} size={section.size} config={config} />
          )}
        </group>

        {!isLow && (
          <>
            <mesh ref={atmosphereRef} scale={1.08}>
              <sphereGeometry args={[section.size, 40, 24]} />
              <meshBasicMaterial
                color={section.atmosphereColor}
                transparent
                opacity={0.12}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
              />
            </mesh>

            <mesh ref={cloudRef} scale={1.015}>
              <sphereGeometry args={[section.size, 40, 24]} />
              <meshStandardMaterial color={section.atmosphereColor} transparent opacity={0.1} roughness={1} depthWrite={false} />
            </mesh>
          </>
        )}

        {section.hasRings && (
          <group ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
            {isLow ? (
              <>
                <BasicRing
                  color={section.color}
                  opacity={0.28}
                  innerRadius={section.size * 1.35}
                  outerRadius={section.size * 1.7}
                />
                <group rotation={[0.08, 0, 0]}>
                  <BasicRing
                    color={section.atmosphereColor}
                    opacity={0.4}
                    innerRadius={section.size * 1.8}
                    outerRadius={section.size * 2.05}
                  />
                </group>
              </>
            ) : (
              <>
                <TexturedRing
                  planetId={ringPlanetId}
                  color={section.color}
                  opacity={0.28}
                  innerRadius={section.size * 1.35}
                  outerRadius={section.size * 1.7}
                />
                <group rotation={[0.08, 0, 0]}>
                  <TexturedRing
                    planetId={ringPlanetId}
                    color={section.atmosphereColor}
                    opacity={0.4}
                    innerRadius={section.size * 1.8}
                    outerRadius={section.size * 2.05}
                  />
                </group>
              </>
            )}
          </group>
        )}

        {moonData.map((moon, i) => (
          <group key={i} rotation={[section.axialTilt * 0.4, 0, section.axialTilt * 0.15]}>
            <group
              ref={(group) => {
                if (group) moonRefs.current[i] = group
              }}
              position={moon.position}
            >
              {isLow ? (
                <BasicMoon size={moon.size} tint={moon.tint} />
              ) : (
                <TexturedMoon planetId={moonPlanetId} size={moon.size} tint={moon.tint} />
              )}
            </group>
          </group>
        ))}

        {(isHovered || isSelected) && (
          <Html position={[0, section.size * 1.4, 0]} center>
            <span className="planet-label whitespace-nowrap text-center">{section.label}</span>
          </Html>
        )}
      </group>
    )
  }
)
