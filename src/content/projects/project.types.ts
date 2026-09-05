// Minimal shape needed to route to and render a case study page. Expect this
// to grow (tags, cover image, links, etc.) once real project content and its
// presentation are defined in a later phase.
export type Project = {
  readonly slug: string
  readonly title: string
  readonly summary: string
}
