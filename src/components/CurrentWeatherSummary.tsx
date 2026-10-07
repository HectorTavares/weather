import { CurrentWeatherData } from '@/types'
import { useTranslation } from '@/i18n'
import { useUnits } from '@/units'

interface CurrentWeatherSummaryProps {
  currentWeatherData?: CurrentWeatherData | null
}

export function CurrentWeatherSummary({ currentWeatherData }: CurrentWeatherSummaryProps) {
  const { currentDate, t, weatherStatus } = useTranslation()
  const { formatTemperature } = useUnits()
  const translatedWeatherStatus = currentWeatherData
    ? weatherStatus(currentWeatherData.weatherStatus.description)
    : ''

  return (
    <section className='main-infos'>
      <div className='temperature-container'>
        <h2 className='temperature'>
          {currentWeatherData ? formatTemperature(currentWeatherData.temperature) : null}
        </h2>
      </div>
      <div className='location-date-container'>
        <p className='location'> {currentWeatherData?.location}</p>
        <p className='date'>
          {currentWeatherData ? currentDate(currentWeatherData.date) : null}
        </p>
      </div>
      <figure className='weather-status-container'>
        {currentWeatherData ? (
          <img
            className='weather-status-icon'
            src={currentWeatherData.weatherStatus.icon}
            alt={`${translatedWeatherStatus} ${t('weatherIcon')}`}
            width={75}
            height={75}
            loading='lazy'
            decoding='async'
          />
        ) : null}

        <figcaption className='weather-status'>
          {translatedWeatherStatus}
        </figcaption>
      </figure>
    </section>
  )
}
