export function measureFps(callback: (fps: number) => void): () => void {
  let frameCount = 0
  let lastTime = performance.now()
  let running = true
  let rafId: number

  const loop = (time: number) => {
    if (!running) return
    frameCount++
    const delta = time - lastTime
    if (delta >= 1000) {
      callback(Math.round((frameCount * 1000) / delta))
      frameCount = 0
      lastTime = time
    }
    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)

  return () => {
    running = false
    cancelAnimationFrame(rafId)
  }
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = window.setTimeout(() => fn(...args), delay)
  }
}
