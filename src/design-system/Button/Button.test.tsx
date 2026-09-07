import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { Button } from './Button'

describe('Button', () => {
  it('renders a native button by default and responds to clicks', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Send</Button>)

    const button = screen.getByRole('button', { name: 'Send' })
    await user.click(button)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Send
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as a plain link when given an href', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="noopener noreferrer">
        Visit
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Visit' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link.tagName).toBe('A')
  })

  it('renders as a router Link when given a "to" prop, for in-app navigation', () => {
    render(
      <MemoryRouter>
        <Button to="/#projects">View work</Button>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'View work' })
    expect(link).toHaveAttribute('href', '/#projects')
  })
})
