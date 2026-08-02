import { useMemo } from 'react'
import type { QualityLevel } from '../types/scene'

export function useDeviceQuality(userQuality: QualityLevel = 'auto'): QualityLevel {
  return useMemo<QualityLevel>(() => {
    if (userQuality !== 'auto') return userQuality

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    const cores = navigator.hardwareConcurrency || 2
    const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4

    if (!window.WebGLRenderingContext) return '2d'
    if (isMobile && (cores <= 2 || memory <= 2)) return 'low'
    if (isMobile) return 'medium'
    return 'high'
  }, [userQuality])
}
