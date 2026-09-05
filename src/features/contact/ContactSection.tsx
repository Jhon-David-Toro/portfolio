import { useTranslation } from 'react-i18next'
import { profile } from '../../content/profile/profile'
import { Section } from '../../design-system/Section/Section'
import { ContactForm } from './ContactForm'
import styles from './ContactSection.module.scss'

/** Renders the contact section, including the contact form. */
export function ContactSection() {
  const { t } = useTranslation()

  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{t('contact.heading')}</h2>
      <p className={styles.intro}>{t('contact.intro')}</p>
      <ul className={styles.links}>
        <li>
          <a className={styles.primaryLink} href={`mailto:${profile.email}`}>
            {t('contact.emailCta')}
          </a>
        </li>
        <li>
          <a
            className={styles.secondaryLink}
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('contact.githubCta')}
          </a>
        </li>
      </ul>
      <ContactForm />
    </Section>
  )
}
