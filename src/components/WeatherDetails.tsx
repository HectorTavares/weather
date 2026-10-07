import { CurrentWeatherData } from '@/types'
import { useTranslation } from '@/i18n'

interface WeatherDetailsProps {
  currentWeatherData?: CurrentWeatherData | null
}

export function WeatherDetails({ currentWeatherData }: WeatherDetailsProps) {
  const { t } = useTranslation()

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
        <p className='value'>{currentWeatherData?.windSpeed} m/s </p>
      </div>
      <div className='weather-info-line'>
        <p className='title'>{t('windChill')}: </p>
        <p className='value'>{currentWeatherData?.temperatureApparent}° </p>
      </div>
    </section>
  )
}
