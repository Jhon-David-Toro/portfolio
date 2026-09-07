import { useEffect, useRef } from 'react'
import type { Particle, PointerPosition } from './Constellation.types'
import styles from './Constellation.module.scss'

// Below this width the page falls back to the Hero's plain gradient (see
// features/hero/HeroSection.module.scss's .glow/.backdrop) — a canvas
// particle loop is extra battery/CPU cost that phones don't need to spend
// on a decorative background, and mid-range Android GPUs already struggled
// with far cheaper full-viewport effects earlier in this project.
const DESKTOP_QUERY = '(min-width: 768px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const MAX_DEVICE_PIXEL_RATIO = 2
const PARTICLE_AREA_PX = 11000
const MAX_PARTICLES = 70
const LINK_DISTANCE = 130
const DRIFT_SPEED = 0.15
const PARTICLE_RADIUS = 2
const DOT_ALPHA = 0.8
const LINK_ALPHA_SCALE = 0.6
const POINTER_LINK_ALPHA_SCALE = 0.85

function canAnimateConstellation(): boolean {
  return window.matchMedia(DESKTOP_QUERY).matches && !window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / PARTICLE_AREA_PX))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * DRIFT_SPEED,
    vy: (Math.random() - 0.5) * DRIFT_SPEED,
  }))
}

function advanceParticle(particle: Particle, width: number, height: number): void {
  particle.x = (particle.x + particle.vx + width) % width
  particle.y = (particle.y + particle.vy + height) % height
}

// --color-constellation is tuned separately per theme for this exact use —
// --color-border was nearly invisible, and --color-text-secondary was dark
// enough in light mode to visually collide with headings/body copy instead
// of staying in the background. --color-accent is reserved for the
// pointer-linked lines below, so the accent only shows up as a direct
// response to the visitor, not as a constant purple wash over the page.
function readLineColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-constellation').trim()
}

function readAccentColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
}

function strokeLink(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  distance: number,
  color: string,
  alphaScale: number,
): void {
  ctx.globalAlpha = (1 - distance / LINK_DISTANCE) * alphaScale
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

function drawParticleLinks(ctx: CanvasRenderingContext2D, particles: readonly Particle[], color: string): void {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
      if (distance < LINK_DISTANCE) {
        strokeLink(ctx, particles[i], particles[j], distance, color, LINK_ALPHA_SCALE)
      }
    }
  }
}

function drawPointerLinks(
  ctx: CanvasRenderingContext2D,
  particles: readonly Particle[],
  pointer: PointerPosition,
  color: string,
): void {
  for (const particle of particles) {
    const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
    if (distance < LINK_DISTANCE) {
      strokeLink(ctx, particle, pointer, distance, color, POINTER_LINK_ALPHA_SCALE)
    }
  }
}

function drawParticleDots(ctx: CanvasRenderingContext2D, particles: readonly Particle[], color: string): void {
  ctx.globalAlpha = DOT_ALPHA
  ctx.fillStyle = color
  for (const particle of particles) {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, PARTICLE_RADIUS, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * A slow-drifting particle network fixed behind the whole page — purely
 * decorative, so it's `aria-hidden` and skipped entirely under
 * prefers-reduced-motion or below the desktop breakpoint (see
 * `canAnimateConstellation`). The ambient network uses a neutral
 * `--color-constellation` (tuned per theme — see readLineColor); lines to
 * the pointer pick up `--color-accent` instead, so the accent reads as a
 * reaction to the visitor rather than a constant tint. The loop only pauses
 * when the tab is backgrounded — being `position: fixed`, the canvas never
 * scrolls out of view, so there's no scroll-based pause to wire up.
 */
export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl || !canAnimateConstellation()) {
      return
    }
    const context = canvasEl.getContext('2d')
    if (!context) {
      return
    }

    // Rebound with an explicit non-null type: TS control-flow narrowing
    // from the guards above doesn't carry into the nested closures below.
    const canvas: HTMLCanvasElement = canvasEl
    const ctx: CanvasRenderingContext2D = context

    let particles: Particle[] = []
    let pointer: PointerPosition | null = null
    let lineColor = readLineColor()
    let accentColor = readAccentColor()
    let logicalWidth = 0
    let logicalHeight = 0
    let frameId: number | null = null

    function resize() {
      const rect = canvas.getBoundingClientRect()
      logicalWidth = rect.width
      logicalHeight = rect.height

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO)
      canvas.width = logicalWidth * dpr
      canvas.height = logicalHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = createParticles(logicalWidth, logicalHeight)
    }

    function draw() {
      for (const particle of particles) {
        advanceParticle(particle, logicalWidth, logicalHeight)
      }

      ctx.clearRect(0, 0, logicalWidth, logicalHeight)
      drawParticleLinks(ctx, particles, lineColor)
      if (pointer) {
        drawPointerLinks(ctx, particles, pointer, accentColor)
      }
      drawParticleDots(ctx, particles, lineColor)

      frameId = requestAnimationFrame(draw)
    }

    function stop() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    function start() {
      if (frameId === null) {
        frameId = requestAnimationFrame(draw)
      }
    }

    function handlePointerMove(event: PointerEvent) {
      pointer = { x: event.clientX, y: event.clientY }
    }

    function handlePointerLeave() {
      pointer = null
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    resize()
    start()

    const themeObserver = new MutationObserver(() => {
      lineColor = readLineColor()
      accentColor = readAccentColor()
    })
    themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] })

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stop()
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
