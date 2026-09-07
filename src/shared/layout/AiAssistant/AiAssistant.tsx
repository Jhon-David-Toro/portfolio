import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { askAssistant, type AssistantMessage } from '@/core/api/assistantClient'
import { useDismissablePanel } from '@/core/dom/useDismissablePanel'
import { profile } from '@/content/profile/profile'
import type { AssistantMessagesProps, Status } from './AiAssistant.types'
import styles from './AiAssistant.module.scss'
import { OPEN_ASSISTANT_EVENT } from './aiAssistantEvents'

/** Renders the conversation log: empty-state starters, bubbles, thinking/error states. */
function AssistantMessages({ messages, status, starterQuestions, onStarterClick }: AssistantMessagesProps) {
  const { t } = useTranslation()

  return (
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
                onStarterClick(question)
              }}
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {messages.map((message, index) => (
        <p key={index} className={message.role === 'user' ? styles.userBubble : styles.assistantBubble}>
          {message.content}
        </p>
      ))}

      {status.kind === 'sending' && <p className={styles.assistantBubble}>{t('assistant.thinking')}</p>}

      {status.kind === 'error' && (
        <div className={styles.errorBubble}>
          <p>{t('assistant.errorFallback')}</p>
          <a href={`mailto:${profile.email}`}>{t('assistant.errorCta')}</a>
        </div>
      )}
    </div>
  )
}

/**
 * Renders the AI assistant's chat panel — answers visitor questions
 * grounded strictly in the real portfolio content, via a server-side proxy
 * at /api/chat (see api/chat.ts). Opened via the Launcher's menu, which
 * dispatches OPEN_ASSISTANT_EVENT — see aiAssistantEvents.ts.
 */
export function AiAssistant() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<readonly AssistantMessage[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)
  const headingId = useId()

  // Safe: `assistant.starterQuestions` is always authored as a string array
  // in content/locales/{en,es}.json — we own the shape.
  const starterQuestions = t('assistant.starterQuestions', { returnObjects: true }) as string[]

  const close = useCallback(() => setOpen(false), [])
  const { wrapperRef, panelRef } = useDismissablePanel(open, close)

  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true)
    }
    window.addEventListener(OPEN_ASSISTANT_EVENT, handleOpenEvent)
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, handleOpenEvent)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
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
      const answer = await askAssistant(trimmed, i18n.language, priorHistory.slice(-6))
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

  if (!open) {
    return null
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={panelRef} className={styles.panel} role="dialog" aria-labelledby={headingId} tabIndex={-1}>
        <header className={styles.panelHeader}>
          <h2 id={headingId} className={styles.panelHeading}>{t('assistant.heading')}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={close}
            aria-label={t('common.close')}
          >
            ×
          </button>
        </header>

        <AssistantMessages
            messages={messages}
            status={status}
            starterQuestions={starterQuestions}
            onStarterClick={(question) => {
              void sendMessage(question)
            }}
          />

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder={t('assistant.placeholder')}
              aria-label={t('assistant.placeholder')}
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
    </div>
  )
}
