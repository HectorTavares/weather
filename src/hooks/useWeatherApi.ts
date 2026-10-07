import axios from 'axios'
import {
  getCityName,
  dateFormat,
  getWeatherStatus,
  getMonthAndDay,
  setMainColorByWeatherClass,
  getClassByWeatherStatus,
} from '@/utils'

import { DEFAULT_CITY, BASE_API_URL, API_KEY } from '@/constants'
import { CurrentWeatherData, DayWeatherData, WeatherData } from '@/types'

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

    const currentWeatherPromise = fetchCurrentWeatherData(city)
    const nextDaysWheaterPromise = fetchNextDaysWeather(city)

    const [currentWheater, nextDaysWheater] = await Promise.all([
      currentWeatherPromise,
      nextDaysWheaterPromise,
    ])

    const weatherData: WeatherData = {
      currentWeatherData: currentWheater,
      nextDaysWeatherData: nextDaysWheater,
    }
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

/*
{
  "data": {
    "time": "2023-07-01T17:54:00Z",
    "values": {
      "cloudBase": 0.18,
      "cloudCeiling": 0.18,
      "cloudCover": 86,
      "dewPoint": 15.31,
      "freezingRainIntensity": 0,
      "humidity": 92,
      "precipitationProbability": 8,
      "pressureSurfaceLevel": 1012.8,
      "rainIntensity": 0.49,
      "sleetIntensity": 0,
      "snowIntensity": 0,
      "temperature": 16.88,
      "temperatureApparent": 16.88,
      "uvHealthConcern": 0,
      "uvIndex": 0,
      "visibility": 16,
      "weatherCode": 4000,
      "windDirection": 195.69,
      "windGust": 1.81,
      "windSpeed": 1.81
    }
  },
  "location": {
    "lat": -29.85116195678711,
    "lon": -51.177886962890625,
    "name": "Esteio, Região Geográfica Imediata de Porto Alegre, Região Metropolitana de Porto Alegre, Região Geográfica Intermediária de Porto Alegre, Rio Grande do Sul, Região Sul, Brasil",
    "type": "administrative"
  }
}
*/
