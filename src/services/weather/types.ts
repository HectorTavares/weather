import { WeatherData, WeatherStatus } from '@/types'

export interface WeatherProvider {
  name: string
  fetchWeatherData: (city: string, signal?: AbortSignal) => Promise<WeatherData>
}

export class WeatherProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public cause?: unknown
  ) {
    super(message)
    this.name = 'WeatherProviderError'
  }
}

export type WeatherStatusByCode = Record<number, WeatherStatus>
