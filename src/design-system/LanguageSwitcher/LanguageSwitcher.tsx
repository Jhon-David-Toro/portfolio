import { useTranslation } from 'react-i18next'
import type { Locale } from '../../app/i18n/i18n'
import styles from './LanguageSwitcher.module.scss'

const LOCALES: readonly Locale[] = ['es', 'en']

/** Renders the compact control for switching the interface locale. */
export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          className={styles.option}
          aria-pressed={i18n.language === locale}
          onClick={() => {
            void i18n.changeLanguage(locale)
          }}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
