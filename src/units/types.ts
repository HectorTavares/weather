export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin'
export type WindUnit = 'kilometersPerHour' | 'metersPerSecond'
type UnitLabelKey =
  | 'celsius'
  | 'fahrenheit'
  | 'kelvin'
  | 'kilometersPerHour'
  | 'metersPerSecond'

export const temperatureUnitOptions: Array<{ value: TemperatureUnit; labelKey: UnitLabelKey }> = [
  { value: 'celsius', labelKey: 'celsius' },
  { value: 'fahrenheit', labelKey: 'fahrenheit' },
  { value: 'kelvin', labelKey: 'kelvin' },
]

export const windUnitOptions: Array<{ value: WindUnit; labelKey: UnitLabelKey }> = [
  { value: 'kilometersPerHour', labelKey: 'kilometersPerHour' },
  { value: 'metersPerSecond', labelKey: 'metersPerSecond' },
]
