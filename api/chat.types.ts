import type en from '../src/content/locales/en.json'

export type Locale = 'es' | 'en'
export type ChatMessage = { readonly role: 'user' | 'assistant'; readonly content: string }
export type ChatRequestBody = {
  readonly question?: unknown
  readonly language?: unknown
  readonly history?: unknown
}

export type LocaleContent = typeof en

export type ParsedRequest =
  | { readonly ok: true; readonly body: ChatRequestBody; readonly question: string }
  | { readonly ok: false; readonly errorMessage: string }
