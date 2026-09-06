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
import { buildProjectPath } from '@/app/router/routes'
import { askAssistant } from '@/core/api/assistantClient'
import { useDraggable, type Position } from '@/core/dom/useDraggable'
import { formatMonthYear } from '@/core/date/formatMonthYear'
import { cx } from '@/core/style/cx'
import { useTheme } from '@/core/theme/useTheme'
import { downloadCv, openGithubProfile, profile } from '@/content/profile/profile'
import { education, courses } from '@/content/education/education'
import { experience } from '@/content/experience/experience'
import { PORTFOLIO_SECTION_IDS } from '@/content/navigation/sections'
import { skillGroups } from '@/content/skills/skills'
import { getProjects } from '@/content/projects/projects'
import { dispatchTerminalBackground, OPEN_TERMINAL_EVENT } from './terminalEvents'
import type { Entry, EntryKind } from './Terminal.types'
import styles from './Terminal.module.scss'

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

/** Result of running one terminal command — `null` means it already fully handled itself. */
type CommandResult = { readonly output: string[]; readonly kind: EntryKind } | null

/** Whether the visitor is typing into a field elsewhere on the page. */
function isTypingInField(target: EventTarget | null): boolean {
  const element = target as HTMLElement
  return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable
}

function getPositionerClassName(maximized: boolean): string {
  return cx(styles.positioner, maximized && styles.positionerMaximized)
}

function getTerminalClassName(maximized: boolean): string {
  return cx(styles.terminal, maximized && styles.terminalMaximized)
}

