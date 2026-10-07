import './style.scss'
import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWheaterApi, useCities } from '@/hooks'
import { CurrentWeatherData, DayWeatherData } from '@/types'
import { capitalizeWords } from '@/utils'
import {
  CurrentWeatherSummary,
  ErrorMessage,
  ForecastList,
  LoadingOverlay,
  MainHeader,
  SearchCityForm,
  SettingsPanel,
  WeatherDetails,
} from '@/components'
import { getClassByWeatherStatus } from './utils/getClassByWeatherStatus'
import { WEATHER_CACHE_NAME } from '@/constants'
import { TranslationKey, useTranslation } from '@/i18n'

export default function App() {
  const { fetchAndCacheWeatherData } = useWheaterApi()
  const { updateCitiesList, updateCity, getCity, getCitiesList } = useCities()
  const { t } = useTranslation()

  const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeatherData | null>()
  const [nextDaysWeatherData, setNextDaysWeatherData] = useState<DayWeatherData[]>([])
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [city, setCity] = useState<string>(getCity())
  const initialCity = useRef(city)
  const citiesOptions = getCitiesList()
  const currentMainClassByStatus = getClassByWeatherStatus(
    currentWeatherData?.weatherStatus.description ?? ''
  )

  const fetchData = useCallback(async (city: string) => {
    try {
      setIsLoading(true)
      const weatherData = await fetchAndCacheWeatherData(city)
      document.title = weatherData.currentWeatherData.location

      setCurrentWeatherData(weatherData.currentWeatherData)
      setNextDaysWeatherData(weatherData.nextDaysWeatherData)
      setErrorKey(null)
      updateCity(city)
    } catch (error: unknown) {
      const nextErrorKey =
        axios.isAxiosError(error) && error.response?.data?.code === 400001
          ? 'invalidLocation'
          : 'genericError'
      setErrorKey(nextErrorKey)
    } finally {
      setIsLoading(false)
    }
  }, [fetchAndCacheWeatherData, updateCity])

  useEffect(() => {
    fetchData(initialCity.current)
  }, [fetchData])

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault()
    setCity(capitalizeWords(event.target.value))
  }

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (currentWeatherData) {
      updateCitiesList(currentWeatherData.location, city)
    }
    fetchData(city)
  }

  const handleOnSelectCity = (selectedCity: string): void => {
    updateCitiesList(city, selectedCity)
    setCity(capitalizeWords(selectedCity))
    fetchData(capitalizeWords(selectedCity))
  }

  const handleProviderPriorityChange = async (): Promise<void> => {
    const cache = await caches.open(WEATHER_CACHE_NAME)
    await cache.delete(city)
    fetchData(city)
  }

  return (
    <main
      className={`main ${
        currentWeatherData?.weatherStatus.description ? currentMainClassByStatus : ''
      } `}
    >
      {isLoading ? <LoadingOverlay /> : null}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onProviderPriorityChange={handleProviderPriorityChange}
      />

      <div className='main-infos-container'>
        <MainHeader onSettingsClick={() => setIsSettingsOpen(true)} />
        <CurrentWeatherSummary currentWeatherData={currentWeatherData} />
        <ErrorMessage message={errorKey ? t(errorKey) : ''} />
      </div>

      <aside className='sidebar'>
        <SearchCityForm
          city={city}
          cityOptions={citiesOptions}
          onCityChange={handleOnChange}
          onCitySelect={handleOnSelectCity}
          onSubmit={handleOnSubmit}
        />
        <WeatherDetails currentWeatherData={currentWeatherData} />
        <ForecastList nextDaysWeatherData={nextDaysWeatherData} />
      </aside>
    </main>
  )
}
