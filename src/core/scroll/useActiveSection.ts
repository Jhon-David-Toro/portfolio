import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * Tracks the section currently visible in the viewport.
 *
 * @param sectionIds - IDs of sections eligible to become active.
 * @returns The active section ID, or `null` when none is visible.
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
