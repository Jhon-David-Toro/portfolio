const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab/Shift+Tab cycling within `container`'s focusable descendants
 * instead of escaping to the rest of the page — wraps from the last back to
 * the first (or vice versa with Shift+Tab). Call only for Tab keydowns.
 */
export function trapTabFocus(event: KeyboardEvent, container: HTMLElement): void {
  const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  if (focusable.length === 0) {
    return
  }

  const [from, to] = event.shiftKey
    ? [focusable[0], focusable[focusable.length - 1]]
    : [focusable[focusable.length - 1], focusable[0]]

  if (document.activeElement !== from) {
    return
  }

  event.preventDefault()
  to.focus()
}
