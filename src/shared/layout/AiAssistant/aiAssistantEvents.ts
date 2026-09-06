// Lets the Launcher open the AI assistant without a direct import between
// the two — both independent app-shell singletons mounted in App.tsx.
export const OPEN_ASSISTANT_EVENT = 'portfolio:open-assistant'

/** Requests that the AI assistant widget open itself. */
export function dispatchOpenAssistant() {
  window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT))
}
