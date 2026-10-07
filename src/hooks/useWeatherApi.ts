import {
  setMainColorByWeatherClass,
  getClassByWeatherStatus,
} from '@/utils'

import { DEFAULT_CITY } from '@/constants'
import { WeatherData } from '@/types'
import { fetchWeatherDataWithFallback } from '@/services/weather'

export function useWheaterApi() {
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
  } catch {
    return null
  }

    const weatherData = await fetchWeatherDataWithFallback(city)
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
