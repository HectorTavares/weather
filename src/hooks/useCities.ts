import { useCallback } from 'react'
import { DEFAULT_CITIES_OPTIONS, DEFAULT_CITY } from '@/constants'

export function useCities() {
  const getCitiesList = useCallback((): string[] => {
    const localStorageCities = localStorage.getItem('cities')

    if (localStorageCities) {
      return JSON.parse(localStorageCities)
    }

    return DEFAULT_CITIES_OPTIONS
  }, [])

  const updateCitiesList = useCallback((lastCity: string, newCity: string): void => {
    const updatedCities = [...getCitiesList()]

    updatedCities.unshift(lastCity)
    updatedCities.unshift(newCity)

    const citiesFiltered = updatedCities.filter(
      (value, index, array) => array.indexOf(value) === index
    )

    const indexToRemove = citiesFiltered.findIndex((city) => city === newCity)

    citiesFiltered.splice(indexToRemove, 1)

    localStorage.setItem('cities', JSON.stringify(citiesFiltered.slice(0, 4)))
  }, [getCitiesList])

  const updateCity = useCallback((newCity: string): void => {
    localStorage.setItem('city', newCity)
  }, [])

  const getCity = useCallback((): string => {
    const city = localStorage.getItem('city')

    if (city) {
      return city
    }

    return DEFAULT_CITY
  }, [])

  return {
    updateCitiesList,
    getCitiesList,
    updateCity,
    getCity,
  }
}
