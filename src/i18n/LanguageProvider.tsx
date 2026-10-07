import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContext'
import {
  formatCurrentDate,
  formatForecastDate,
  formatHour,
  Language,
  translate,
  translateWeatherStatus,
} from './translations'

const LANGUAGE_STORAGE_KEY = 'weather-language'

function getInitialLanguage(): Language {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return storedLanguage === 'pt' || storedLanguage === 'es' ? storedLanguage : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((nextLanguage: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    setLanguageState(nextLanguage)
  }, [])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: Parameters<typeof translate>[1]) => translate(language, key),
      weatherStatus: (status: string) => translateWeatherStatus(language, status),
      currentDate: (dateString: string) => formatCurrentDate(language, dateString),
      forecastDate: (dateString: string) => formatForecastDate(language, dateString),
      hourTime: formatHour,
    }),
    [language, setLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
