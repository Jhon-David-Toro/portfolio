/** Visual treatment for one printed terminal entry. */
export type EntryKind = 'default' | 'error' | 'success'

/** One command-and-response pair (or a bare output block) in the session log. */
export type Entry = {
  readonly id: number
  readonly command: string | null
  readonly output: readonly string[]
  readonly kind: EntryKind
}

/** Result of running one terminal command — `null` means it already fully handled itself. */
export type CommandResult = { readonly output: string[]; readonly kind: EntryKind } | null

export type TerminalProps = {
  /**
   * Opens the terminal as soon as it mounts — used when App lazy-mounts this
   * component in response to the same trigger (backtick key or
   * OPEN_TERMINAL_EVENT) that a not-yet-loaded Terminal couldn't have seen.
   * Required (not defaulted) since App.tsx is the only caller and always
   * passes it — see the note there on why.
   */
  readonly initialOpen: boolean
}
