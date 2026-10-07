import { CurrentWeatherData } from '@/types'
import { useTranslation } from '@/i18n'
import { useUnits } from '@/units'

interface WeatherDetailsProps {
  currentWeatherData?: CurrentWeatherData | null
}

export function WeatherDetails({ currentWeatherData }: WeatherDetailsProps) {
  const { t } = useTranslation()
  const { formatTemperature, formatWindSpeed } = useUnits()

  return (
    <section className='weather-info'>
      <h2>{t('weatherDetails')}</h2>
      <div className='weather-info-line'>
        <p className='title'>{t('cloudy')}:</p>{' '}
        <p className='value'>{currentWeatherData?.cloudy}% </p>
      </div>

      <div className='weather-info-line'>
        <p className='title'>{t('humidity')}:</p>
        <p className='value'> {currentWeatherData?.humidity}% </p>
      </div>
      <div className='weather-info-line'>
        <p className='title'>{t('wind')}: </p>
        <p className='value'>
          {currentWeatherData ? formatWindSpeed(currentWeatherData.windSpeed) : null}
        </p>
      </div>
      <div className='weather-info-line'>
        <p className='title'>{t('windChill')}: </p>
        <p className='value'>
          {currentWeatherData ? formatTemperature(currentWeatherData.temperatureApparent) : null}
        </p>
      </div>
    </section>
  )
}
