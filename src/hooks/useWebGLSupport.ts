import { useMemo } from 'react'

export function useWebGLSupport(): boolean {
  return useMemo(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    } catch {
      return false
    }
  }, [])
}
