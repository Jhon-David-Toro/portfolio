// Title, summary (card blurb) and description (modal body) are translated
// content — read via `projects.items.<slug>` in content/locales/{en,es}.json,
// so the same project renders in both locales. Tags are technology names —
// language-neutral, same as content/skills/skills.ts.
export type ProjectMeta = {
  readonly slug: string
  readonly tags: readonly string[]
  /** Gets the large editorial treatment in ProjectsSection. At most one. */
  readonly featured?: boolean
}
