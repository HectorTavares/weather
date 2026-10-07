import { WeatherData } from '@/types'
import { openMeteoWeatherProvider } from './openMeteoWeatherProvider'
import { tomorrowWeatherProvider } from './tomorrowWeatherProvider'
import { WeatherProvider, WeatherProviderError } from './types'

const DEFAULT_PROVIDER_PRIORITY = ['tomorrow', 'open-meteo']
const PROVIDER_TIMEOUT_IN_MS = 3500

const weatherProvidersByName: Record<string, WeatherProvider> = {
  [tomorrowWeatherProvider.name]: tomorrowWeatherProvider,
  [openMeteoWeatherProvider.name]: openMeteoWeatherProvider,
}

function getProviderPriority(): string[] {
  const envPriority = import.meta.env.VITE_WEATHER_PROVIDER_PRIORITY

  if (!envPriority) {
    return DEFAULT_PROVIDER_PRIORITY
  }

  return envPriority
    .split(',')
    .map((providerName: string) => providerName.trim())
    .filter(Boolean)
}

function getProvidersByPriority(): WeatherProvider[] {
  return getProviderPriority()
    .map((providerName) => weatherProvidersByName[providerName])
    .filter(Boolean)
}

async function fetchWithTimeout(provider: WeatherProvider, city: string): Promise<WeatherData> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_IN_MS)

  try {
    return await provider.fetchWeatherData(city, controller.signal)
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function fetchWeatherDataWithFallback(city: string): Promise<WeatherData> {
  const providers = getProvidersByPriority()
  const errors: WeatherProviderError[] = []

  for (const provider of providers) {
    try {
      return await fetchWithTimeout(provider, city)
    } catch (error) {
      const providerError =
        error instanceof WeatherProviderError
          ? error
          : new WeatherProviderError('Weather provider failed', provider.name, error)

      errors.push(providerError)
      console.warn(`[weather] ${provider.name} failed, trying next provider`, providerError)
    }
  }

  throw errors[errors.length - 1] || new Error('No weather providers configured')
}
