import { createContext } from 'react'
import { Language, TranslationKey } from './translations'

export interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
  weatherStatus: (status: string) => string
  currentDate: (dateString: string) => string
  forecastDate: (dateString: string) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
