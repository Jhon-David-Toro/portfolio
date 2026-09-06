import { useTranslation } from 'react-i18next'
import { useTheme } from '../../core/theme/useTheme'
import { MoonIcon } from '../icons/MoonIcon'
import { SunIcon } from '../icons/SunIcon'
import styles from './ThemeToggle.module.scss'

/** Renders the accessible light/dark theme switch as a settings row. */
export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.row}
      role="switch"
      aria-checked={isDark}
      aria-label={t(isDark ? 'theme.switchToLight' : 'theme.switchToDark')}
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark')
      }}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      <span className={styles.label}>{t('settings.themeLabel')}</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </button>
  )
}
