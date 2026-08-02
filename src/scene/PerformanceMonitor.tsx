import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useSettingsStore } from '@/store/settingsStore'

export function PerformanceMonitor() {
  const { gl } = useThree()
  const quality = useSettingsStore((state) => state.quality)
  const setQuality = useSettingsStore((state) => state.setQuality)

  useEffect(() => {
    if (quality !== 'auto') return

    let frameCount = 0
    let lastTime = performance.now()
    let id: number

    const check = () => {
      const now = performance.now()
      frameCount++
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime))
        if (fps < 30) setQuality('low')
        else if (fps < 50) setQuality('medium')
        frameCount = 0
        lastTime = now
      }
      id = requestAnimationFrame(check)
    }

    id = requestAnimationFrame(check)
    return () => cancelAnimationFrame(id)
  }, [setQuality, gl, quality])

  return null
}
