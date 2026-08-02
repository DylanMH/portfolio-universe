import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useResolvedQuality } from '@/hooks/useResolvedQuality'
import { useResponsiveScene } from '@/hooks/useResponsiveScene'

export function StarField() {
  const groupRef = useRef<THREE.Group>(null)
  const quality = useResolvedQuality()
  const { starCount, enableParticles } = useResponsiveScene(quality)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.005
    }
  })

  if (!enableParticles) return null

  return (
    <group ref={groupRef}>
      <Stars
        radius={260}
        depth={180}
        count={starCount}
        factor={4.5}
        saturation={0.55}
        fade
        speed={0.18}
      />
      <Stars
        radius={140}
        depth={90}
        count={Math.floor(starCount * 0.28)}
        factor={8}
        saturation={0.75}
        fade
        speed={0.08}
      />
    </group>
  )
}
