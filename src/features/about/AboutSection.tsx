import { useTranslation } from 'react-i18next'
import { Section } from '../../design-system/Section/Section'
import styles from './AboutSection.module.scss'

export function AboutSection() {
  const { t } = useTranslation()

  return (
    <Section id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">{t('about.heading')}</h2>
      <p className={styles.body}>{t('about.body')}</p>
    </Section>
  )
}
