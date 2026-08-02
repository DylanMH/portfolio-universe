import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSettingsStore } from '@/store/settingsStore'
import { useDeviceQuality } from '@/hooks/useDeviceQuality'
import { useResponsiveScene } from '@/hooks/useResponsiveScene'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import type { QualityLevel } from '@/types/scene'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { SceneLighting } from './SceneLighting'
import { NebulaBackground } from './NebulaBackground'
import { StarField } from './StarField'
import { BlackHole } from './BlackHole'
import { SolarSystem } from './SolarSystem'
import { CameraController } from './CameraController'
import { SceneEffects } from './SceneEffects'
import { PerformanceMonitor } from './PerformanceMonitor'

function Scene({ quality }: { quality: QualityLevel }) {
  const { camera } = useThree()
  const planetPositionsRef = useRef<Record<string, THREE.Vector3>>({})

  // Set initial camera position
  useMemo(() => {
    camera.position.set(0, 60, 150)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <SceneLighting />
      <NebulaBackground />
      <StarField />
      <BlackHole quality={quality} />
      <SolarSystem planetPositionsRef={planetPositionsRef} />
      <CameraController planetPositionsRef={planetPositionsRef} />
      <SceneEffects />
      <PerformanceMonitor />
    </>
  )
}

export default function SpaceScene() {
  const qualitySetting = useSettingsStore((state) => state.quality)
  const reducedMotionSetting = useSettingsStore((state) => state.reducedMotion)
  const quality = useDeviceQuality(qualitySetting)
  const responsive = useResponsiveScene(quality)
  const reducedMotion = useReducedMotion() || reducedMotionSetting
  const webglSupported = useWebGLSupport()

  if (!webglSupported || quality === '2d') {
    return (
      <div className="fixed inset-0 z-0 flex items-center justify-center bg-void text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">2D View</h2>
          <p className="mt-2 text-space-muted">WebGL is disabled or unavailable. Use the navigation menu to explore sections.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={<LoadingScreen fullScreen message="Generating universe..." />}>
        <Canvas
          camera={{ position: [0, 60, 150], fov: 60, near: 0.1, far: 1000 }}
          dpr={responsive.dpr}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          frameloop={reducedMotion ? 'never' : 'always'}
        >
          <Scene key={quality} quality={quality} />
        </Canvas>
      </Suspense>
    </div>
  )
}
