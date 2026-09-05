import { useTranslation } from 'react-i18next'
import { Badge } from '../../design-system/Badge/Badge'
import { Section } from '../../design-system/Section/Section'
import styles from './AboutSection.module.scss'

/** Renders the profile and introduction section of the home page. */
export function AboutSection() {
  const { t } = useTranslation()
  // Safe: `about.focusAreas` is always authored as a string array in
  // content/locales/{en,es}.json — we own the shape.
  const focusAreas = t('about.focusAreas', { returnObjects: true }) as string[]

  return (
    <Section id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">{t('about.heading')}</h2>
      <div className={styles.grid}>
        <p className={styles.lead}>{t('about.lead')}</p>
        <div className={styles.details}>
          <p className={styles.body}>{t('about.body')}</p>
          <ul className={styles.focusList}>
            {focusAreas.map((area) => (
              <li key={area}>
                <Badge>{area}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
