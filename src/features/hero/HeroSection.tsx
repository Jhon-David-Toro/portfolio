import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { fadeUpVariants, staggerContainerVariants } from '@/core/motion/variants'
import { profile } from '@/content/profile/profile'
import { AmbientGlow } from '@/design-system/AmbientGlow/AmbientGlow'
import { Badge } from '@/design-system/Badge/Badge'
import { Button } from '@/design-system/Button/Button'
import { Section } from '@/design-system/Section/Section'
import { ChevronDownIcon } from '@/design-system/icons/ChevronDownIcon'
import { PinIcon } from '@/design-system/icons/PinIcon'
import styles from './HeroSection.module.scss'

// Curated for a quick-glance stack in the Hero — same real technologies from
// content/skills/skills.ts, just a smaller, higher-signal subset than the
// full Skills section list.
const FEATURED_STACK = ['React', 'Angular', 'LitElement', 'NextJS', 'UnitTest', 'SpringBoot', 'PostgreSQL'] as const

/** Renders the introductory hero content for the home page. */
export function HeroSection() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Subtle "recede" as the Hero scrolls out of view — signals a scene change
  // into the rest of the page. useTransform binds a raw MotionValue via
  // `style`, which bypasses MotionConfig's automatic reduced-motion handling
  // (that only governs animate/variants/whileInView), so it's disabled by
  // hand below rather than assumed safe.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4])
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 40])

  return (
    <Section id="hero" aria-label={t('hero.eyebrow')} className={styles.heroSection}>
      <AmbientGlow position="center" />
      <span className={styles.backdrop} aria-hidden="true" />
      <m.div
        ref={containerRef}
        variants={staggerContainerVariants}
        style={prefersReducedMotion ? undefined : { opacity: scrollOpacity, y: scrollY }}
      >
        <m.div variants={fadeUpVariants} className={styles.eyebrowRow}>
          <span className={styles.eyebrowLine} aria-hidden="true" />
          <p className={styles.eyebrow}>
            <span aria-hidden="true">$ </span>
            {t('hero.eyebrow')}
            <span className={styles.cursor} aria-hidden="true" />
          </p>
        </m.div>

        <m.h1 variants={fadeUpVariants} className={styles.name}>
          {profile.name}
        </m.h1>

        <m.p variants={fadeUpVariants} className={styles.tagline}>
          {t('hero.tagline')}
        </m.p>

        <m.div variants={fadeUpVariants} className={styles.meta}>
          <span className={styles.location}>
            <PinIcon />
            {profile.location}
          </span>
          <ul className={styles.stack}>
            {FEATURED_STACK.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        </m.div>

        <m.div variants={fadeUpVariants} className={styles.actions}>
          <Button to="/#projects" className={styles.primaryAction}>
            {t('hero.viewWork')}
          </Button>
          <Button variant="secondary" to="/#contact" className={styles.secondaryAction}>
            {t('hero.getInTouch')}
          </Button>
        </m.div>
      </m.div>

      <m.div
        className={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Link to="/#about" className={styles.scrollCueLink} aria-label={t('hero.scrollCue')}>
          <m.span
            className={styles.scrollCueIcon}
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDownIcon />
          </m.span>
        </Link>
      </m.div>
    </Section>
  )
}
