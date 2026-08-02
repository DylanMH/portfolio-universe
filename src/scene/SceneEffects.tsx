import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useResolvedQuality } from '@/hooks/useResolvedQuality'
import { useResponsiveScene } from '@/hooks/useResponsiveScene'

export function SceneEffects() {
  const quality = useResolvedQuality()
  const { enableBloom, isMobile } = useResponsiveScene(quality)

  if (!enableBloom) return null

  // MSAA does nothing for the raymarched black hole (its edges are computed
  // in-shader), so on mobile we drop it to 2x — a large bandwidth saving at
  // native DPR with no visible loss on the shader-driven scene.
  return (
    <EffectComposer multisampling={isMobile ? 2 : 8}>
      <Bloom intensity={0.35} luminanceThreshold={0.2} luminanceSmoothing={0.5} mipmapBlur />
    </EffectComposer>
  )
}
