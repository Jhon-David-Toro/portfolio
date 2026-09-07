/** One turn of prior conversation sent as context to the assistant. */
export type AssistantMessage = {
  readonly role: 'user' | 'assistant'
  readonly content: string
}
