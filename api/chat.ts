import { profile } from '../src/content/profile/profile'
import { experience } from '../src/content/experience/experience'
import { education, courses } from '../src/content/education/education'
import { skillGroups } from '../src/content/skills/skills'
import { getProjects } from '../src/content/projects/projects'
import en from '../src/content/locales/en.json'
import es from '../src/content/locales/es.json'

// Vercel Edge Function — runs server-side only, so this is the one place in
// the whole app allowed to hold the API key. Uses Web-standard
// Request/Response/fetch (already in lib.dom.d.ts) rather than a Vercel or
// Google SDK, so it adds zero new dependencies to the project.
export const config = { runtime: 'edge' }

// "-latest" alias rather than a dated model name — Google repoints it as
// their lineup moves on, so this shouldn't need updating the way a dated
// name would (gemini-2.5-flash was already retired for new keys by
// 2026-09-05). Deliberately the "lite" tier, not a "thinking" model:
// confirmed by direct testing that gemini-3.6-flash reasons internally
// before answering and draws that from the same output-token budget,
// which produced truncated (finishReason: MAX_TOKENS) answers for this
// short, grounded Q&A use case. gemini-flash-lite-latest answers directly,
// faster, and without that failure mode.
const GEMINI_MODEL = 'gemini-flash-lite-latest'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const MAX_QUESTION_LENGTH = 500
const MAX_HISTORY_MESSAGES = 6
// A ceiling, not a target — the system prompt asks for 2-4 sentences.
const MAX_OUTPUT_TOKENS = 1024

type Locale = 'es' | 'en'
type ChatMessage = { readonly role: 'user' | 'assistant'; readonly content: string }
type ChatRequestBody = {
  readonly question?: unknown
  readonly language?: unknown
  readonly history?: unknown
}

type LocaleContent = typeof en

function isLocale(value: unknown): value is Locale {
  return value === 'es' || value === 'en'
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string'
  )
}

/** Assembles the grounding context from the same content the site itself renders. */
function buildContext(locale: LocaleContent): string {
  const skillList = skillGroups.flatMap((group) => group.items).join(', ')

  const experienceLines = experience
    .map((item) => {
      const entry = locale.experience.items[item.id as keyof typeof locale.experience.items]
      const role = entry?.role ?? item.id
      const highlights = entry?.highlights?.join(' ') ?? ''
      const end = item.endDate ?? locale.experience.present
      return `- ${role} at ${item.company} (${item.startDate} to ${end}, ${item.workMode}). ${highlights}`
    })
    .join('\n')

  const educationLines = education
    .map((item) => {
      const entry = locale.education.items[item.id as keyof typeof locale.education.items]
      return `- ${entry?.program ?? item.id} — ${item.institution} (${item.startYear}-${item.endYear})`
    })
    .join('\n')

  const courseList = courses.map((course) => course.title).join(', ')

  const projectLines = getProjects()
    .map((project) => {
      const entry = locale.projects.items[project.slug as keyof typeof locale.projects.items]
      return `- ${entry?.title ?? project.slug}: ${entry?.summary ?? ''} (${project.tags.join(', ')})`
    })
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

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: 'Assistant is not configured yet.' }, 503)
  }

  let body: ChatRequestBody
  try {
    body = (await request.json()) as ChatRequestBody
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (question.length === 0 || question.length > MAX_QUESTION_LENGTH) {
    return jsonResponse({ error: 'Question must be 1-500 characters.' }, 400)
  }

  const language: Locale = isLocale(body.language) ? body.language : 'es'
  const locale = language === 'en' ? en : es

  const history = Array.isArray(body.history)
    ? body.history.filter(isChatMessage).slice(-MAX_HISTORY_MESSAGES)
    : []

  const contents = [
    ...history.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      // Bounds worst-case payload size regardless of what a client sends —
      // this only needs to be enough for conversational context.
      parts: [{ text: message.content.slice(0, MAX_QUESTION_LENGTH) }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ]

  try {
    const geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(locale, language) }] },
        contents,
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.4 },
      }),
    })

    if (!geminiResponse.ok) {
      return jsonResponse({ error: 'The assistant is temporarily unavailable.' }, 502)
    }

    const data = (await geminiResponse.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!answer) {
      return jsonResponse({ error: 'The assistant is temporarily unavailable.' }, 502)
    }

    return jsonResponse({ answer }, 200)
  } catch {
    return jsonResponse({ error: 'The assistant is temporarily unavailable.' }, 502)
  }
}
