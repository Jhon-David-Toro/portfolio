import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { fadeUpVariants } from '../../core/motion/variants'
import { Container } from '../Container/Container'
import styles from './Section.module.scss'

type SectionProps = {
  readonly id?: string
  readonly children: ReactNode
  readonly 'aria-label'?: string
  readonly 'aria-labelledby'?: string
}

export function Section({ id, children, ...aria }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={styles.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUpVariants}
      {...aria}
    >
      <Container>{children}</Container>
    </motion.section>
  )
}
