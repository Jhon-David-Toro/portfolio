import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { fadeUpVariants, staggerContainerVariants } from '../../core/motion/variants'
import { profile } from '../../content/profile/profile'
import { Section } from '../../design-system/Section/Section'
import styles from './HeroSection.module.scss'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <Section aria-label={t('hero.eyebrow')}>
      <motion.div variants={staggerContainerVariants}>
        <motion.p variants={fadeUpVariants} className={styles.eyebrow}>
          {t('hero.eyebrow')}
        </motion.p>
        <motion.h1 variants={fadeUpVariants} className={styles.name}>
          {profile.name}
        </motion.h1>
        <motion.p variants={fadeUpVariants} className={styles.tagline}>
          {t('hero.tagline')}
        </motion.p>
      </motion.div>
    </Section>
  )
}
