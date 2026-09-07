import type { CSSProperties } from 'react'
import { cx } from '@/core/style/cx'
import type { Position } from '@/core/dom/useDraggable'
import styles from './Terminal.module.scss'

/** Whether the visitor is typing into a field elsewhere on the page. */
export function isTypingInField(target: EventTarget | null): boolean {
  const element = target as HTMLElement
  return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable
}

export function getPositionerClassName(maximized: boolean): string {
  return cx(styles.positioner, maximized && styles.positionerMaximized)
}

export function getTerminalClassName(maximized: boolean): string {
  return cx(styles.terminal, maximized && styles.terminalMaximized)
}

/** The dragged window position, or `undefined` to fall back to centered CSS. */
export function getPositionerStyle(maximized: boolean, position: Position | null): CSSProperties | undefined {
  if (maximized || !position) {
    return undefined
  }
  return { top: position.y, left: position.x, transform: 'none' }
}
