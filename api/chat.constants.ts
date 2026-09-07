// "-latest" alias rather than a dated model name — Google repoints it as
// their lineup moves on, so this shouldn't need updating the way a dated
// name would (gemini-2.5-flash was already retired for new keys by
// 2026-09-05). Deliberately the "lite" tier, not a "thinking" model:
// confirmed by direct testing that gemini-3.6-flash reasons internally
// before answering and draws that from the same output-token budget,
// which produced truncated (finishReason: MAX_TOKENS) answers for this
// short, grounded Q&A use case. gemini-flash-lite-latest answers directly,
// faster, and without that failure mode.
export const GEMINI_MODEL = 'gemini-flash-lite-latest'
export const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const MAX_QUESTION_LENGTH = 500
export const MAX_HISTORY_MESSAGES = 6
// A ceiling, not a target — the system prompt asks for 2-4 sentences.
export const MAX_OUTPUT_TOKENS = 1024
