import { useTranslation } from 'react-i18next'
import { profile } from '../../content/profile/profile'
import { Section } from '../../design-system/Section/Section'
import styles from './ContactSection.module.scss'

export function ContactSection() {
  const { t } = useTranslation()

  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{t('contact.heading')}</h2>
      <p className={styles.intro}>{t('contact.intro')}</p>
      <ul className={styles.links}>
        <li>
          <a className={styles.link} href={`mailto:${profile.email}`}>
            {t('contact.emailCta')}
          </a>
        </li>
        <li>
          <a
            className={styles.link}
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('contact.githubCta')}
          </a>
        </li>
      </ul>
    </Section>
  )
}
