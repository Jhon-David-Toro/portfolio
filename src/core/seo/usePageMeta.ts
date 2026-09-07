import { useEffect } from 'react'
import { SITE_URL } from './seo.constants'

/** Creates a `<meta>` tag if it doesn't already exist, then sets its content. */
export function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/** Creates a `<link>` tag if it doesn't already exist, then sets its href. */
function upsertLink(rel: string, href: string) {
  let tag = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Synchronizes document metadata with the active page and locale — title,
 * description, canonical URL, and their Open Graph/Twitter counterparts.
 * Without this, a shared or crawled route (e.g. a project page) would show
 * the Open Graph defaults baked into index.html instead of its own
 * title/description, and every route would canonicalize to the same URL.
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

    const canonicalUrl = `${SITE_URL}${window.location.pathname}`
    upsertLink('canonical', canonicalUrl)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:title', title)
    upsertMeta('name', 'twitter:title', title)

    if (description === undefined) {
      return
    }

    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:description', description)
    upsertMeta('name', 'twitter:description', description)
  }, [title, description])
}
