import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders as an accessible switch reflecting the current theme', () => {
    render(<ThemeToggle />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('flips the theme, the document attribute, and persisted storage on click', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const toggle = screen.getByRole('switch')
    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
