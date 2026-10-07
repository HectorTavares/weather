import { format, parseISO } from 'date-fns'
import { enUS, es, ptBR } from 'date-fns/locale'

export type Language = 'en' | 'pt' | 'es'

const translations = {
  en: {
    settings: 'Settings',
    closeSettings: 'Close settings',
    primaryWeatherApi: 'Primary weather API',
    language: 'Language',
    save: 'Save',
    anotherLocation: 'Another Location',
    search: 'Search',
    weatherDetails: 'Weather Details',
    cloudy: 'Cloudy',
    humidity: 'Humidity',
    wind: 'Wind',
    windChill: 'Wind Chill',
    nextDays: 'Next Days',
    loading: 'Loading',
    settingsButton: 'Settings button',
    weatherIcon: 'weather icon',
    invalidLocation: 'The location you are looking for does not exist, try another one.',
    genericError: 'The service is unavailable. Please try again later.',
  },
  pt: {
    settings: 'Configurações',
    closeSettings: 'Fechar configurações',
    primaryWeatherApi: 'API de clima principal',
    language: 'Idioma',
    save: 'Salvar',
    anotherLocation: 'Outra localização',
    search: 'Buscar',
    weatherDetails: 'Detalhes do clima',
    cloudy: 'Nublado',
    humidity: 'Umidade',
    wind: 'Vento',
    windChill: 'Sensação térmica',
    nextDays: 'Próximos dias',
    loading: 'Carregando',
    settingsButton: 'Botão de configurações',
    weatherIcon: 'ícone do clima',
    invalidLocation: 'A localização procurada não existe. Tente outra.',
    genericError: 'O serviço está indisponível. Tente novamente mais tarde.',
  },
  es: {
    settings: 'Configuración',
    closeSettings: 'Cerrar configuración',
    primaryWeatherApi: 'API meteorológica principal',
    language: 'Idioma',
    save: 'Guardar',
    anotherLocation: 'Otra ubicación',
    search: 'Buscar',
    weatherDetails: 'Detalles del clima',
    cloudy: 'Nublado',
    humidity: 'Humedad',
    wind: 'Viento',
    windChill: 'Sensación térmica',
    nextDays: 'Próximos días',
    loading: 'Cargando',
    settingsButton: 'Botón de configuración',
    weatherIcon: 'ícono del clima',
    invalidLocation: 'La ubicación buscada no existe. Prueba con otra.',
    genericError: 'El servicio no está disponible. Inténtalo de nuevo más tarde.',
  },
} as const

export type TranslationKey = keyof typeof translations.en

export const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Español' },
]

const weatherStatusTranslations: Record<Language, Record<string, string>> = {
  en: {},
  pt: {
    Unknown: 'Desconhecido',
    Clear: 'Céu limpo',
    'Mostly Clear': 'Predominantemente limpo',
    'Partly Cloudy': 'Parcialmente nublado',
    'Mostly Cloudy': 'Predominantemente nublado',
    Cloudy: 'Nublado',
    Fog: 'Neblina',
    'Light Fog': 'Neblina leve',
    Drizzle: 'Garoa',
    Rain: 'Chuva',
    'Light Rain': 'Chuva leve',
    'Heavy Rain': 'Chuva forte',
    Snow: 'Neve',
    Flurries: 'Neve fraca',
    'Light Snow': 'Neve leve',
    'Heavy Snow': 'Neve forte',
    'Freezing Drizzle': 'Garoa congelante',
    'Freezing Rain': 'Chuva congelante',
    'Light Freezing Rain': 'Chuva congelante leve',
    'Heavy Freezing Rain': 'Chuva congelante forte',
    'Ice Pellets': 'Grânulos de gelo',
    'Heavy Ice Pellets': 'Grânulos de gelo fortes',
    'Light Ice Pellets': 'Grânulos de gelo leves',
    Thunderstorm: 'Tempestade',
  },
  es: {
    Unknown: 'Desconocido',
    Clear: 'Despejado',
    'Mostly Clear': 'Mayormente despejado',
    'Partly Cloudy': 'Parcialmente nublado',
    'Mostly Cloudy': 'Mayormente nublado',
    Cloudy: 'Nublado',
    Fog: 'Niebla',
    'Light Fog': 'Niebla ligera',
    Drizzle: 'Llovizna',
    Rain: 'Lluvia',
    'Light Rain': 'Lluvia ligera',
    'Heavy Rain': 'Lluvia intensa',
    Snow: 'Nieve',
    Flurries: 'Nevadas débiles',
    'Light Snow': 'Nieve ligera',
    'Heavy Snow': 'Nieve intensa',
    'Freezing Drizzle': 'Llovizna helada',
    'Freezing Rain': 'Lluvia helada',
    'Light Freezing Rain': 'Lluvia helada ligera',
    'Heavy Freezing Rain': 'Lluvia helada intensa',
    'Ice Pellets': 'Gránulos de hielo',
    'Heavy Ice Pellets': 'Gránulos de hielo intensos',
    'Light Ice Pellets': 'Gránulos de hielo ligeros',
    Thunderstorm: 'Tormenta',
  },
}

const dateLocales = { en: enUS, pt: ptBR, es }

export function translate(language: Language, key: TranslationKey): string {
  return translations[language][key]
}

export function translateWeatherStatus(language: Language, status: string): string {
  return weatherStatusTranslations[language][status] ?? status
}

export function formatCurrentDate(language: Language, dateString: string): string {
  return format(parseISO(dateString), "HH:mm - EEEE, MMM d ''yy", {
    locale: dateLocales[language],
  })
}

export function formatForecastDate(language: Language, dateString: string): string {
  return format(parseISO(dateString), 'MMMM d', { locale: dateLocales[language] })
}
