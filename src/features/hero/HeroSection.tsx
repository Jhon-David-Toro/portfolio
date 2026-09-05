import { useTranslation } from 'react-i18next'
import { profile } from '../../content/profile/profile'
import { Section } from '../../design-system/Section/Section'
import styles from './HeroSection.module.scss'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <Section aria-label={t('hero.eyebrow')}>
      <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
      <h1 className={styles.name}>{profile.name}</h1>
      <p className={styles.tagline}>{t('hero.tagline')}</p>
    </Section>
  )
}
