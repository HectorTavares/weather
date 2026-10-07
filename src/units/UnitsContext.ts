import { createContext } from 'react'
import { TemperatureUnit, WindUnit } from './types'

export interface UnitsContextValue {
  temperatureUnit: TemperatureUnit
  windUnit: WindUnit
  setTemperatureUnit: (unit: TemperatureUnit) => void
  setWindUnit: (unit: WindUnit) => void
  toTemperature: (temperatureInCelsius: number) => number
  toWindSpeed: (windSpeedInMetersPerSecond: number) => number
  formatTemperature: (temperatureInCelsius: number) => string
  formatWindSpeed: (windSpeedInMetersPerSecond: number) => string
}

export const UnitsContext = createContext<UnitsContextValue | null>(null)
