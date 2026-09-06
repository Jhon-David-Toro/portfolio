/** Visual treatment for one printed terminal entry. */
export type EntryKind = 'default' | 'error' | 'success'

/** One command-and-response pair (or a bare output block) in the session log. */
export type Entry = {
  readonly id: number
  readonly command: string | null
  readonly output: readonly string[]
  readonly kind: EntryKind
}
