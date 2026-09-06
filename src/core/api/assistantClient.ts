/** One turn of prior conversation sent as context to the assistant. */
export type AssistantMessage = {
  readonly role: 'user' | 'assistant'
  readonly content: string
}

/**
 * Asks the AI assistant a question via the server-side proxy at /api/chat
 * (see api/chat.ts) — shared by the chat widget and the terminal's `ask`
 * command, which previously each hand-rolled the same fetch/parse logic.
 *
 * @param question - The visitor's question.
 * @param language - Interface language, so the answer comes back in kind.
 * @param history - Prior turns to give the assistant conversational context.
 * @returns The assistant's answer text.
 * @throws If the request fails or the response has no answer.
 */
export async function askAssistant(
  question: string,
  language: string,
  history: readonly AssistantMessage[],
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question, language, history }),
  })

  if (!response.ok) {
    throw new Error('request failed')
  }

  const data = (await response.json()) as { answer?: string }
  if (!data.answer) {
    throw new Error('empty answer')
  }

  return data.answer
}
