import { ReactNode, useCallback, useMemo, useState } from 'react'
import { UnitsContext } from './UnitsContext'
import { TemperatureUnit, WindUnit } from './types'

const TEMPERATURE_UNIT_STORAGE_KEY = 'weather-temperature-unit'
const WIND_UNIT_STORAGE_KEY = 'weather-wind-unit'

function getTemperatureUnit(): TemperatureUnit {
  const storedUnit = localStorage.getItem(TEMPERATURE_UNIT_STORAGE_KEY)
  return storedUnit === 'fahrenheit' || storedUnit === 'kelvin' ? storedUnit : 'celsius'
}

function getWindUnit(): WindUnit {
  const storedUnit = localStorage.getItem(WIND_UNIT_STORAGE_KEY)
  return storedUnit === 'kilometersPerHour' ? storedUnit : 'metersPerSecond'
}

function formatNumber(value: number): string {
  const roundedValue = Math.round(value * 10) / 10
  return Number.isInteger(roundedValue) ? String(roundedValue) : roundedValue.toFixed(1)
}

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [temperatureUnit, setTemperatureUnitState] = useState<TemperatureUnit>(getTemperatureUnit)
  const [windUnit, setWindUnitState] = useState<WindUnit>(getWindUnit)

  const setTemperatureUnit = useCallback((unit: TemperatureUnit) => {
    localStorage.setItem(TEMPERATURE_UNIT_STORAGE_KEY, unit)
    setTemperatureUnitState(unit)
  }, [])

  const setWindUnit = useCallback((unit: WindUnit) => {
    localStorage.setItem(WIND_UNIT_STORAGE_KEY, unit)
    setWindUnitState(unit)
  }, [])

  const value = useMemo(() => {
    const toTemperature = (temperatureInCelsius: number): number => {
      if (temperatureUnit === 'fahrenheit') {
        return temperatureInCelsius * 1.8 + 32
      }

      if (temperatureUnit === 'kelvin') {
        return temperatureInCelsius + 273.15
      }

      return temperatureInCelsius
    }

    const toWindSpeed = (windSpeedInMetersPerSecond: number): number =>
      windUnit === 'kilometersPerHour' ? windSpeedInMetersPerSecond * 3.6 : windSpeedInMetersPerSecond

    const formatTemperature = (temperatureInCelsius: number): string => {
      const unitSuffix = temperatureUnit === 'kelvin' ? 'K' : temperatureUnit === 'fahrenheit' ? '°F' : '°C'
      return `${formatNumber(toTemperature(temperatureInCelsius))}${unitSuffix}`
    }

    const formatWindSpeed = (windSpeedInMetersPerSecond: number): string => {
      const unitSuffix = windUnit === 'kilometersPerHour' ? 'km/h' : 'm/s'
      return `${formatNumber(toWindSpeed(windSpeedInMetersPerSecond))} ${unitSuffix}`
    }

    return {
      temperatureUnit,
      windUnit,
      setTemperatureUnit,
      setWindUnit,
      toTemperature,
      toWindSpeed,
      formatTemperature,
      formatWindSpeed,
    }
  }, [setTemperatureUnit, setWindUnit, temperatureUnit, windUnit])

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>
}
