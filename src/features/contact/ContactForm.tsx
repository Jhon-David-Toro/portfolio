import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { useTranslation } from 'react-i18next'
import { Button } from '../../design-system/Button/Button'
import styles from './ContactForm.module.scss'

type SubmitStatus =
  | { readonly kind: 'idle' }
  | { readonly kind: 'submitting' }
  | { readonly kind: 'success' }
  | { readonly kind: 'error' }

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
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
    <form
      className={styles.form}
      onSubmit={(event) => {
        void handleSubmit(event)
      }}
    >
      <div className={styles.field}>
        <label htmlFor="contact-name">{t('contact.form.nameLabel')}</label>
        <input id="contact-name" name="from_name" type="text" autoComplete="name" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">{t('contact.form.emailLabel')}</label>
        <input id="contact-email" name="reply_to" type="email" autoComplete="email" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">{t('contact.form.messageLabel')}</label>
        <textarea id="contact-message" name="message" rows={5} required />
      </div>

      <Button type="submit" disabled={status.kind === 'submitting'}>
        {status.kind === 'submitting' ? t('contact.form.sending') : t('contact.form.send')}
      </Button>

      <p role="status" aria-live="polite" className={styles.status}>
        {status.kind === 'success' && t('contact.form.success')}
        {status.kind === 'error' && t('contact.form.error')}
      </p>
    </form>
  )
}
