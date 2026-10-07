import { DayWeatherData } from '@/types'
import { useTranslation } from '@/i18n'

interface DayResumeInfoProps {
  dayWeatherData: DayWeatherData
}

export function DayResumeInfo({ dayWeatherData }: DayResumeInfoProps) {
  const { forecastDate, t, weatherStatus } = useTranslation()
  const translatedWeatherStatus = weatherStatus(dayWeatherData.weatherStatus.description)

  return (
    <div className='day-info'>
      <p>{forecastDate(dayWeatherData.day)}</p>
      <p>
        {`
      ${dayWeatherData.temperatureMax}° - 
      ${dayWeatherData.temperatureMin}°`}
      </p>
      <figure className='weather-status-container'>
        <img
          className='weather-status-icon'
          src={dayWeatherData.weatherStatus.icon}
          alt={`${translatedWeatherStatus} ${t('weatherIcon')}`}
          width={50}
          height={50}
          loading='lazy'
          decoding='async'
        />

        <figcaption className='weather-status'>
          {translatedWeatherStatus}
        </figcaption>
      </figure>
    </div>
  )
}
