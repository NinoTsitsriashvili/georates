import { useRouter } from 'next/router'
import ka from '../locales/ka.json'
import en from '../locales/en.json'
import ru from '../locales/ru.json'

const translations: Record<string, any> = {
  ka,
  en,
  ru,
}

export type Locale = 'ka' | 'en' | 'ru'

export function useTranslation(locale: Locale = 'ka') {
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale] || translations['ka']

    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }

    return value || key
  }

  return { t, locale }
}

export function getTranslations(locale: Locale = 'ka') {
  return translations[locale] || translations['ka']
}

