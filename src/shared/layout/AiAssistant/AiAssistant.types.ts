import type { AssistantMessage } from '@/core/api/assistantClient.types'

/** Discriminated status of the assistant's current request. */
export type Status = { readonly kind: 'idle' } | { readonly kind: 'sending' } | { readonly kind: 'error' }

/** Props for the conversation-log sub-component (empty state, bubbles, thinking/error states). */
export type AssistantMessagesProps = {
  readonly messages: readonly AssistantMessage[]
  readonly status: Status
  readonly starterQuestions: readonly string[]
  readonly onStarterClick: (question: string) => void
}

export type AiAssistantProps = {
  /**
   * Opens the assistant as soon as it mounts — used when App lazy-mounts
   * this component in response to the same OPEN_ASSISTANT_EVENT that a
   * not-yet-loaded AiAssistant couldn't have seen. Required (not defaulted)
   * since App.tsx is the only caller and always passes it.
   */
  readonly initialOpen: boolean
}
