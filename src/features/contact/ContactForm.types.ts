/** Discriminated status of the contact form's submission. */
export type SubmitStatus =
  | { readonly kind: 'idle' }
  | { readonly kind: 'submitting' }
  | { readonly kind: 'success' }
  | { readonly kind: 'error' }

/** Props for the animated submit button. */
export type SubmitButtonProps = {
  readonly status: SubmitStatus
}
