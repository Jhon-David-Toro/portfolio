/** Whether a project is a user-facing application or a backend API. */
export type ProjectCategory = 'app' | 'api'

/** Metadata required to render a localized project case study. */
export type ProjectMeta = {
  readonly slug: string
  readonly category: ProjectCategory
  readonly tags: readonly string[]
  readonly repositoryUrl: string
  readonly liveUrl?: string
  /** Where to download the installer (a GitHub release), for apps with no live site. */
  readonly downloadUrl?: string
  /** Screenshot under `public/projects/`, shown on the card and in the case study. Apps only. */
  readonly image?: string
  /** Real routes the API exposes, shown as a code-style list. APIs only. */
  readonly endpoints?: readonly string[]
}
