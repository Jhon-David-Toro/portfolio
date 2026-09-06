/** Discriminated status of the assistant's current request. */
export type Status = { readonly kind: 'idle' } | { readonly kind: 'sending' } | { readonly kind: 'error' }
