/** Metadata required to render a localized project case study. */
export type ProjectMeta = {
  readonly slug: string
  readonly tags: readonly string[]
  /** Enables the large editorial treatment in the projects section. */
  readonly featured?: boolean
}
