import { m } from 'motion/react'
import { fadeUpVariants } from '@/core/motion/variants'
import { cx } from '@/core/style/cx'
import { Container } from '@/design-system/Container/Container'
import type { SectionProps } from './Section.types'
import styles from './Section.module.scss'

/** Renders a semantic section with shared layout and reveal behavior. */
export function Section({ id, children, className, ...aria }: SectionProps) {
  return (
    <m.section
      id={id}
      className={cx(styles.section, className)}
      // -1 so ScrollToHash can move focus here for anchor-nav users, without
      // adding the section to the regular Tab order.
      tabIndex={id ? -1 : undefined}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUpVariants}
      {...aria}
    >
      <Container>{children}</Container>
    </m.section>
  )
}
