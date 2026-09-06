import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { buildProjectPath } from '../../../app/router/routes'
import { useTheme } from '../../../core/theme/useTheme'
import { profile } from '../../../content/profile/profile'
import { getProjects } from '../../../content/projects/projects'
import { SearchIcon } from '../../../design-system/icons/SearchIcon'
import { Modal } from '../../../design-system/Modal/Modal'
import styles from './CommandPalette.module.scss'

// Mirrors SiteHeader's own nav sections (kept local rather than shared —
// it's a short, stable list authored in exactly one other place).
const SECTION_IDS = ['about', 'experience', 'education', 'projects', 'skills', 'contact'] as const

/** A single runnable entry in the command palette. */
type Command = {
  readonly id: string
  readonly label: string
  readonly action: () => void
  /** Keeps the palette open after running — for actions with no visible page effect. */
  readonly keepOpen?: boolean
}

/**
 * Renders the command palette trigger and its keyboard-driven quick-actions
 * overlay (navigation, theme, language, CV, contact) — opened via Ctrl/Cmd+K
 * from anywhere in the app, or by clicking the trigger.
 */
export function CommandPalette() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [justCopiedEmail, setJustCopiedEmail] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const baseId = useId()

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  // Resets transient state as part of the same action that opens the
  // palette, rather than reacting to `open` becoming true inside an effect.
  const openPalette = useCallback(() => {
    setQuery('')
    setHighlightedIndex(0)
    setJustCopiedEmail(false)
    setOpen(true)
  }, [])

  // Global shortcut — works regardless of what currently has focus.
  useEffect(() => {
    function handleGlobalKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (open) {
          close()
        } else {
          openPalette()
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [open, close, openPalette])

  // Synchronizes focus with the DOM once the dialog is open — Modal moves
  // focus to the dialog itself first, so this moves it one step further,
  // into the input.
  useEffect(() => {
    if (!open) {
      return
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  const commands = useMemo<readonly Command[]>(() => {
    const sectionCommands = SECTION_IDS.map((id) => ({
      id: `go-${id}`,
      label: `${t('commandPalette.goTo')} ${t(`nav.${id}`)}`,
      action: () => navigate(`/#${id}`),
    }))

    const projectCommands = getProjects().map((project) => ({
      id: `project-${project.slug}`,
      label: `${t('commandPalette.openProject')} ${t(`projects.items.${project.slug}.title`)}`,
      action: () => navigate(buildProjectPath(project.slug)),
    }))

    return [
      ...sectionCommands,
      ...projectCommands,
      {
        id: 'toggle-theme',
        label: theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark'),
        action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'switch-language',
        label:
          i18n.language === 'es' ? t('commandPalette.switchToEnglish') : t('commandPalette.switchToSpanish'),
        action: () => {
          void i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
        },
      },
      {
        id: 'download-cv',
        label: t('nav.downloadCv'),
        action: () => {
          const link = document.createElement('a')
          link.href = '/jhon-toro-cv.pdf'
          link.download = ''
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        },
      },
      {
        id: 'copy-email',
        label: justCopiedEmail ? t('commandPalette.copiedEmail') : t('commandPalette.copyEmail'),
        keepOpen: true,
        action: () => {
          void navigator.clipboard.writeText(profile.email)
          setJustCopiedEmail(true)
          window.setTimeout(() => setJustCopiedEmail(false), 1500)
        },
      },
      {
        id: 'open-github',
        label: t('commandPalette.openGithub'),
        action: () => {
          window.open(profile.github, '_blank', 'noopener,noreferrer')
        },
      },
    ]
  }, [t, navigate, theme, setTheme, i18n, justCopiedEmail])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return commands
    }
    return commands.filter((command) => command.label.toLowerCase().includes(normalized))
  }, [commands, query])

  function runCommand(command: Command) {
    command.action()
    if (!command.keepOpen) {
      close()
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const command = filtered[highlightedIndex]
      if (command) {
        runCommand(command)
      }
    }
  }

  const titleId = `${baseId}-title`
  const listId = `${baseId}-list`
  const activeOption = filtered[highlightedIndex]

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label={t('commandPalette.openLabel')}
        onClick={openPalette}
      >
        <SearchIcon />
        <span className={styles.hint} aria-hidden="true">
          ⌘K
        </span>
      </button>

      {open && (
        <Modal onClose={close} titleId={titleId} closeLabel={t('common.close')}>
          <h2 id={titleId} className={styles.srOnly}>
            {t('commandPalette.heading')}
          </h2>

          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={t('commandPalette.placeholder')}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setHighlightedIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeOption ? `${baseId}-${activeOption.id}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />

          <ul id={listId} className={styles.list} role="listbox" aria-label={t('commandPalette.heading')}>
            {filtered.map((command, index) => (
              <li
                key={command.id}
                id={`${baseId}-${command.id}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={
                  index === highlightedIndex ? `${styles.option} ${styles.highlighted}` : styles.option
                }
                onClick={() => runCommand(command)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {command.label}
              </li>
            ))}
            {filtered.length === 0 && <li className={styles.empty}>{t('commandPalette.noResults')}</li>}
          </ul>

          <p className={styles.keyHint}>{t('commandPalette.keyHint')}</p>
        </Modal>
      )}
    </>
  )
}
