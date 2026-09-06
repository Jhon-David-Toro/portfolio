/** A single runnable entry in the command palette. */
export type Command = {
  readonly id: string
  readonly label: string
  readonly action: () => void
  /** Keeps the palette open after running — for actions with no visible page effect. */
  readonly keepOpen?: boolean
}
