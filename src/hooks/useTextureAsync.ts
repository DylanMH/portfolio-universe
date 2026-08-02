import { useEffect, useState } from 'react'
import * as THREE from 'three'

export function useTextureAsync(
  url: string | null,
  colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace,
  configure?: (texture: THREE.Texture) => void
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false

    const loader = new THREE.TextureLoader()
    loader.load(
      url,
      (loaded) => {
        if (!cancelled) {
          loaded.colorSpace = colorSpace
          configure?.(loaded)
          setTexture(loaded)
        }
      },
      undefined,
      (error) => {
        console.warn('Failed to load texture:', url, error)
      }
    )

    return () => {
      cancelled = true
    }
  }, [url, colorSpace, configure])

  return texture
}
