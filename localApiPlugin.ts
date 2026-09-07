import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin, ViteDevServer } from 'vite'
import type { ApiHandler } from './localApiPlugin.types.js'

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', reject)
  })
}

// connect strips the middleware's mount prefix ('/api'), leaving e.g.
// '/chat' — this recovers the bare route name, or null for '/api' itself.
function resolveRouteName(url: string | undefined): string | null {
  if (!url) {
    return null
  }
  const routeName = url.split('?')[0].replace(/^\//, '')
  return routeName.length > 0 ? routeName : null
}

function shouldReadBody(method: string | undefined): boolean {
  return method !== 'GET' && method !== 'HEAD'
}

async function buildProxyRequest(routeName: string, req: IncomingMessage): Promise<Request> {
  const body = shouldReadBody(req.method) ? await readRequestBody(req) : undefined
  return new Request(`http://localhost/api/${routeName}`, {
    method: req.method,
    headers: { 'content-type': 'application/json' },
    body,
  })
}

// Loads the handler through Vite's SSR module graph rather than a plain
// dynamic import, so it's transpiled the same way the rest of the app is
// (TS, path aliases) instead of needing its own build step just for dev.
async function loadApiHandler(server: ViteDevServer, routeName: string): Promise<ApiHandler> {
  const module = await server.ssrLoadModule(`/api/${routeName}.ts`)
  return module.default as ApiHandler
}

async function sendProxyResponse(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  res.end(await response.text())
}

async function handleApiRequest(
  server: ViteDevServer,
  req: IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
): Promise<void> {
  const routeName = resolveRouteName(req.url)
  if (!routeName) {
    next()
    return
  }

  try {
    const handler = await loadApiHandler(server, routeName)
    const request = await buildProxyRequest(routeName, req)
    const response = await handler(request)
    await sendProxyResponse(res, response)
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * Serves every api/*.ts file under `npm run dev` (dev-only, not part of the
 * production build). Vercel deploys each file directly as an Edge Function;
 * this loads the exact same file through Vite's SSR module graph and
 * adapts Node's req/res to the Web Request/Response it already speaks, so
 * there's no second copy of any handler's logic to keep in sync.
 */
export function localApiPlugin(): Plugin {
  return {
    name: 'local-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        void handleApiRequest(server, req, res, next)
      })
    },
  }
}
