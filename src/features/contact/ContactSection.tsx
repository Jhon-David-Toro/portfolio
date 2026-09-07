import { useTranslation } from 'react-i18next'
import { profile } from '@/content/profile/profile'
import { AmbientGlow } from '@/design-system/AmbientGlow/AmbientGlow'
import { Button } from '@/design-system/Button/Button'
import { Section } from '@/design-system/Section/Section'
import { GithubIcon } from '@/design-system/icons/GithubIcon'
import { MailIcon } from '@/design-system/icons/MailIcon'
import { PinIcon } from '@/design-system/icons/PinIcon'
import { ContactForm } from './ContactForm'
import styles from './ContactSection.module.scss'

/** Renders the contact section: direct links plus an inline message form. */
export function ContactSection() {
  const { t } = useTranslation()

  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <AmbientGlow position="bottom-right" />
      <h2 id="contact-heading">{t('contact.heading')}</h2>

      <div className={styles.grid}>
        <div className={styles.info}>
          <p className={styles.intro}>{t('contact.intro')}</p>
          <ul className={styles.links}>
            <li>
              <Button href={`mailto:${profile.email}`} className={styles.primaryLink}>
                <MailIcon />
                {t('contact.emailCta')}
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryLink}
              >
                <GithubIcon />
                {t('contact.githubCta')}
              </Button>
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
