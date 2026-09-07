import { describe, expect, it } from 'vitest'
import { isPaletteShortcut } from './CommandPalette.helpers'

function makeEvent(init: Partial<KeyboardEvent>): KeyboardEvent {
  return { key: 'a', metaKey: false, ctrlKey: false, ...init } as KeyboardEvent
}

describe('isPaletteShortcut', () => {
  it('matches Cmd+K', () => {
    expect(isPaletteShortcut(makeEvent({ key: 'k', metaKey: true }))).toBe(true)
  })

  it('matches Ctrl+K', () => {
    expect(isPaletteShortcut(makeEvent({ key: 'k', ctrlKey: true }))).toBe(true)
  })

  it('is case-insensitive on the key', () => {
    expect(isPaletteShortcut(makeEvent({ key: 'K', ctrlKey: true }))).toBe(true)
  })

  it('rejects K without a modifier', () => {
    expect(isPaletteShortcut(makeEvent({ key: 'k' }))).toBe(false)
  })

  it('rejects a modifier with a different key', () => {
    expect(isPaletteShortcut(makeEvent({ key: 'p', metaKey: true }))).toBe(false)
  })
})
