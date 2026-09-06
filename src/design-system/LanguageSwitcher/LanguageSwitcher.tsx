import { useTranslation } from 'react-i18next'
import type { Locale } from '@/app/i18n/i18n'
import { LanguageIcon } from '@/design-system/icons/LanguageIcon'
import styles from './LanguageSwitcher.module.scss'

const LOCALES: readonly Locale[] = ['es', 'en']

/** Renders the compact control for switching the interface locale. */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div className={styles.row}>
      <LanguageIcon />
      <span className={styles.label}>{t('settings.languageLabel')}</span>
      <div className={styles.segmented} role="group" aria-label={t('settings.languageLabel')}>
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
    </div>
  )
}
