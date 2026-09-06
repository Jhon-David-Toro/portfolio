import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../../../content/profile/profile'
import { ChatIcon } from '../../../design-system/icons/ChatIcon'
import styles from './AiAssistant.module.scss'

type ChatMessage = { readonly role: 'user' | 'assistant'; readonly content: string }

type Status = { readonly kind: 'idle' } | { readonly kind: 'sending' } | { readonly kind: 'error' }

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Renders the AI assistant trigger and its chat panel — answers visitor
 * questions grounded strictly in the real portfolio content, via a
 * server-side proxy at /api/chat (see api/chat.ts).
 */
export function AiAssistant() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<readonly ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Safe: `assistant.starterQuestions` is always authored as a string array
  // in content/locales/{en,es}.json — we own the shape.
  const starterQuestions = t('assistant.starterQuestions', { returnObjects: true }) as string[]

  function close() {
    setOpen(false)
  }

  function openPanel() {
    setOpen(true)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus())

    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        close()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return
      }

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  async function sendMessage(question: string) {
    const trimmed = question.trim()
    if (!trimmed || status.kind === 'sending') {
      return
    }

    const priorHistory = messages
    setMessages((current) => [...current, { role: 'user', content: trimmed }])
    setInput('')
    setStatus({ kind: 'sending' })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          language: i18n.language,
          history: priorHistory.slice(-6),
        }),
      })

      if (!response.ok) {
        throw new Error('request failed')
      }

      const data = (await response.json()) as { answer?: string }
      const answer = data.answer
      if (!answer) {
        throw new Error('empty answer')
      }

      setMessages((current) => [...current, { role: 'assistant', content: answer }])
      setStatus({ kind: 'idle' })
    } catch {
      setStatus({ kind: 'error' })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage(input)
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('assistant.openLabel')}
        onClick={() => {
          if (open) {
            close()
          } else {
            openPanel()
          }
        }}
      >
        <ChatIcon />
      </button>

      {open && (
        <div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-label={t('assistant.heading')}
          tabIndex={-1}
        >
          <p className={styles.panelHeading}>{t('assistant.heading')}</p>

          <div className={styles.messages} aria-live="polite">
            {messages.length === 0 && (
              <div className={styles.starters}>
                <p className={styles.greeting}>{t('assistant.greeting')}</p>
                {starterQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className={styles.starterChip}
                    onClick={() => {
                      void sendMessage(question)
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <p
                key={index}
                className={message.role === 'user' ? styles.userBubble : styles.assistantBubble}
              >
                {message.content}
              </p>
            ))}

            {status.kind === 'sending' && (
              <p className={styles.assistantBubble}>{t('assistant.thinking')}</p>
            )}

            {status.kind === 'error' && (
              <div className={styles.errorBubble}>
                <p>{t('assistant.errorFallback')}</p>
                <a href={`mailto:${profile.email}`}>{t('assistant.errorCta')}</a>
              </div>
            )}
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder={t('assistant.placeholder')}
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
              }}
              disabled={status.kind === 'sending'}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={status.kind === 'sending' || input.trim().length === 0}
            >
              {t('assistant.send')}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
