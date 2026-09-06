// Lets CommandPalette open the Terminal without a direct import between the
// two — both independent app-shell singletons mounted in App.tsx.
export const OPEN_TERMINAL_EVENT = 'portfolio:open-terminal'

/** Requests that the Terminal widget open itself. */
export function dispatchOpenTerminal() {
  window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT))
}

// Broadcasts whether a terminal session is minimized (open but hidden, like
// a real window sent to the Dock) — the Launcher listens for this to show a
// "1" badge and swap its menu label to "Continue terminal".
export const TERMINAL_BACKGROUND_EVENT = 'portfolio:terminal-background'

/** Reports whether a minimized-but-alive terminal session exists. */
export function dispatchTerminalBackground(hasBackgroundSession: boolean) {
  window.dispatchEvent(new CustomEvent<boolean>(TERMINAL_BACKGROUND_EVENT, { detail: hasBackgroundSession }))
}
