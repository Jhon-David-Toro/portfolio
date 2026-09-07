import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

// How far down the viewport counts as "reached" — matches roughly where a
// reader's eye sits after a section heading scrolls into place.
const ACTIVE_LINE_RATIO = 0.25

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

    let frame = 0

    // Recomputed from live geometry on every scroll/resize rather than from
    // IntersectionObserver threshold crossings — a thin observer band can
    // let a short section (e.g. Skills) cross it entirely between two paint
    // frames during a fast scroll, silently skipping it. Walking elements in
    // top-to-bottom order and keeping the last one whose top has passed the
    // line can't skip anything, since it's a fresh, complete read each time.
    function updateActiveSection() {
      frame = 0
      const line = window.innerHeight * ACTIVE_LINE_RATIO

      let current: string | null = null
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) {
          current = element.id
        }
      }
      setActiveId(current)
    }

    function scheduleUpdate() {
      if (frame) {
        return
      }
      frame = requestAnimationFrame(updateActiveSection)
    }

    // Deferred to the next frame rather than measured synchronously here:
    // this effect runs right after the whole page's initial DOM lands, so a
    // synchronous getBoundingClientRect() read at this exact point forces
    // the browser to flush layout immediately instead of on its own
    // schedule — a real forced reflow caught in production traces.
    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frame) {
        cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      setActiveId(null)
    }
  }, [sectionIds, pathname])

  return activeId
}
