import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useResolvedQuality } from '@/hooks/useResolvedQuality'
import { useResponsiveScene } from '@/hooks/useResponsiveScene'

export function SceneEffects() {
  const quality = useResolvedQuality()
  const { enableBloom } = useResponsiveScene(quality)

  if (!enableBloom) return null

  return (
    <EffectComposer>
      <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.5} mipmapBlur />
    </EffectComposer>
  )
}