/** The dragged window position, or `undefined` to fall back to centered CSS. */
function getPositionerStyle(maximized: boolean, position: Position | null): CSSProperties | undefined {
  if (maximized || !position) {
    return undefined
  }
  return { top: position.y, left: position.x, transform: 'none' }
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
  const outputRef = useRef<HTMLUListElement>(null)
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
      if (event.key !== '`' || isTypingInField(event.target)) {
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

  // The three commands below each take an optional sub-argument that
  // triggers navigation (and closes the terminal) instead of just printing
  // text — pulled out of execute()'s switch since that nested "check an
  // arg, maybe navigate and return early, otherwise fall through to a
  // default listing" shape was its main source of nesting. Returning `null`
  // means the command already fully handled itself (appended its own entry,
  // navigated, closed) and execute() should stop rather than append again.

  function openProjectAtIndex(rawIndex: string | undefined, trimmed: string): CommandResult {
    const project = projects[Number.parseInt(rawIndex ?? '', 10) - 1]
    if (!project) {
      return { output: [t('terminal.projectsNotFound', { number: rawIndex ?? '?' })], kind: 'error' }
    }
    appendEntry(trimmed, [t(`projects.items.${project.slug}.title`)], 'success')
    navigate(buildProjectPath(project.slug))
    close()
    return null
  }

  function runProjectsCommand(args: readonly string[], trimmed: string): CommandResult {
    if (args[0] !== 'open') {
      return {
        output: projects.map(
          (project, index) =>
            `${index + 1}. ${t(`projects.items.${project.slug}.title`)} — ${t(`projects.items.${project.slug}.summary`)}`,
        ),
        kind: 'default',
      }
    }
    return openProjectAtIndex(args[1], trimmed)
  }

  function runContactCommand(args: readonly string[], trimmed: string): CommandResult {
    if (args[0] === 'email') {
      appendEntry(trimmed, [t('terminal.contactEmailOpened')], 'success')
      window.location.href = `mailto:${profile.email}`
      return null
    }

    return { output: [`Email: ${profile.email}`, `GitHub: ${profile.github}`], kind: 'default' }
  }

  function runCdCommand(argString: string, trimmed: string): CommandResult {
    if (argString && PORTFOLIO_SECTION_IDS.includes(argString as (typeof PORTFOLIO_SECTION_IDS)[number])) {
      appendEntry(trimmed, [], 'success')
      navigate(`/#${argString}`)
      close()
      return null
    }

    return {
      output: argString ? [t('terminal.cdNotFound', { section: argString })] : [t('terminal.cdUsage')],
      kind: 'error',
    }
  }

  async function runAsk(question: string, command: string) {
    const entryId = nextId()
    setEntries((current) => [
      ...current,
      { id: entryId, command, output: [t('assistant.thinking')], kind: 'default' },
    ])

    try {
      const answer = await askAssistant(question, i18n.language, [])
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

  function formatExperienceLine(item: (typeof experience)[number]): string {
    const role = t(`experience.items.${item.id}.role`)
    const start = formatMonthYear(item.startDate, i18n.language)
    const end = item.endDate ? formatMonthYear(item.endDate, i18n.language) : t('experience.present')
    const mode = t(`experience.workMode.${item.workMode}`)
    return `${role} — ${item.company} (${start} – ${end}) · ${mode}`
  }

  function formatEducationLine(item: (typeof education)[number]): string {
    const program = t(`education.items.${item.id}.program`)
    return `${program} — ${item.institution} (${item.startYear}–${item.endYear})`
  }

  function buildEducationOutput(): string[] {
    return [
      ...education.map(formatEducationLine),
      '',
      `${t('education.coursesHeading')}:`,
      ...courses.map((course) => `- ${course.title} (${course.provider})`),
    ]
  }

  function runCvCommand(): CommandResult {
    downloadCv()
    return { output: [`${t('nav.downloadCv')}…`], kind: 'success' }
  }

  function runGithubCommand(): CommandResult {
    openGithubProfile()
    return { output: [profile.github], kind: 'default' }
  }

  function runThemeCommand(argString: string): CommandResult {
    if (!argString) {
      return { output: [t('terminal.themeUsage', { theme })], kind: 'default' }
    }
    if (argString === 'light' || argString === 'dark') {
      setTheme(argString)
      return { output: [`theme: ${argString}`], kind: 'success' }
    }
    return { output: [t('terminal.themeInvalid')], kind: 'error' }
  }

  function runLangCommand(argString: string): CommandResult {
    if (!argString) {
      return { output: [t('terminal.langUsage', { language: i18n.language })], kind: 'default' }
    }
    if (argString === 'es' || argString === 'en') {
      void i18n.changeLanguage(argString)
      return { output: [`lang: ${argString}`], kind: 'success' }
    }
    return { output: [t('terminal.langInvalid')], kind: 'error' }
  }

  function runClearCommand(): CommandResult {
    setEntries([])
    return null
  }

  function runExitCommand(trimmed: string): CommandResult {
    appendEntry(trimmed, [])
    close()
    return null
  }

  async function runAskCommand(argString: string, trimmed: string): Promise<CommandResult> {
    if (!argString) {
      return { output: [t('terminal.askUsage')], kind: 'error' }
    }
    await runAsk(argString, trimmed)
    return null
  }

  /** Maps each command name to the handler that runs it — extend here, not in `execute`. */
  function buildCommandHandlers(
    args: readonly string[],
    argString: string,
    trimmed: string,
  ): Record<string, () => CommandResult | Promise<CommandResult>> {
    return {
      clear: () => runClearCommand(),
      cls: () => runClearCommand(),
      exit: () => runExitCommand(trimmed),
      close: () => runExitCommand(trimmed),
      ask: () => runAskCommand(argString, trimmed),
      help: () => ({ output: t('terminal.commandList', { returnObjects: true }) as string[], kind: 'default' }),
      whoami: () => ({ output: [t('terminal.whoami')], kind: 'default' }),
      about: () => ({ output: [t('about.lead'), '', t('about.body')], kind: 'default' }),
      experience: () => ({ output: experience.map(formatExperienceLine), kind: 'default' }),
      education: () => ({ output: buildEducationOutput(), kind: 'default' }),
      skills: () => ({
        output: skillGroups.map((group) => `${t(`skills.groups.${group.id}`)}: ${group.items.join(', ')}`),
        kind: 'default',
      }),
      projects: () => runProjectsCommand(args, trimmed),
      contact: () => runContactCommand(args, trimmed),
      cv: () => runCvCommand(),
      resume: () => runCvCommand(),
      github: () => runGithubCommand(),
      theme: () => runThemeCommand(argString),
      lang: () => runLangCommand(argString),
      cd: () => runCdCommand(argString, trimmed),
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
    const handler = buildCommandHandlers(args, argString, trimmed)[command]

    const result = handler
      ? await handler()
      : { output: [t('terminal.notFound', { command: rawCommand })], kind: 'error' as const }

    if (result) {
      appendEntry(trimmed, result.output, result.kind)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = input
    setInput('')
    void execute(value)
  }

  function navigateHistoryUp() {
    if (commandHistory.length === 0) {
      return
    }
    const nextPointer = historyPointer === null ? commandHistory.length - 1 : Math.max(historyPointer - 1, 0)
    setHistoryPointer(nextPointer)
    setInput(commandHistory[nextPointer] ?? '')
  }

  function navigateHistoryDown() {
    if (historyPointer === null) {
      return
    }
    const nextPointer = historyPointer + 1
    if (nextPointer >= commandHistory.length) {
      setHistoryPointer(null)
      setInput('')
      return
    }
    setHistoryPointer(nextPointer)
    setInput(commandHistory[nextPointer] ?? '')
  }

  function completeCommand() {
    const [current] = input.split(/\s+/)
    if (!current) {
      return
    }
    const matches = COMMAND_NAMES.filter((name) => name.startsWith(current.toLowerCase()))
    if (matches.length === 1) {
      setInput(`${matches[0]} `)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const keyActions: Partial<Record<string, () => void>> = {
      ArrowUp: navigateHistoryUp,
      ArrowDown: navigateHistoryDown,
      Tab: completeCommand,
    }

    const action = keyActions[event.key]
    if (!action) {
      return
    }
    event.preventDefault()
    action()
  }

  const titleId = `${baseId}-title`

  // Minimizing hides the window entirely (like sending it to the Dock) —
  // the session (entries, history) stays alive in state, and the Launcher
  // shows a badge to resume it, rather than a collapsed sliver sitting
  // inside the modal.
  if (!open || minimized) {
    return null
  }

  return createPortal(
    <div
      ref={windowRef}
      className={getPositionerClassName(maximized)}
      style={getPositionerStyle(maximized, position)}
    >
      <motion.div
        className={getTerminalClassName(maximized)}
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

        <ul ref={outputRef} className={styles.output}>
          {entries.map((entry) => (
            <motion.li
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
                  className={cx(styles.outputLine, entry.kind !== 'default' && styles[entry.kind])}
                >
                  {line || ' '}
                </p>
              ))}
            </motion.li>
          ))}
        </ul>

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
