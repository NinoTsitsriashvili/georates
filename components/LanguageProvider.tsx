'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getTranslations, type Locale } from '@/lib/i18n'
import { trackLanguageChange } from '@/lib/analytics'

interface LanguageContextType {
  locale: Locale
  t: (key: string) => string
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ka')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get saved locale or detect browser language
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale
      if (savedLocale && ['ka', 'en', 'ru'].includes(savedLocale)) {
        setLocaleState(savedLocale)
      } else {
        // Detect browser language
        const browserLang = navigator.language.split('-')[0]
        if (browserLang === 'ka' || browserLang === 'en' || browserLang === 'ru') {
          setLocaleState(browserLang as Locale)
        }
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    const oldLocale = locale
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
      // Track language change
      if (oldLocale !== newLocale) {
        trackLanguageChange(oldLocale, newLocale, window.location.pathname)
      }
    }
  }

  const t = (key: string): string => {
    const translations = getTranslations(locale)
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }

    return value || key
  }

  // Always provide context, even before mounting
  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

