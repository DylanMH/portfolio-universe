import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useResolvedQuality } from '@/hooks/useResolvedQuality'
import { useTextureAsync } from '@/hooks/useTextureAsync'

const nebulaClouds = [
  { position: [-120, 45, -170] as [number, number, number], scale: [130, 42, 1] as [number, number, number], color: '#4c1d95', opacity: 0.08 },
  { position: [130, -35, -210] as [number, number, number], scale: [150, 48, 1] as [number, number, number], color: '#164e63', opacity: 0.07 },
  { position: [20, 90, -280] as [number, number, number], scale: [105, 34, 1] as [number, number, number], color: '#881337', opacity: 0.05 },
]

function createCloudTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')
  if (!context) return null
  const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(255,255,255,0.85)')
  gradient.addColorStop(0.28, 'rgba(255,255,255,0.35)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)
  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

const configureEquirectTexture = (texture: THREE.Texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
}

function MilkyWaySphere({ brightness }: { brightness: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const map = useTextureAsync('/assets/background/milkyway.jpg', THREE.SRGBColorSpace, configureEquirectTexture)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.002
  })

  if (!map) return null

  return (
    <mesh ref={ref} scale={900}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        map={map}
        color={brightness}
        side={THREE.BackSide}
        fog={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export function NebulaBackground() {
  const quality = useResolvedQuality()
  const cloudTexture = useMemo(() => createCloudTexture(), [])
  // Non-high tiers get no bloom pass, which leaves the background reading
  // dark — compensate with a brighter sky tint and stronger nebulae (free).
  const dimmer = quality !== 'high'

  return (
    <>
      {quality !== 'low' && <MilkyWaySphere brightness={dimmer ? '#9c9cae' : '#6b6b78'} />}
      {cloudTexture && nebulaClouds.map((cloud) => (
        <sprite key={cloud.position.join('-')} position={cloud.position} scale={cloud.scale}>
          <spriteMaterial map={cloudTexture} color={cloud.color} transparent opacity={dimmer ? cloud.opacity * 1.5 : cloud.opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </>
  )
}
