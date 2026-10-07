import {
  setMainColorByWeatherClass,
  getClassByWeatherStatus,
} from '@/utils'

import { DEFAULT_CITY } from '@/constants'
import { WeatherData } from '@/types'
import { fetchWeatherDataWithFallback } from '@/services/weather'

const REQUEST_TIMEOUT_MS = 10_000

export function useWheaterApi() {
  async function fetchCurrentWeatherData(city = DEFAULT_CITY): Promise<CurrentWeatherData> {
    const url = `${BASE_API_URL}realtime?location=${city}&apikey=${API_KEY}`

    const response = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS })
    const data = response.data

    const weatherData: CurrentWeatherData = {
      temperature: Math.round(data.data.values.temperature),
      humidity: data.data.values.humidity,
      windSpeed: data.data.values.windSpeed,
      temperatureApparent: Math.round(data.data.values.temperatureApparent),
      weatherStatus: getWeatherStatus(data.data.values.weatherCode),
      cloudy: data.data.values.cloudCover,
      date: dateFormat(data.data.time),
      location: getCityName(data.location.name),
    }

    return weatherData
  }

  async function fetchNextDaysWeather(city = DEFAULT_CITY): Promise<DayWeatherData[]> {
    const url = `${BASE_API_URL}forecast?location=${city}&timesteps=1d&apikey=${API_KEY}`

    const response = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS })
    const data = response.data

    const weatherData = data.timelines.daily.map((day: any) => {
      return {
        day: getMonthAndDay(day.time),
        weatherStatus: getWeatherStatus(day.values.weatherCodeMin),
        temperatureMax: Math.round(day.values.temperatureMax),
        temperatureMin: Math.round(day.values.temperatureMin),
      }
    })

    return weatherData
  }

  async function fetchAndCacheWeatherData(city = DEFAULT_CITY): Promise<WeatherData> {
    const cache = await caches.open('weather-cache')
    const cachedResponse = await cache.match(city)

    if (cachedResponse) {
      const expirationHeader = cachedResponse.headers.get('Expires')
      const isCachedResponseValid = new Date(expirationHeader!).getTime() > Date.now()
      if (isCachedResponseValid) {
        const data = await cachedResponse.json()
        const weatherClass = getClassByWeatherStatus(
          data.currentWeatherData.weatherStatus.description
        )

        setMainColorByWeatherClass(weatherClass)

        return data as WeatherData
      } else {
        await cache.delete(city)
      }
    }

    const weatherData = await fetchWeatherDataWithFallback(city)
    const weatherClass = getClassByWeatherStatus(
      weatherData.currentWeatherData.weatherStatus.description
    )

    setMainColorByWeatherClass(weatherClass)

    const TEN_MINUTES = 600000
    const cacheResponse = new Response(JSON.stringify(weatherData), {
      headers: {
        Expires: new Date(Date.now() + TEN_MINUTES).toUTCString(),
      },
    })

    cache.put(city, cacheResponse)

    return weatherData
  }

  return {
    fetchAndCacheWeatherData,
  }
}
