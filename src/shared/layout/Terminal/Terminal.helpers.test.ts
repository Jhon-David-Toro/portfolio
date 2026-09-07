import { describe, expect, it } from 'vitest'
import { getPositionerStyle, isTypingInField } from './Terminal.helpers'

describe('isTypingInField', () => {
  it('is true for an input element', () => {
    expect(isTypingInField(document.createElement('input'))).toBe(true)
  })

  it('is true for a textarea element', () => {
    expect(isTypingInField(document.createElement('textarea'))).toBe(true)
  })

  it('is true for a contenteditable element', () => {
    const div = document.createElement('div')
    div.contentEditable = 'true'
    expect(isTypingInField(div)).toBe(true)
  })

  it('is false for a plain element', () => {
    expect(isTypingInField(document.createElement('div'))).toBe(false)
  })

  it('is false for null', () => {
    expect(isTypingInField(null)).toBe(false)
  })
})

describe('getPositionerStyle', () => {
  it('returns undefined when maximized, regardless of position', () => {
    expect(getPositionerStyle(true, { x: 10, y: 20 })).toBeUndefined()
  })

  it('returns undefined when there is no tracked position yet', () => {
    expect(getPositionerStyle(false, null)).toBeUndefined()
  })

  it('returns an inline top/left style for a tracked, non-maximized position', () => {
    expect(getPositionerStyle(false, { x: 10, y: 20 })).toEqual({
      top: 20,
      left: 10,
      transform: 'none',
    })
  })
})
