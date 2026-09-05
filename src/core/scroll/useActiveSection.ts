import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * Tracks which of the given section ids is currently "active" while
 * scrolling, via a single IntersectionObserver — shared by the desktop pill
 * nav and the mobile bottom nav so there's one source of truth instead of
 * two divergent implementations.
 *
 * Re-runs on route change (not just once at mount) because `SiteHeader` is
 * mounted once for the whole app: landing directly on a route without these
 * sections (e.g. `/projects/:slug`) would otherwise never re-query the DOM
 * after navigating back to a route that has them.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((entry) => entry.isIntersecting)
        if (intersecting) {
          setActiveId(intersecting.target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )

    for (const element of elements) {
      observer.observe(element)
    }

    // Cleanup (not the setup body) is the sanctioned place to reset state
    // tied to this effect — runs when sectionIds/pathname change, e.g.
    // navigating to a route with none of these sections.
    return () => {
      observer.disconnect()
      setActiveId(null)
    }
  }, [sectionIds, pathname])

  return activeId
}
