import { profile } from '../src/content/profile/profile'
import { experience } from '../src/content/experience/experience'
import { education, courses } from '../src/content/education/education'
import { skillGroups } from '../src/content/skills/skills'
import { getProjects } from '../src/content/projects/projects'
import en from '../src/content/locales/en.json'
import es from '../src/content/locales/es.json'
import type { ChatMessage, ChatRequestBody, Locale, LocaleContent, ParsedRequest } from './chat.types'
import { GEMINI_URL, MAX_HISTORY_MESSAGES, MAX_OUTPUT_TOKENS, MAX_QUESTION_LENGTH } from './chat.constants'

// Vercel Edge Function — runs server-side only, so this is the one place in
// the whole app allowed to hold the API key. Uses Web-standard
// Request/Response/fetch (already in lib.dom.d.ts) rather than a Vercel or
// Google SDK, so it adds zero new dependencies to the project.
export const config = { runtime: 'edge' }

function isLocale(value: unknown): value is Locale {
  return value === 'es' || value === 'en'
}

function isValidChatRole(role: unknown): role is ChatMessage['role'] {
  return role === 'user' || role === 'assistant'
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return isValidChatRole(candidate.role) && typeof candidate.content === 'string'
}

/** Reads `entry[key]`, or `fallback` when the localized entry is missing. */
function resolveField<T, K extends keyof T>(entry: T | undefined, key: K, fallback: T[K]): T[K] {
  if (!entry) {
    return fallback
  }
  return entry[key]
}

function resolveHighlights(entry: { readonly highlights?: readonly string[] } | undefined): string {
  if (!entry?.highlights) {
    return ''
  }
  return entry.highlights.join(' ')
}

function formatExperienceEntry(item: (typeof experience)[number], locale: LocaleContent): string {
  const entry = locale.experience.items[item.id as keyof typeof locale.experience.items]
  const role = resolveField(entry, 'role', item.id)
  const highlights = resolveHighlights(entry)
  const end = item.endDate ?? locale.experience.present
  return `- ${role} at ${item.company} (${item.startDate} to ${end}, ${item.workMode}). ${highlights}`
}

function formatEducationEntry(item: (typeof education)[number], locale: LocaleContent): string {
  const entry = locale.education.items[item.id as keyof typeof locale.education.items]
  return `- ${entry?.program ?? item.id} — ${item.institution} (${item.startYear}-${item.endYear})`
}

function formatProjectEntry(project: ReturnType<typeof getProjects>[number], locale: LocaleContent): string {
  const entry = locale.projects.items[project.slug as keyof typeof locale.projects.items]
  const title = resolveField(entry, 'title', project.slug)
  const summary = resolveField(entry, 'summary', '')
  return `- ${title}: ${summary} (${project.tags.join(', ')})`
}

/** Assembles the grounding context from the same content the site itself renders. */
function buildContext(locale: LocaleContent): string {
  const skillList = skillGroups.flatMap((group) => group.items).join(', ')
  const experienceLines = experience.map((item) => formatExperienceEntry(item, locale)).join('\n')
  const educationLines = education.map((item) => formatEducationEntry(item, locale)).join('\n')
  const courseList = courses.map((course) => course.title).join(', ')
  const projectLines = getProjects()
    .map((project) => formatProjectEntry(project, locale))
    .join('\n')

  return `Name: ${profile.name}
Location: ${profile.location}
Email: ${profile.email}
GitHub: ${profile.github}

Summary: ${locale.about.lead} ${locale.about.body}

Skills: ${skillList}

Experience (most recent first):
${experienceLines}

Education:
${educationLines}
Courses/certifications: ${courseList}

Projects:
${projectLines}`
}

function buildSystemPrompt(locale: LocaleContent, language: Locale): string {
  const languageName = language === 'es' ? 'Spanish' : 'English'
  return `You are a helpful assistant embedded in ${profile.name}'s developer portfolio, answering visitors' (often recruiters') questions about him.

Rules:
- Only answer using the profile information below. Never invent experience, skills, employers, or claims that aren't listed.
- If asked something the information below doesn't cover, say you don't have that information and suggest emailing ${profile.name} directly at ${profile.email}.
- Keep answers concise: 2-4 sentences, friendly and professional in tone.
- Always respond in ${languageName}, regardless of what language the question is asked in.

--- PROFILE INFORMATION ---
${buildContext(locale)}`
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function checkMethod(request: Request): Response | null {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }
  return null
}

function normalizeQuestion(body: ChatRequestBody): string {
  return typeof body.question === 'string' ? body.question.trim() : ''
}

/** Parses the JSON body and validates the question, keeping their distinct error messages. */
async function parseAndValidateRequest(request: Request): Promise<ParsedRequest> {
  let body: ChatRequestBody
  try {
    body = (await request.json()) as ChatRequestBody
  } catch {
    return { ok: false, errorMessage: 'Invalid request body.' }
  }

  const question = normalizeQuestion(body)
  if (question.length === 0 || question.length > MAX_QUESTION_LENGTH) {
    return { ok: false, errorMessage: 'Question must be 1-500 characters.' }
  }

  return { ok: true, body, question }
}

function resolveLocale(body: ChatRequestBody): { readonly language: Locale; readonly locale: LocaleContent } {
  const language: Locale = isLocale(body.language) ? body.language : 'es'
  return { language, locale: language === 'en' ? en : es }
}

function buildGeminiContents(body: ChatRequestBody, question: string) {
  const history = Array.isArray(body.history)
    ? body.history.filter(isChatMessage).slice(-MAX_HISTORY_MESSAGES)
    : []

  return [
    ...history.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      // Bounds worst-case payload size regardless of what a client sends —
      // this only needs to be enough for conversational context.
      parts: [{ text: message.content.slice(0, MAX_QUESTION_LENGTH) }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ]
}

function extractTrimmedText(parts: { text?: string }[] | undefined): string | null {
  if (!parts || parts.length === 0) {
    return null
  }
  const text = parts[0].text
  return text ? text.trim() : null
}

function extractAnswer(data: { candidates?: { content?: { parts?: { text?: string }[] } }[] }): string | null {
  const candidate = data.candidates?.[0]
  return extractTrimmedText(candidate?.content?.parts)
}

function unavailableResponse(): Response {
  return jsonResponse({ error: 'The assistant is temporarily unavailable.' }, 502)
}

/** Calls Gemini and returns the fully-formed response — success or a graceful failure. */
async function callGemini(
  apiKey: string,
  systemPrompt: string,
  contents: ReturnType<typeof buildGeminiContents>,
): Promise<Response> {
  try {
    const geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.4 },
      }),
    })

    if (!geminiResponse.ok) {
      return unavailableResponse()
    }

    const data = (await geminiResponse.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }
    const answer = extractAnswer(data)

    if (!answer) {
      return unavailableResponse()
    }

    return jsonResponse({ answer }, 200)
  } catch {
    return unavailableResponse()
  }
}

export default async function handler(request: Request): Promise<Response> {
  const methodError = checkMethod(request)
  if (methodError) {
    return methodError
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: 'Assistant is not configured yet.' }, 503)
  }

  const parsed = await parseAndValidateRequest(request)
  if (!parsed.ok) {
    return jsonResponse({ error: parsed.errorMessage }, 400)
  }

  const { language, locale } = resolveLocale(parsed.body)
  const contents = buildGeminiContents(parsed.body, parsed.question)
  const systemPrompt = buildSystemPrompt(locale, language)

  return callGemini(apiKey, systemPrompt, contents)
}
