import { CurrentWeatherData } from '@/types'

interface WeatherDetailsProps {
  currentWeatherData?: CurrentWeatherData | null
}

export function WeatherDetails({ currentWeatherData }: WeatherDetailsProps) {
  return (
    <section className='weather-info'>
      <h2>Weather Details</h2>
      <div className='weather-info-line'>
        <p className='title'>Cloudy:</p> <p className='value'>{currentWeatherData?.cloudy}% </p>
      </div>

      <div className='weather-info-line'>
        <p className='title'>Humidity:</p>
        <p className='value'> {currentWeatherData?.humidity}% </p>
      </div>
      <div className='weather-info-line'>
        <p className='title'>Wind: </p>
        <p className='value'>{currentWeatherData?.windSpeed} m/s </p>
      </div>
      <div className='weather-info-line'>
        <p className='title'>Wind Chill: </p>
        <p className='value'>{currentWeatherData?.temperatureApparent}° </p>
      </div>
    </section>
  )
}
