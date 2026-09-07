import type { SectionNoteProps } from './SectionNote.types'
import styles from './SectionNote.module.scss'

/** Renders a small italic note directly under a section heading. */
export function SectionNote({ children }: SectionNoteProps) {
  return <p className={styles.note}>{children}</p>
}
