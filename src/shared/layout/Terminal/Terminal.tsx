import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { buildProjectPath } from '../../../app/router/routes'
import { useDraggable } from '../../../core/dom/useDraggable'
import { formatMonthYear } from '../../../core/date/formatMonthYear'
import { useTheme } from '../../../core/theme/useTheme'
import { profile } from '../../../content/profile/profile'
import { education, courses } from '../../../content/education/education'
import { experience } from '../../../content/experience/experience'
import { skillGroups } from '../../../content/skills/skills'
import { getProjects } from '../../../content/projects/projects'
import { dispatchTerminalBackground, OPEN_TERMINAL_EVENT } from './terminalEvents'
import styles from './Terminal.module.scss'

const SECTIONS = ['about', 'experience', 'education', 'projects', 'skills', 'contact'] as const
const COMMAND_NAMES = [
  'help',
  'whoami',
  'about',
  'experience',
  'education',
  'skills',
  'projects',
  'contact',
  'cv',
  'resume',
  'github',
  'theme',
  'lang',
  'cd',
  'ask',
  'clear',
  'cls',
  'exit',
  'close',
] as const

type EntryKind = 'default' | 'error' | 'success'
type Entry = {
  readonly id: number
  readonly command: string | null
  readonly output: readonly string[]
  readonly kind: EntryKind
}

/**
 * Renders a playable terminal emulator — a command-line way to explore the
 * portfolio (whoami, experience, projects open <n>, theme dark, ask
 * <question> — the last one hitting the same /api/chat the AI assistant
 * widget uses). Opens via the backtick key (ignored while typing elsewhere)
 * or the command palette's "Open terminal" entry.
 */
