/** Whether `event` is the Ctrl/Cmd+K shortcut that opens or closes the palette. */
export function isPaletteShortcut(event: KeyboardEvent): boolean {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
}
