import { CurrentWeatherData } from '@/types'

interface CurrentWeatherSummaryProps {
  currentWeatherData?: CurrentWeatherData | null
}

export function CurrentWeatherSummary({ currentWeatherData }: CurrentWeatherSummaryProps) {
  return (
    <section className='main-infos'>
      <div className='temperature-container'>
        <h2 className='temperature'>{currentWeatherData?.temperature}°</h2>
      </div>
      <div className='location-date-container'>
        <p className='location'> {currentWeatherData?.location}</p>
        <p className='date'>{currentWeatherData?.date}</p>
      </div>
      <figure className='weather-status-container'>
        {currentWeatherData ? (
          <img
            className='weather-status-icon'
            src={currentWeatherData.weatherStatus.icon}
            alt={`${currentWeatherData.weatherStatus.description} icon`}
            width={75}
            height={75}
            loading='lazy'
            decoding='async'
          />
        ) : null}

        <figcaption className='weather-status'>
          {currentWeatherData?.weatherStatus.description}
        </figcaption>
      </figure>
    </section>
  )
}
