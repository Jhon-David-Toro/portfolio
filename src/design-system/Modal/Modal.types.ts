import type { ReactNode } from 'react'

/** Props for an accessible modal dialog rendered through a document portal. */
export type ModalProps = {
  readonly onClose: () => void
  readonly titleId: string
  readonly closeLabel: string
  readonly children: ReactNode
}
