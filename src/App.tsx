import './style.scss'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  CurrentWeatherSummary,
  ErrorMessage,
  ForecastList,
  LoadingOverlay,
  MainHeader,
  SearchCityForm,
  WeatherDetails,
} from '@/components'
import { useWheaterApi, useCities } from '@/hooks'
import { CurrentWeatherData, DayWeatherData } from '@/types'
import { capitalizeWords } from '@/utils'
import { getClassByWeatherStatus } from './utils/getClassByWeatherStatus'
import { ERROR_MESSAGES } from '@/constants'

export default function App() {
  const { fetchAndCacheWeatherData } = useWheaterApi()
  const { updateCitiesList, updateCity, getCity, getCitiesList } = useCities()

  const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeatherData | null>()
  const [nextDaysWeatherData, setNextDaysWeatherData] = useState<DayWeatherData[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      setErrorMessage('')
      updateCity(city)
    } catch (error: any) {
      console.error(error)
      const message =
        error.response?.data?.code === 400001
          ? ERROR_MESSAGES.INVALID_LOCATION
          : ERROR_MESSAGES.GENERIC_ERROR
      setErrorMessage(message)
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

  return (
    <main
      className={`main ${
        currentWeatherData?.weatherStatus.description ? currentMainClassByStatus : ''
      } `}
    >
      {isLoading ? <LoadingOverlay /> : null}

      <div className='main-infos-container'>
        <MainHeader />
        <CurrentWeatherSummary currentWeatherData={currentWeatherData} />
        <ErrorMessage message={errorMessage} />
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
