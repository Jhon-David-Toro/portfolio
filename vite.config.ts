import type { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', reject)
  })
}

/**
 * Serves api/chat.ts under `npm run dev` (dev-only, not part of the
 * production build). Vercel deploys that file directly as an Edge Function;
 * this loads the exact same file through Vite's SSR module graph and
 * adapts Node's req/res to the Web Request/Response it already speaks, so
 * there's no second copy of the handler logic to keep in sync.
 */
function localApiPlugin(): Plugin {
  return {
    name: 'local-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(
        '/api/chat',
        async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
          try {
            const body = req.method === 'POST' ? await readRequestBody(req) : undefined
            const module = await server.ssrLoadModule('/api/chat.ts')
            const handler = module.default as (request: Request) => Promise<Response>

            const request = new Request('http://localhost/api/chat', {
              method: req.method,
              headers: { 'content-type': 'application/json' },
              body,
            })

            const response = await handler(request)
            res.statusCode = response.status
            response.headers.forEach((value, key) => {
              res.setHeader(key, value)
            })
            res.end(await response.text())
          } catch (error) {
            next(error instanceof Error ? error : new Error(String(error)))
          }
        },
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite only auto-loads VITE_-prefixed vars into process.env for its own
  // import.meta.env handling — server-only vars like GEMINI_API_KEY (see
  // .env.example) need to be loaded and assigned explicitly to be visible
  // to api/chat.ts when localApiPlugin runs it in dev. loadEnv's 3rd arg
  // ('') means "load every var, not just VITE_-prefixed ones".
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), localApiPlugin()],
    resolve: {
      alias: {
        '@': srcDir,
      },
    },
  }
})
