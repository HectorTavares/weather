import axios from 'axios'
import {
  dateFormat,
  getCityName,
  getMonthAndDay,
  getWeatherStatus,
} from '@/utils'
import { BASE_API_URL, API_KEY } from '@/constants'
import { CurrentWeatherData, DayWeatherData, WeatherData } from '@/types'
import { WeatherProvider, WeatherProviderError } from './types'

const TOMORROW_PROVIDER_NAME = 'tomorrow'

interface TomorrowDailyForecast {
  time: string
  values: {
    weatherCodeMin: number
    temperatureMax: number
    temperatureMin: number
  }
}

async function fetchCurrentWeatherData(
  city: string,
  signal?: AbortSignal
): Promise<CurrentWeatherData> {
  if (!BASE_API_URL || !API_KEY) {
    throw new WeatherProviderError('Tomorrow API credentials are missing', TOMORROW_PROVIDER_NAME)
  }

  const url = `${BASE_API_URL}realtime?location=${city}&apikey=${API_KEY}`
  const response = await axios.get(url, { signal })
  const data = response.data

  return {
    temperature: Math.round(data.data.values.temperature),
    humidity: data.data.values.humidity,
    windSpeed: data.data.values.windSpeed,
    temperatureApparent: Math.round(data.data.values.temperatureApparent),
    weatherStatus: getWeatherStatus(data.data.values.weatherCode),
    cloudy: data.data.values.cloudCover,
    date: dateFormat(data.data.time),
    location: getCityName(data.location.name),
  }
}

async function fetchNextDaysWeather(
  city: string,
  signal?: AbortSignal
): Promise<DayWeatherData[]> {
  if (!BASE_API_URL || !API_KEY) {
    throw new WeatherProviderError('Tomorrow API credentials are missing', TOMORROW_PROVIDER_NAME)
  }

  const url = `${BASE_API_URL}forecast?location=${city}&timesteps=1d&apikey=${API_KEY}`
  const response = await axios.get(url, { signal })
  const data = response.data

  return data.timelines.daily.map((day: TomorrowDailyForecast) => ({
    day: getMonthAndDay(day.time),
    weatherStatus: getWeatherStatus(day.values.weatherCodeMin),
    temperatureMax: Math.round(day.values.temperatureMax),
    temperatureMin: Math.round(day.values.temperatureMin),
  }))
}

export const tomorrowWeatherProvider: WeatherProvider = {
  name: TOMORROW_PROVIDER_NAME,
  async fetchWeatherData(city, signal): Promise<WeatherData> {
    try {
      const [currentWeatherData, nextDaysWeatherData] = await Promise.all([
        fetchCurrentWeatherData(city, signal),
        fetchNextDaysWeather(city, signal),
      ])

      return {
        currentWeatherData,
        nextDaysWeatherData,
      }
    } catch (error) {
      if (error instanceof WeatherProviderError) {
        throw error
      }

      throw new WeatherProviderError('Tomorrow request failed', TOMORROW_PROVIDER_NAME, error)
    }
  },
}
