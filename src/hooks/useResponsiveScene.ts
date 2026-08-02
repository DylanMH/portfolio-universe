import { useEffect, useState } from 'react'
import type { QualityLevel } from '../types/scene'

export interface ResponsiveSceneConfig {
  isMobile: boolean
  isTablet: boolean
  orbitScale: number
  cameraScale: number
  starCount: number
  enableBloom: boolean
  enableParticles: boolean
  dpr: number
}

export function useResponsiveScene(quality: QualityLevel): ResponsiveSceneConfig {
  const resolved = quality === 'auto' ? 'high' : quality

  const [config, setConfig] = useState<ResponsiveSceneConfig>({
    isMobile: false,
    isTablet: false,
    orbitScale: 1,
    cameraScale: 1,
    starCount: resolved === 'high' ? 6000 : resolved === 'medium' ? 3000 : 800,
    enableBloom: resolved === 'high',
    enableParticles: resolved !== '2d',
    dpr: 1,
  })

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const baseDpr = window.devicePixelRatio || 1
      const qualityCap = resolved === 'low' ? 1 : resolved === 'medium' ? 1.75 : 2
      // On mobile, honor an explicit HIGH selection with the native pixel ratio —
      // upscale blur is far more visible on high-DPI phone screens.
      const dprCap = isMobile && resolved === 'high' ? baseDpr : qualityCap
      const dpr = Math.min(baseDpr, dprCap)

      setConfig({
        isMobile,
        isTablet,
        orbitScale: isMobile ? 0.28 : isTablet ? 0.38 : 0.46,
        cameraScale: isMobile ? 1.2 : 1,
        starCount: resolved === 'high' ? 6000 : resolved === 'medium' ? 3000 : 800,
        enableBloom: resolved === 'high',
        enableParticles: resolved !== '2d',
        dpr,
      })
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [quality, resolved])

  return config
}
