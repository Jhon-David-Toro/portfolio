import { useEffect } from 'react'

/**
 * Synchronizes document metadata with the active page and locale.
 *
 * @param title - Page title, or `null` while the page is unresolved.
 * @param description - Optional description for the document metadata.
 */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    if (title === null) {
      return
    }

    document.title = title

    if (description === undefined) {
      return
    }

    let descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', description)
  }, [title, description])
}
