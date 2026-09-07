/** Props for the floating trigger ball (rotate animation, resume badge). */
export type LauncherTriggerProps = {
  readonly open: boolean
  readonly terminalMinimized: boolean
  readonly label: string
  readonly onClick: () => void
}
