import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { CommandPalette } from './CommandPalette'

function renderPalette() {
  return render(
    <MemoryRouter>
      <CommandPalette />
    </MemoryRouter>,
  )
}

describe('CommandPalette', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('opens from the trigger button and closes on Escape', async () => {
    const user = userEvent.setup()
    renderPalette()

    await user.click(screen.getByRole('button', { name: /open command palette/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens and closes with the Ctrl+K shortcut from anywhere', () => {
    renderPalette()

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('filters the command list as the visitor types', async () => {
    const user = userEvent.setup()
    renderPalette()
    await user.click(screen.getByRole('button', { name: /open command palette/i }))

    await user.type(screen.getByRole('combobox'), 'dark mode')

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent(/dark mode/i)
  })

  it('shows a "no results" message when nothing matches', async () => {
    const user = userEvent.setup()
    renderPalette()
    await user.click(screen.getByRole('button', { name: /open command palette/i }))

    await user.type(screen.getByRole('combobox'), 'xyz-does-not-exist')

    expect(screen.getByText(/no results/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('runs the highlighted command on Enter and closes the palette', async () => {
    const user = userEvent.setup()
    renderPalette()
    await user.click(screen.getByRole('button', { name: /open command palette/i }))

    await user.type(screen.getByRole('combobox'), 'dark mode')
    await user.keyboard('{Enter}')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('runs a command on click and closes the palette', async () => {
    const user = userEvent.setup()
    renderPalette()
    await user.click(screen.getByRole('button', { name: /open command palette/i }))

    await user.type(screen.getByRole('combobox'), 'dark mode')
    await user.click(screen.getByRole('option'))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
