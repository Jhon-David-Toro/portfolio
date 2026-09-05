// Only the language-neutral identity of a project lives here — title and
// summary are translated content, read via `projects.items.<slug>` in
// content/locales/{en,es}.json, so the same project renders in both locales.
export type ProjectMeta = {
  readonly slug: string
}
