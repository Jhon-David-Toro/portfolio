import { afterEach, beforeAll, vi } from 'vitest'

// This setup file runs for every test file, including api/*.test.ts, which
// opt into `@vitest-environment node` (they're server-side handlers with no
// DOM). Everything below is browser-only, so it's skipped there instead of
// crashing on a missing `window`/`document`.
if (typeof window !== 'undefined') {
  await setupBrowserEnvironment()
}

async function setupBrowserEnvironment() {
  const { cleanup } = await import('@testing-library/react')
  await import('@testing-library/jest-dom/vitest')

  // Real i18next instance (same one the app uses) rather than a mock —
  // components render actual English/Spanish copy, so tests assert on real
  // visible text instead of raw translation keys. Pinned to English so
  // assertions don't depend on the test runner's OS locale.
  const { default: i18n } = await import('@/app/i18n/i18n')

  afterEach(() => {
    cleanup()
  })

  beforeAll(() => {
    void i18n.changeLanguage('en')
  })

  // jsdom implements neither of these; several components/hooks call them
  // unconditionally (Motion's useReducedMotion, useTheme, IntersectionObserver-
  // driven scroll-spy). Without a stub, mounting them throws instead of just
  // behaving as "no preference" / "not intersecting yet".
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  }

  if (!window.IntersectionObserver) {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null
      readonly rootMargin = ''
      readonly scrollMargin = ''
      readonly thresholds: readonly number[] = []
      disconnect = vi.fn()
      observe = vi.fn()
      unobserve = vi.fn()
      takeRecords = vi.fn(() => [])
    }
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn()
  }

  if (!navigator.clipboard) {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
  }

  // jsdom doesn't compute isContentEditable from the contenteditable
  // attribute (it's simply absent, not `false`) — real browsers always
  // return a boolean here, so code like Terminal.helpers' isTypingInField
  // that relies on it needs this to behave the same way under test.
  if (!('isContentEditable' in HTMLElement.prototype)) {
    Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
      get(this: HTMLElement) {
        return this.contentEditable === 'true'
      },
    })
  }
}
