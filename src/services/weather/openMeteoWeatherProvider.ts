import axios from 'axios'
import { dateFormat, getMonthAndDay } from '@/utils'
import { DayWeatherData, WeatherStatus } from '@/types'
import { WeatherProvider, WeatherProviderError, WeatherStatusByCode } from './types'

interface OpenMeteoGeocodingResult {
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}

interface OpenMeteoForecastResponse {
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    rain: number
    weather_code: number
    cloud_cover: number
    wind_speed_10m: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

const OPEN_METEO_PROVIDER_NAME = 'open-meteo'

const openMeteoWeatherStatusByCode: WeatherStatusByCode = {
  0: { description: 'Clear', icon: '/icons/clear_day.svg' },
  1: { description: 'Mostly Clear', icon: '/icons/mostly_clear_day.svg' },
  2: { description: 'Partly Cloudy', icon: '/icons/partly_cloudy_day.svg' },
  3: { description: 'Cloudy', icon: '/icons/cloudy.svg' },
  45: { description: 'Fog', icon: '/icons/fog.svg' },
  48: { description: 'Fog', icon: '/icons/fog.svg' },
  51: { description: 'Drizzle', icon: '/icons/freezing_drizzle.svg' },
  53: { description: 'Drizzle', icon: '/icons/freezing_drizzle.svg' },
  55: { description: 'Drizzle', icon: '/icons/freezing_drizzle.svg' },
  56: { description: 'Freezing Drizzle', icon: '/icons/freezing_drizzle.svg' },
  57: { description: 'Freezing Drizzle', icon: '/icons/freezing_drizzle.svg' },
  61: { description: 'Light Rain', icon: '/icons/rain_light.svg' },
  63: { description: 'Rain', icon: '/icons/rain.svg' },
  65: { description: 'Heavy Rain', icon: '/icons/rain_heavy.svg' },
  66: { description: 'Freezing Rain', icon: '/icons/freezing_rain.svg' },
  67: { description: 'Freezing Rain', icon: '/icons/freezing_rain.svg' },
  71: { description: 'Light Snow', icon: '/icons/snow_light.svg' },
  73: { description: 'Snow', icon: '/icons/snow.svg' },
  75: { description: 'Heavy Snow', icon: '/icons/snow_heavy.svg' },
  77: { description: 'Flurries', icon: '/icons/flurries.svg' },
  80: { description: 'Light Rain', icon: '/icons/rain_light.svg' },
  81: { description: 'Rain', icon: '/icons/rain.svg' },
  82: { description: 'Heavy Rain', icon: '/icons/rain_heavy.svg' },
  85: { description: 'Light Snow', icon: '/icons/snow_light.svg' },
  86: { description: 'Heavy Snow', icon: '/icons/snow_heavy.svg' },
  95: { description: 'Thunderstorm', icon: '/icons/thunderstorm.svg' },
  96: { description: 'Thunderstorm', icon: '/icons/thunderstorm.svg' },
  99: { description: 'Thunderstorm', icon: '/icons/thunderstorm.svg' },
}

function getOpenMeteoWeatherStatus(weatherCode: number): WeatherStatus {
  return (
    openMeteoWeatherStatusByCode[weatherCode] || {
      description: 'Unknown',
      icon: '/icons/unknown.svg',
    }
  )
}

async function getCoordinatesByCity(
  city: string,
  signal?: AbortSignal
): Promise<OpenMeteoGeocodingResult> {
  const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: {
      name: city,
      count: 1,
      language: 'pt',
      format: 'json',
    },
    signal,
  })

  const [result] = response.data.results || []

  if (!result) {
    throw new WeatherProviderError('Location not found', OPEN_METEO_PROVIDER_NAME)
  }

  return result
}

function getLocationName(location: OpenMeteoGeocodingResult): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

function getDailyWeatherData(data: OpenMeteoForecastResponse): DayWeatherData[] {
  return data.daily.time.map((day, index) => ({
    day: getMonthAndDay(day),
    weatherStatus: getOpenMeteoWeatherStatus(data.daily.weather_code[index]),
    temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
    temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
  }))
}

export const openMeteoWeatherProvider: WeatherProvider = {
  name: OPEN_METEO_PROVIDER_NAME,
  async fetchWeatherData(city, signal) {
    try {
      const location = await getCoordinatesByCity(city, signal)

      const response = await axios.get<OpenMeteoForecastResponse>(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            current:
              'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min',
            forecast_days: 7,
            timezone: 'America/Sao_Paulo',
            wind_speed_unit: 'ms',
          },
          signal,
        }
      )

      const data = response.data

      return {
        currentWeatherData: {
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          temperatureApparent: Math.round(data.current.apparent_temperature),
          weatherStatus: getOpenMeteoWeatherStatus(data.current.weather_code),
          cloudy: data.current.cloud_cover,
          date: dateFormat(data.current.time),
          location: getLocationName(location),
        },
        nextDaysWeatherData: getDailyWeatherData(data),
      }
    } catch (error) {
      if (error instanceof WeatherProviderError) {
        throw error
      }

      throw new WeatherProviderError('Open-Meteo request failed', OPEN_METEO_PROVIDER_NAME, error)
    }
  },
}
