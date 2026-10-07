import { useCallback } from 'react'
import {
  setMainColorByWeatherClass,
  getClassByWeatherStatus,
} from '@/utils'

import { DEFAULT_CITY } from '@/constants'
import { WeatherData } from '@/types'
import { fetchWeatherDataWithFallback } from '@/services/weather'

export function useWheaterApi() {
  const fetchAndCacheWeatherData = useCallback(async (city = DEFAULT_CITY): Promise<WeatherData> => {
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

    await cache.put(city, cacheResponse)

    return weatherData
  }, [])

  return {
    fetchAndCacheWeatherData,
  }
}
