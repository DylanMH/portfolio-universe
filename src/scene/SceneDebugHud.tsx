import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { useDeviceQuality } from '@/hooks/useDeviceQuality'

export const SCENE_BUILD_ID = 'bh-2026-08-02.2-med2.5-aniso16'

interface DebugInfo {
  buildId: string
  qualitySetting: string
  resolvedQuality: string
  devicePixelRatio: number
  innerSize: string
  canvasBuffer: string
  canvasCss: string
  webglVersion: string
  fragmentHighp: string
  gpuRenderer: string
}

function collectInfo(qualitySetting: string, resolvedQuality: string): DebugInfo {
  const canvas = document.querySelector('canvas')
  let webglVersion = 'none'
  let fragmentHighp = 'unknown'
  let gpuRenderer = 'unknown'

  if (canvas) {
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null
    if (gl) {
      webglVersion = gl instanceof WebGL2RenderingContext ? 'webgl2' : 'webgl1'
      const pf = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
      fragmentHighp = pf && pf.precision > 0 ? `yes (${pf.precision}b)` : 'NO'
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      if (ext) {
        gpuRenderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
      }
    }
  }

  return {
    buildId: SCENE_BUILD_ID,
    qualitySetting,
    resolvedQuality,
    devicePixelRatio: window.devicePixelRatio,
    innerSize: `${window.innerWidth}x${window.innerHeight}`,
    canvasBuffer: canvas ? `${canvas.width}x${canvas.height}` : 'no canvas',
    canvasCss: canvas ? `${canvas.clientWidth}x${canvas.clientHeight}` : 'n/a',
    webglVersion,
    fragmentHighp,
    gpuRenderer,
  }
}

export function SceneDebugHud() {
  const qualitySetting = useSettingsStore((state) => state.quality)
  const resolvedQuality = useDeviceQuality(qualitySetting)
  const [info, setInfo] = useState<DebugInfo | null>(null)
  const enabled =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')

  useEffect(() => {
    if (!enabled) return
    const update = () => setInfo(collectInfo(qualitySetting, resolvedQuality))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [enabled, qualitySetting, resolvedQuality])

  if (!enabled || !info) return null

  return (
    <div className="pointer-events-none fixed left-2 top-2 z-50 max-w-[92vw] rounded-lg bg-black/85 p-3 font-mono text-[10px] leading-relaxed text-green-300">
      {Object.entries(info).map(([key, value]) => (
        <div key={key}>
          <span className="text-green-600">{key}:</span> {String(value)}
        </div>
      ))}
    </div>
  )
}
