import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import emailjs from '@emailjs/browser'
import { ContactForm } from './ContactForm'

vi.mock('@emailjs/browser', () => ({
  default: { sendForm: vi.fn() },
}))

function fillRequiredFields() {
  return {
    name: screen.getByLabelText(/^name$/i),
    email: screen.getByLabelText(/^email$/i),
    message: screen.getByLabelText(/^message$/i),
  }
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.mocked(emailjs.sendForm).mockReset()
  })

  it('renders the name, email, and message fields with accessible labels', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/^name$/i)).toBeRequired()
    expect(screen.getByLabelText(/^email$/i)).toBeRequired()
    expect(screen.getByLabelText(/^message$/i)).toBeRequired()
  })

  it('shows a success message and resets the form after a successful send', async () => {
    const user = userEvent.setup()
    vi.mocked(emailjs.sendForm).mockResolvedValue({ status: 200, text: 'OK' })
    render(<ContactForm />)

    const { name, email, message } = fillRequiredFields()
    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@example.com')
    await user.type(message, 'Let’s work together.')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText(/sent successfully/i)).toBeInTheDocument()
    expect(emailjs.sendForm).toHaveBeenCalledOnce()
    expect(name).toHaveValue('')
  })

  it('shows an error message when the send fails', async () => {
    const user = userEvent.setup()
    vi.mocked(emailjs.sendForm).mockRejectedValue(new Error('network error'))
    render(<ContactForm />)

    const { name, email, message } = fillRequiredFields()
    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@example.com')
    await user.type(message, 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText(/couldn.t send/i)).toBeInTheDocument()
    expect(name).toHaveValue('Ada Lovelace')
  })

  it('disables the submit button while the request is in flight', async () => {
    const user = userEvent.setup()
    let resolveSend: (value: { status: number; text: string }) => void = () => {}
    vi.mocked(emailjs.sendForm).mockReturnValue(
      new Promise((resolve) => {
        resolveSend = resolve
      }),
    )
    render(<ContactForm />)

    const { name, email, message } = fillRequiredFields()
    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@example.com')
    await user.type(message, 'Hello')
    const submitButton = screen.getByRole('button', { name: /send|sending/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()

    resolveSend({ status: 200, text: 'OK' })
    await screen.findByText(/sent successfully/i)
  })
})
