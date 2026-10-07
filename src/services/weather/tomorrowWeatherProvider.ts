import axios from 'axios'
import { getCityName, getWeatherStatus } from '@/utils'
import { BASE_API_URL, API_KEY } from '@/constants'
import { CurrentWeatherData, DayWeatherData, HourWeatherData, WeatherData } from '@/types'
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

interface TomorrowHourlyForecast {
  time: string
  values: {
    weatherCode: number
    temperature: number
    windSpeed: number
    precipitationProbability: number
  }
}

interface TomorrowForecastData {
  timelines: {
    daily: TomorrowDailyForecast[]
    hourly: TomorrowHourlyForecast[]
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
    date: data.data.time,
    location: getCityName(data.location.name),
  }
}

async function fetchForecastWeather(
  city: string,
  signal?: AbortSignal
): Promise<{ nextDaysWeatherData: DayWeatherData[]; hourlyWeatherData: HourWeatherData[] }> {
  if (!BASE_API_URL || !API_KEY) {
    throw new WeatherProviderError('Tomorrow API credentials are missing', TOMORROW_PROVIDER_NAME)
  }

  const url = `${BASE_API_URL}forecast?location=${city}&timesteps=1h,1d&apikey=${API_KEY}`
  const response = await axios.get<TomorrowForecastData>(url, { signal })
  const data = response.data

  return {
    nextDaysWeatherData: data.timelines.daily.map((day) => ({
      day: day.time,
      weatherStatus: getWeatherStatus(day.values.weatherCodeMin),
      temperatureMax: Math.round(day.values.temperatureMax),
      temperatureMin: Math.round(day.values.temperatureMin),
    })),
    hourlyWeatherData: data.timelines.hourly.map((hour) => ({
      time: hour.time,
      temperature: Math.round(hour.values.temperature),
      windSpeed: hour.values.windSpeed,
      precipitationProbability: hour.values.precipitationProbability,
      weatherStatus: getWeatherStatus(hour.values.weatherCode),
    })),
  }
}

export const tomorrowWeatherProvider: WeatherProvider = {
  name: TOMORROW_PROVIDER_NAME,
  async fetchWeatherData(city, signal): Promise<WeatherData> {
    try {
      const [currentWeatherData, forecastWeather] = await Promise.all([
        fetchCurrentWeatherData(city, signal),
        fetchForecastWeather(city, signal),
      ])

      return {
        currentWeatherData,
        ...forecastWeather,
      }
    } catch (error) {
      if (error instanceof WeatherProviderError) {
        throw error
      }

      throw new WeatherProviderError('Tomorrow request failed', TOMORROW_PROVIDER_NAME, error)
    }
  },
}
