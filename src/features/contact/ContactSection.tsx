import { useTranslation } from 'react-i18next'
import { profile } from '../../content/profile/profile'
import { Section } from '../../design-system/Section/Section'
import { GithubIcon } from '../../design-system/icons/GithubIcon'
import { MailIcon } from '../../design-system/icons/MailIcon'
import { PinIcon } from '../../design-system/icons/PinIcon'
import { ContactForm } from './ContactForm'
import styles from './ContactSection.module.scss'

/** Renders the contact section: direct links plus an inline message form. */
export function ContactSection() {
  const { t } = useTranslation()

  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{t('contact.heading')}</h2>

      <div className={styles.grid}>
        <div className={styles.info}>
          <p className={styles.intro}>{t('contact.intro')}</p>
          <ul className={styles.links}>
            <li>
              <a className={styles.primaryLink} href={`mailto:${profile.email}`}>
                <MailIcon />
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
                <GithubIcon />
                {t('contact.githubCta')}
              </a>
            </li>
          </ul>
          <p className={styles.location}>
            <PinIcon />
            {profile.location}
          </p>
        </div>

        <div className={styles.formColumn}>
          <span className={styles.formLabel}>{t('contact.formDivider')}</span>
          <ContactForm />
        </div>
      </div>
    </Section>
  )
}
