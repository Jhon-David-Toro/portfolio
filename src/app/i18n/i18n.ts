import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../../content/locales/en.json'
import es from '../../content/locales/es.json'

/** Supported interface locales. */
export type Locale = 'en' | 'es'

const STORAGE_KEY = 'portfolio-locale'

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'es'
}

function detectInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) {
      return stored
    }
  } catch {
    // localStorage unavailable (private browsing, etc.) — fall through.
  }

  return navigator.language.startsWith('en') ? 'en' : 'es'
}

const initialLocale = detectInitialLocale()
document.documentElement.lang = initialLocale

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: initialLocale,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (locale) => {
  document.documentElement.lang = locale

  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Nothing to persist to — the language still applies for this session.
  }
})

export default i18n
