import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../../content/profile/profile'
import { Badge } from '../../design-system/Badge/Badge'
import { Section } from '../../design-system/Section/Section'
import { GithubIcon } from '../../design-system/icons/GithubIcon'
import { MailIcon } from '../../design-system/icons/MailIcon'
import { PinIcon } from '../../design-system/icons/PinIcon'
import { computeAboutStats } from './aboutStats'
import styles from './AboutSection.module.scss'

/** Renders the profile and introduction section of the home page. */
export function AboutSection() {
  const { t } = useTranslation()
  // Safe: `about.focusAreas` is always authored as a string array in
  // content/locales/{en,es}.json — we own the shape.
  const focusAreas = t('about.focusAreas', { returnObjects: true }) as string[]
  const stats = useMemo(() => computeAboutStats(), [])

  return (
    <Section id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">{t('about.heading')}</h2>
      <div className={styles.grid}>
        <div className={styles.primary}>
          <p className={styles.lead}>{t('about.lead')}</p>
          <p className={styles.body}>{t('about.body')}</p>
          <ul className={styles.focusList}>
            {focusAreas.map((area) => (
              <li key={area}>
                <Badge>{area}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.sidebar}>
          <ul className={styles.stats}>
            <li className={styles.stat}>
              <span className={styles.statValue}>{stats.yearsOfExperience}+</span>
              <span className={styles.statLabel}>{t('about.stats.experience')}</span>
            </li>
            <li className={styles.stat}>
              <span className={styles.statValue}>{stats.roleCount}</span>
              <span className={styles.statLabel}>{t('about.stats.roles')}</span>
            </li>
            <li className={styles.stat}>
              <span className={styles.statValue}>{stats.technologyCount}</span>
              <span className={styles.statLabel}>{t('about.stats.technologies')}</span>
            </li>
          </ul>

          <ul className={styles.factList}>
            <li>
              <PinIcon />
              <span>{profile.location}</span>
            </li>
            <li>
              <MailIcon />
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <GithubIcon />
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                {t('contact.githubCta')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
