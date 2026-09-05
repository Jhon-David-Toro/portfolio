import { useEffect } from 'react'

/**
 * Synchronizes the document title and meta description with the active
 * page/locale. Pass `null` for `title` when the page has nothing to set yet
 * (e.g. still resolving a route param) — the effect is skipped entirely
 * rather than briefly writing blank/placeholder values.
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
