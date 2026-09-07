/* @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from './chat'

function chatRequest(body: unknown, method = 'POST'): Request {
  const hasBody = method !== 'GET' && method !== 'HEAD'
  return new Request('https://example.com/api/chat', {
    method,
    body: hasBody ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  })
}

function geminiSuccess(text: string): Response {
  return new Response(
    JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }),
    { status: 200 },
  )
}

describe('api/chat handler', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('rejects non-POST methods', async () => {
    const response = await handler(chatRequest({}, 'GET'))
    expect(response.status).toBe(405)
  })

  it('returns 503 when the assistant has no API key configured', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')

    const response = await handler(chatRequest({ question: 'Hi' }))

    expect(response.status).toBe(503)
  })

  it('returns 400 for a body that is not valid JSON', async () => {
    const response = await handler(chatRequest('not json'))
    expect(response.status).toBe(400)
  })

  it('returns 400 for an empty question', async () => {
    const response = await handler(chatRequest({ question: '  ' }))
    expect(response.status).toBe(400)
  })

  it('returns 400 for a question over the length limit', async () => {
    const response = await handler(chatRequest({ question: 'a'.repeat(501) }))
    expect(response.status).toBe(400)
  })

  it('returns the answer on a successful Gemini response', async () => {
    vi.mocked(fetch).mockResolvedValue(geminiSuccess('Hello from Gemini'))

    const response = await handler(chatRequest({ question: 'What do you do?', language: 'en' }))
    const body = (await response.json()) as { answer: string }

    expect(response.status).toBe(200)
    expect(body.answer).toBe('Hello from Gemini')
  })

  it('returns 502 when Gemini responds with a non-ok status', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }))

    const response = await handler(chatRequest({ question: 'Hi' }))

    expect(response.status).toBe(502)
  })

  it('returns 502 when Gemini responds with no usable text', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ candidates: [] }), { status: 200 }))

    const response = await handler(chatRequest({ question: 'Hi' }))

    expect(response.status).toBe(502)
  })

  it('falls back to Spanish grounding content for an unrecognized language', async () => {
    vi.mocked(fetch).mockResolvedValue(geminiSuccess('Hola'))

    await handler(chatRequest({ question: 'Hola', language: 'fr' }))

    const [, init] = vi.mocked(fetch).mock.calls[0]
    const sentBody = JSON.parse(init?.body as string) as { systemInstruction: { parts: { text: string }[] } }
    expect(sentBody.systemInstruction.parts[0].text).toContain('Spanish')
  })
})
