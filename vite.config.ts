import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function netlifyProxyPlugin(mode: string) {
  return {
    name: 'netlify-proxy',
    configureServer(server: { middlewares: { use: (path: string, handler: (req: any, res: any, next: any) => void) => void } }) {
      const env = loadEnv(mode, process.cwd(), '')
      process.env.GITHUB_PERSONAL_ACCESS_TOKEN = env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN
      process.env.GITHUB_USERNAME = env.GITHUB_USERNAME || env.VITE_GITHUB_USERNAME || process.env.GITHUB_USERNAME || process.env.VITE_GITHUB_USERNAME

      server.middlewares.use('/api/github-repos', async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'POST') return next()

        try {
          // @ts-ignore no declaration file for the Netlify function
          const { default: handler } = await import('./netlify/functions/github-repos.mjs')
          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          const event = {
            httpMethod: req.method,
            path: req.url,
            queryStringParameters: Object.fromEntries(parsedUrl.searchParams),
            multiValueQueryStringParameters: {},
            headers: req.headers,
            body: null,
            isBase64Encoded: false,
          }
          const result = await handler(event, {})
          res.statusCode = result.statusCode || 200
          if (result.headers) {
            Object.entries(result.headers).forEach(([key, value]) => {
              if (value) res.setHeader(key, value)
            })
          }
          res.end(result.body)
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), netlifyProxyPlugin(mode)],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
