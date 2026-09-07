import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('joins multiple truthy class names with a single space', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c')
  })

  it('filters out false, null, and undefined', () => {
    expect(cx('a', false, 'b', null, undefined, 'c')).toBe('a b c')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cx(false, null, undefined)).toBe('')
  })

  it('supports a single class name', () => {
    expect(cx('only')).toBe('only')
  })
})
