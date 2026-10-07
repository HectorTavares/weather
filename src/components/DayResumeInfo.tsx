import { DayWeatherData } from '@/types'
import { useTranslation } from '@/i18n'
import { useUnits } from '@/units'

interface DayResumeInfoProps {
  dayWeatherData: DayWeatherData
  isSelected: boolean
  onSelect: () => void
}

export function DayResumeInfo({ dayWeatherData, isSelected, onSelect }: DayResumeInfoProps) {
  const { forecastDate, t, weatherStatus } = useTranslation()
  const { formatTemperature } = useUnits()
  const translatedWeatherStatus = weatherStatus(dayWeatherData.weatherStatus.description)

  return (
    <button
      type='button'
      className={`day-info ${isSelected ? 'selected' : ''}`}
      aria-pressed={isSelected}
      onClick={onSelect}
    >
      <span>{forecastDate(dayWeatherData.day)}</span>
      <span>
        {formatTemperature(dayWeatherData.temperatureMax)} -{' '}
        {formatTemperature(dayWeatherData.temperatureMin)}
      </span>
      <span className='weather-status-container'>
        <img
          className='weather-status-icon'
          src={dayWeatherData.weatherStatus.icon}
          alt={`${translatedWeatherStatus} ${t('weatherIcon')}`}
          width={50}
          height={50}
          loading='lazy'
          decoding='async'
        />

        <span className='weather-status'>
          {translatedWeatherStatus}
        </span>
      </span>
    </button>
  )
}
