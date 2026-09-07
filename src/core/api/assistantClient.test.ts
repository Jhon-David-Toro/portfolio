import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { askAssistant } from './assistantClient'

describe('askAssistant', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts the question, language, and history, and returns the answer', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ answer: 'Hi there' }), { status: 200 }))

    const answer = await askAssistant('What do you do?', 'en', [{ role: 'user', content: 'Hello' }])

    expect(answer).toBe('Hi there')
    expect(fetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question: 'What do you do?',
          language: 'en',
          history: [{ role: 'user', content: 'Hello' }],
        }),
      }),
    )
  })

  it('throws when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }))

    await expect(askAssistant('q', 'en', [])).rejects.toThrow('request failed')
  })

  it('throws when the response has no answer', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))

    await expect(askAssistant('q', 'en', [])).rejects.toThrow('empty answer')
  })
})
