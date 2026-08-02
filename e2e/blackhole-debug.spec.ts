import { test, expect } from '@playwright/test'

const qualities = ['low', 'medium', 'high'] as const

for (const q of qualities) {
  test(`blackhole debug - ${q}`, async ({ page }) => {
    const errors: string[] = []
    const logs: string[] = []
    page.on('console', msg => {
      const text = msg.text()
      logs.push(`[${msg.type()}] ${text}`)
      if (msg.type() === 'error' || msg.type() === 'warning') {
        errors.push(`[${msg.type()}] ${text}`)
      }
    })
    page.on('pageerror', err => errors.push(`[pageerror] ${err.message}`))

    await page.addInitScript((quality) => {
      localStorage.setItem('portfolio-universe-settings', JSON.stringify({
        state: { quality, reducedMotion: false, soundEnabled: false },
        version: 0
      }))
    }, q)

    await page.goto('/')
    await page.waitForTimeout(8000)

    await page.screenshot({ path: `e2e/blackhole-${q}.png`, fullPage: false })
    // Also take a cropped screenshot of just the center 400x400 region
    await page.screenshot({ 
      path: `e2e/blackhole-${q}-center.png`, 
      clip: { x: 440, y: 160, width: 400, height: 400 } 
    })

    const settings = await page.evaluate(() => localStorage.getItem('portfolio-universe-settings'))
    
    // Read pixels from multiple regions via WebGL
    const pixelInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      if (!canvas) return null
      const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext
      if (!gl) return null
      const w = canvas.width
      const h = canvas.height

      function sampleRegion(x: number, y: number, size: number) {
        const pixels = new Uint8Array(size * size * 4)
        gl.readPixels(x, y, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        let nonBlack = 0, maxR = 0, maxG = 0, maxB = 0
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i+1], b = pixels[i+2]
          if (r > 10 || g > 10 || b > 10) nonBlack++
          maxR = Math.max(maxR, r)
          maxG = Math.max(maxG, g)
          maxB = Math.max(maxB, b)
        }
        return { nonBlack, total: size * size, maxR, maxG, maxB }
      }

      // Sample center, corners, and edges (WebGL origin is bottom-left)
      const size = 50
      return {
        center: sampleRegion(Math.floor(w/2) - size/2, Math.floor(h/2) - size/2, size),
        topLeft: sampleRegion(10, h - 60, size),
        topRight: sampleRegion(w - 60, h - 60, size),
        bottomLeft: sampleRegion(10, 10, size),
        bottomRight: sampleRegion(w - 60, 10, size),
        midTop: sampleRegion(Math.floor(w/2) - size/2, h - 120, size),
        midBottom: sampleRegion(Math.floor(w/2) - size/2, 70, size),
        midLeft: sampleRegion(120, Math.floor(h/2) - size/2, size),
        midRight: sampleRegion(w - 170, Math.floor(h/2) - size/2, size),
      }
    })

    // Also check DOM for any error states or loading screens
    const domInfo = await page.evaluate(() => {
      const loadingScreen = document.querySelector('[class*="loading"]') || document.querySelector('[class*="Loading"]')
      const canvas = document.querySelector('canvas')
      const canvasRect = canvas?.getBoundingClientRect()
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const webglSupport = !!window.WebGLRenderingContext
      // Check for any error boundaries or error text
      const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]')
      const allText = document.body.innerText?.substring(0, 500)
      return {
        hasLoadingScreen: !!loadingScreen,
        loadingText: loadingScreen?.textContent,
        canvasRect: canvasRect ? { x: canvasRect.x, y: canvasRect.y, w: canvasRect.width, h: canvasRect.height } : null,
        bodyClasses: document.body.className,
        prefersReducedMotion: reducedMotion,
        webglSupport,
        errorTexts: Array.from(errorElements).map(e => e.textContent).filter(Boolean),
        bodyText: allText,
      }
    })

    console.log(`\n=== ${q.toUpperCase()} ===`)
    console.log(`Settings: ${settings}`)
    console.log(`Center pixels (WebGL):`, pixelInfo)
    console.log(`DOM:`, domInfo)
    console.log(`All logs:`, logs)
    console.log(`Errors:`, errors.length ? errors : 'none')
  })
}
