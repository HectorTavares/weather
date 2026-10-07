import axios from 'axios'
import { useCallback } from 'react'
import {
  dateFormat,
  getWeatherStatus,
  getMonthAndDay,
  setMainColorByWeatherClass,
  getClassByWeatherStatus,
} from '@/utils'

import { DEFAULT_CITY } from '@/constants'
import { CurrentWeatherData, DayWeatherData, WeatherData } from '@/types'

const OPEN_METEO_GEOCODING_URL = '/api/geocoding'
const OPEN_METEO_FORECAST_URL = '/api/forecast'

interface GeocodingResult {
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
  timezone?: string
}

interface GeocodingResponse {
  results?: GeocodingResult[]
}

interface OpenMeteoForecastResponse {
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
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

interface CachedWeatherData {
  expiresAt: number
  data: WeatherData
}

function getOpenMeteoWeatherStatus(weatherCode: number) {
  const weatherCodeMap: Record<number, number> = {
    0: 1000,
    1: 1100,
    2: 1101,
    3: 1001,
    45: 2000,
    48: 2000,
    51: 4000,
    53: 4000,
    55: 4000,
    56: 6000,
    57: 6000,
    61: 4200,
    63: 4001,
    65: 4201,
    66: 6200,
    67: 6201,
    71: 5100,
    73: 5000,
    75: 5101,
    77: 5001,
    80: 4200,
    81: 4001,
    82: 4201,
    85: 5100,
    86: 5101,
    95: 8000,
    96: 8000,
    99: 8000,
  }

  return getWeatherStatus(weatherCodeMap[weatherCode] ?? 0)
}

function getLocationName(location: GeocodingResult): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

function getCachedWeatherData(city: string): WeatherData | null {
  const cachedData = localStorage.getItem(`weather-cache:${city.toLowerCase()}`)

  if (!cachedData) {
    return null
  }

  try {
    const cache = JSON.parse(cachedData) as CachedWeatherData

    if (cache.expiresAt > Date.now()) {
      return cache.data
    }
  } catch {
    return null
  }

  localStorage.removeItem(`weather-cache:${city.toLowerCase()}`)
  return null
}

function setCachedWeatherData(city: string, data: WeatherData): void {
  const TEN_MINUTES = 600000

  localStorage.setItem(
    `weather-cache:${city.toLowerCase()}`,
    JSON.stringify({
      expiresAt: Date.now() + TEN_MINUTES,
      data,
    })
  )
}

export function useWheaterApi() {
  const fetchLocation = useCallback(async (city = DEFAULT_CITY): Promise<GeocodingResult> => {
    const response = await axios.get<GeocodingResponse>(OPEN_METEO_GEOCODING_URL, {
      params: {
        name: city,
        count: 1,
        language: 'en',
        format: 'json',
      },
    })

    const location = response.data.results?.[0]

    if (!location) {
      throw new Error('INVALID_LOCATION')
    }

    return location
  }, [])

  const fetchForecast = useCallback(async (
    location: GeocodingResult
  ): Promise<OpenMeteoForecastResponse> => {
    const response = await axios.get<OpenMeteoForecastResponse>(OPEN_METEO_FORECAST_URL, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current:
          'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: location.timezone ?? 'auto',
      },
    })

    return response.data
  }, [])

  const fetchAndCacheWeatherData = useCallback(async (city = DEFAULT_CITY): Promise<WeatherData> => {
    const cachedData = getCachedWeatherData(city)

    if (cachedData) {
      const weatherClass = getClassByWeatherStatus(
        cachedData.currentWeatherData.weatherStatus.description
      )

      setMainColorByWeatherClass(weatherClass)
      return cachedData
    }

    const location = await fetchLocation(city)
    const forecast = await fetchForecast(location)

    const currentWeatherData: CurrentWeatherData = {
      temperature: Math.round(forecast.current.temperature_2m),
      humidity: forecast.current.relative_humidity_2m,
      windSpeed: Math.round(forecast.current.wind_speed_10m),
      temperatureApparent: Math.round(forecast.current.apparent_temperature),
      weatherStatus: getOpenMeteoWeatherStatus(forecast.current.weather_code),
      cloudy: forecast.current.cloud_cover,
      date: dateFormat(forecast.current.time),
      location: getLocationName(location),
    }

    const nextDaysWeatherData: DayWeatherData[] = forecast.daily.time.map((day, index) => ({
      day: getMonthAndDay(day),
      weatherStatus: getOpenMeteoWeatherStatus(forecast.daily.weather_code[index]),
      temperatureMax: Math.round(forecast.daily.temperature_2m_max[index]),
      temperatureMin: Math.round(forecast.daily.temperature_2m_min[index]),
    }))

    const weatherData: WeatherData = {
      currentWeatherData,
      nextDaysWeatherData,
    }
    const weatherClass = getClassByWeatherStatus(
      weatherData.currentWeatherData.weatherStatus.description
    )

    setMainColorByWeatherClass(weatherClass)
    setCachedWeatherData(city, weatherData)

    return weatherData
  }, [fetchForecast, fetchLocation])

  return {
    fetchAndCacheWeatherData,
  }
}