export function Terminal() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [entries, setEntries] = useState<readonly Entry[]>([])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<readonly string[]>([])
  const [historyPointer, setHistoryPointer] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(0)
  const baseId = useId()
  const projects = useMemo(() => getProjects(), [])
  const { position, dragHandleProps } = useDraggable(windowRef)

  const nextId = useCallback(() => {
    nextIdRef.current += 1
    return nextIdRef.current
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  const openTerminal = useCallback(() => {
    setEntries((current) => {
      if (current.length > 0) {
        return current
      }
      const welcome = t('terminal.welcome', { returnObjects: true }) as string[]
      return [{ id: nextId(), command: null, output: welcome, kind: 'default' }]
    })
    setInput('')
    setHistoryPointer(null)
    setMinimized(false)
    setMaximized(false)
    setOpen(true)
  }, [t, nextId])

  // Global '`' shortcut — ignored while the visitor is typing anywhere else
  // on the page (contact form, AI assistant, command palette, etc.).
  useEffect(() => {
    function handleGlobalKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== '`') {
        return
      }
      const target = event.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (isTyping) {
        return
      }
      event.preventDefault()
      if (open) {
        close()
      } else {
        openTerminal()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [open, close, openTerminal])

  useEffect(() => {
    function handleOpenEvent() {
      openTerminal()
    }
    window.addEventListener(OPEN_TERMINAL_EVENT, handleOpenEvent)
    return () => window.removeEventListener(OPEN_TERMINAL_EVENT, handleOpenEvent)
  }, [openTerminal])

  useEffect(() => {
    if (!open) {
      return
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  // The terminal is a non-modal floating window now (see the render below —
  // no backdrop, no focus trap, the page stays interactive behind it), so it
  // needs its own Escape handling rather than Modal's.
  useEffect(() => {
    if (!open || minimized) {
      return
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, minimized, close])

  // Clicking the page behind the window minimizes it rather than closing it
  // — the session stays alive (Launcher shows the resume badge), so this
  // just gets it out of the way instead of discarding it. Skipped while
  // maximized, since there's no "outside" to click then.
  useEffect(() => {
    if (!open || minimized || maximized) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (windowRef.current && !windowRef.current.contains(event.target as Node)) {
        setMinimized(true)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open, minimized, maximized])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [entries])

  // Tells the Launcher whether a minimized-but-alive session exists, so it
  // can show a "1" badge and offer to resume it instead of "Terminal".
  useEffect(() => {
    dispatchTerminalBackground(open && minimized)
  }, [open, minimized])

  function appendEntry(command: string, output: readonly string[], kind: EntryKind = 'default') {
    setEntries((current) => [...current, { id: nextId(), command, output, kind }])
  }

  async function runAsk(question: string, command: string) {
    const entryId = nextId()
    setEntries((current) => [
      ...current,
      { id: entryId, command, output: [t('assistant.thinking')], kind: 'default' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, language: i18n.language, history: [] }),
      })
      if (!response.ok) {
        throw new Error('request failed')
      }
      const data = (await response.json()) as { answer?: string }
      const answer = data.answer
      if (!answer) {
        throw new Error('empty answer')
      }
      setEntries((current) =>
        current.map((entry) => (entry.id === entryId ? { ...entry, output: [answer] } : entry)),
      )
    } catch {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === entryId
            ? { ...entry, output: [t('assistant.errorFallback')], kind: 'error' }
            : entry,
        ),
      )
    }
  }

  async function execute(raw: string) {
    const trimmed = raw.trim()
    if (trimmed.length === 0) {
      appendEntry('', [])
      return
    }

    setCommandHistory((current) => [...current, trimmed])
    setHistoryPointer(null)

    const [rawCommand, ...args] = trimmed.split(/\s+/)
    const command = rawCommand.toLowerCase()
    const argString = args.join(' ')

    if (command === 'clear' || command === 'cls') {
      setEntries([])
      return
    }

    if (command === 'exit' || command === 'close') {
      appendEntry(trimmed, [])
      close()
      return
    }

    if (command === 'ask') {
      if (!argString) {
        appendEntry(trimmed, [t('terminal.askUsage')], 'error')
        return
      }
      await runAsk(argString, trimmed)
      return
    }

    let output: string[]
    let kind: EntryKind = 'default'

    switch (command) {
      case 'help':
        output = t('terminal.commandList', { returnObjects: true }) as string[]
        break

      case 'whoami':
        output = [t('terminal.whoami')]
        break

      case 'about':
        output = [t('about.lead'), '', t('about.body')]
        break

      case 'experience':
        output = experience.map((item) => {
          const role = t(`experience.items.${item.id}.role`)
          const start = formatMonthYear(item.startDate, i18n.language)
          const end = item.endDate ? formatMonthYear(item.endDate, i18n.language) : t('experience.present')
          const mode = t(`experience.workMode.${item.workMode}`)
          return `${role} — ${item.company} (${start} – ${end}) · ${mode}`
        })
        break

      case 'education':
        output = [
          ...education.map((item) => {
            const program = t(`education.items.${item.id}.program`)
            return `${program} — ${item.institution} (${item.startYear}–${item.endYear})`
          }),
          '',
          `${t('education.coursesHeading')}:`,
          ...courses.map((course) => `- ${course.title} (${course.provider})`),
        ]
        break

      case 'skills':
        output = skillGroups.map((group) => `${t(`skills.groups.${group.id}`)}: ${group.items.join(', ')}`)
        break

      case 'projects':
        if (args[0] === 'open') {
          const index = Number.parseInt(args[1] ?? '', 10)
          const project = projects[index - 1]
          if (!project) {
            output = [t('terminal.projectsNotFound', { number: args[1] ?? '?' })]
            kind = 'error'
            break
          }
          appendEntry(trimmed, [t(`projects.items.${project.slug}.title`)], 'success')
          navigate(buildProjectPath(project.slug))
          close()
          return
        }
        output = projects.map(
          (project, index) =>
            `${index + 1}. ${t(`projects.items.${project.slug}.title`)} — ${t(`projects.items.${project.slug}.summary`)}`,
        )
        break

      case 'contact':
        if (args[0] === 'email') {
          appendEntry(trimmed, [t('terminal.contactEmailOpened')], 'success')
          window.location.href = `mailto:${profile.email}`
          return
        }
        output = [`Email: ${profile.email}`, `GitHub: ${profile.github}`]
        break

      case 'cv':
      case 'resume': {
        const link = document.createElement('a')
        link.href = '/jhon-toro-cv.pdf'
        link.download = ''
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        output = [`${t('nav.downloadCv')}…`]
        kind = 'success'
        break
      }

      case 'github':
        window.open(profile.github, '_blank', 'noopener,noreferrer')
        output = [profile.github]
        break

      case 'theme':
        if (!argString) {
          output = [t('terminal.themeUsage', { theme })]
        } else if (argString === 'light' || argString === 'dark') {
          setTheme(argString)
          output = [`theme: ${argString}`]
          kind = 'success'
        } else {
          output = [t('terminal.themeInvalid')]
          kind = 'error'
        }
        break

      case 'lang':
        if (!argString) {
          output = [t('terminal.langUsage', { language: i18n.language })]
        } else if (argString === 'es' || argString === 'en') {
          void i18n.changeLanguage(argString)
          output = [`lang: ${argString}`]
          kind = 'success'
        } else {
          output = [t('terminal.langInvalid')]
          kind = 'error'
        }
        break

      case 'cd':
        if (argString && SECTIONS.includes(argString as (typeof SECTIONS)[number])) {
          appendEntry(trimmed, [], 'success')
          navigate(`/#${argString}`)
          close()
          return
        }
        output = argString ? [t('terminal.cdNotFound', { section: argString })] : [t('terminal.cdUsage')]
        kind = 'error'
        break

      default:
        output = [t('terminal.notFound', { command: rawCommand })]
        kind = 'error'
    }

    appendEntry(trimmed, output, kind)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = input
    setInput('')
    void execute(value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (commandHistory.length === 0) {
        return
      }
      const nextPointer = historyPointer === null ? commandHistory.length - 1 : Math.max(historyPointer - 1, 0)
      setHistoryPointer(nextPointer)
      setInput(commandHistory[nextPointer] ?? '')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyPointer === null) {
        return
      }
      const nextPointer = historyPointer + 1
      if (nextPointer >= commandHistory.length) {
        setHistoryPointer(null)
        setInput('')
      } else {
        setHistoryPointer(nextPointer)
        setInput(commandHistory[nextPointer] ?? '')
      }
    } else if (event.key === 'Tab') {
      event.preventDefault()
      const [current] = input.split(/\s+/)
      if (!current) {
        return
      }
      const matches = COMMAND_NAMES.filter((name) => name.startsWith(current.toLowerCase()))
      if (matches.length === 1) {
        setInput(`${matches[0]} `)
      }
    }
  }

  const titleId = `${baseId}-title`

  // Minimizing hides the window entirely (like sending it to the Dock) —
  // the session (entries, history) stays alive in state, and the Launcher
  // shows a badge to resume it, rather than a collapsed sliver sitting
  // inside the modal.
  if (!open || minimized) {
    return null
  }

  const positionerStyle: CSSProperties | undefined =
    !maximized && position ? { top: position.y, left: position.x, transform: 'none' } : undefined

  return createPortal(
    <div
      ref={windowRef}
      className={maximized ? `${styles.positioner} ${styles.positionerMaximized}` : styles.positioner}
      style={positionerStyle}
    >
      <motion.div
        className={maximized ? `${styles.terminal} ${styles.terminalMaximized}` : styles.terminal}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className={styles.titleBar} {...(maximized ? undefined : dragHandleProps)}>
          <span className={styles.dots}>
            <button
              type="button"
              className={styles.dotRed}
              aria-label={t('terminal.closeWindow')}
              onClick={(event) => {
                event.stopPropagation()
                close()
              }}
            />
            <button
              type="button"
              className={styles.dotYellow}
              aria-label={t('terminal.minimizeWindow')}
              onClick={(event) => {
                event.stopPropagation()
                setMinimized(true)
              }}
            />
            <button
              type="button"
              className={styles.dotGreen}
              aria-label={t('terminal.maximizeWindow')}
              onClick={(event) => {
                event.stopPropagation()
                setMaximized((value) => !value)
              }}
            />
          </span>
          <p id={titleId} className={styles.titleText}>
            jhon@portfolio — zsh
          </p>
        </div>

        <div ref={outputRef} className={styles.output}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {entry.command !== null && (
                <p className={styles.commandLine}>
                  <span className={styles.prompt} aria-hidden="true">
                    ❯
                  </span>{' '}
                  {entry.command}
                </p>
              )}
              {entry.output.map((line, index) => (
                <p
                  key={index}
                  className={
                    entry.kind === 'default'
                      ? styles.outputLine
                      : `${styles.outputLine} ${styles[entry.kind]}`
                  }
                >
                  {line || ' '}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <span className={styles.prompt} aria-hidden="true">
            ❯
          </span>
          <input
            ref={inputRef}
            type="text"
            className={styles.commandInput}
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setHistoryPointer(null)
            }}
            onKeyDown={handleKeyDown}
            aria-label={t('terminal.inputLabel')}
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </motion.div>
    </div>,
    document.body,
  )
}
