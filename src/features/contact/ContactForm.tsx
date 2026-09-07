import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { AnimatePresence, m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { durations, easings } from '@/core/motion/tokens'
import { fadeUpVariants, staggerContainerVariants } from '@/core/motion/variants'
import { cx } from '@/core/style/cx'
import type { SubmitButtonProps, SubmitStatus } from './ContactForm.types'
import styles from './ContactForm.module.scss'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const IS_EMAILJS_CONFIGURED = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

const SHAKE_KEYFRAMES = { x: [0, -8, 8, -8, 8, 0] }
const SPIN_TRANSITION = { duration: 0.7, repeat: Infinity, ease: 'linear' } as const

/** A continuously rotating ring — the submit button's in-progress state. */
function Spinner() {
  return (
    <m.svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={SPIN_TRANSITION}
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </m.svg>
  )
}

/** Draws a checkmark stroke-by-stroke — the submit button's success state. */
function DrawnCheckmark() {
  return (
    <m.svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <m.path
        d="M4 12.5l5 5L20 6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: durations.slower, ease: easings.decelerate }}
      />
    </m.svg>
  )
}

function resolveSubmitContent(status: SubmitStatus, t: TFunction) {
  if (status.kind === 'success') {
    return { key: 'success', node: <DrawnCheckmark /> }
  }
  if (status.kind === 'submitting') {
    return { key: 'submitting', node: <Spinner /> }
  }
  return { key: 'idle', node: t('contact.form.send') }
}

/** Icon-only states (submitting, success) collapse the button to a circle. */
function isCompactStatus(status: SubmitStatus): boolean {
  return status.kind === 'submitting' || status.kind === 'success'
}

function resolveSubmitLabel(status: SubmitStatus, t: TFunction): string {
  if (status.kind === 'success') {
    return t('contact.form.success')
  }
  if (status.kind === 'submitting') {
    return t('contact.form.sending')
  }
  return t('contact.form.send')
}

/** Renders the submit button — morphs into a circle and draws a check on success, shakes on error. */
function SubmitButton({ status }: SubmitButtonProps) {
  const { t } = useTranslation()
  const content = resolveSubmitContent(status, t)

  return (
    <m.button
      type="submit"
      layout="size"
      className={cx(styles.submitButton, isCompactStatus(status) && styles.submitButtonCompact)}
      disabled={status.kind === 'submitting'}
      aria-label={resolveSubmitLabel(status, t)}
      animate={status.kind === 'error' ? SHAKE_KEYFRAMES : undefined}
      transition={status.kind === 'error' ? { duration: durations.slow } : undefined}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={content.key}
          className={styles.submitContent}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: durations.fast }}
        >
          {content.node}
        </m.span>
      </AnimatePresence>
    </m.button>
  )
}

/** Renders the inline contact form with EmailJS submission and status handling. */
export function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (!IS_EMAILJS_CONFIGURED) {
      setStatus({ kind: 'error' })
      return
    }

    setStatus({ kind: 'submitting' })

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, { publicKey: PUBLIC_KEY })
      setStatus({ kind: 'success' })
      form.reset()
    } catch {
      setStatus({ kind: 'error' })
    }
  }

  return (
    <m.form
      className={styles.form}
      variants={staggerContainerVariants}
      onSubmit={(event) => {
        void handleSubmit(event)
      }}
    >
      <m.div variants={fadeUpVariants} className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>
          {t('contact.form.nameLabel')}
        </label>
        <input
          id="contact-name"
          name="from_name"
          type="text"
          autoComplete="name"
          required
          className={styles.input}
        />
      </m.div>

      <m.div variants={fadeUpVariants} className={styles.field}>
        <label htmlFor="contact-email" className={styles.label}>
          {t('contact.form.emailLabel')}
        </label>
        <input
          id="contact-email"
          name="reply_to"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
        />
      </m.div>

      <m.div variants={fadeUpVariants} className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>
          {t('contact.form.messageLabel')}
        </label>
        <textarea id="contact-message" name="message" rows={4} required className={styles.textarea} />
      </m.div>

      <m.div variants={fadeUpVariants} className={styles.formFooter}>
        <SubmitButton status={status} />

        <p role="status" aria-live="polite" className={styles.status}>
          <AnimatePresence mode="wait">
            {status.kind === 'success' && (
              <m.span
                key="success"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: durations.base }}
              >
                {t('contact.form.success')}
              </m.span>
            )}
            {status.kind === 'error' && (
              <m.span
                key="error"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: durations.base }}
              >
                {t('contact.form.error')}
              </m.span>
            )}
          </AnimatePresence>
        </p>
      </m.div>
    </m.form>
  )
}
