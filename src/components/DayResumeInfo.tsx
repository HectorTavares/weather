import { DayWeatherData } from '@/types'

interface DayResumeInfoProps {
  dayWeatherData: DayWeatherData
}

export function DayResumeInfo({ dayWeatherData }: DayResumeInfoProps) {
  return (
    <div className='day-info'>
      <p>{dayWeatherData.day}</p>
      <p>
        {`
      ${dayWeatherData.temperatureMax}° - 
      ${dayWeatherData.temperatureMin}°`}
      </p>
      <figure className='weather-status-container'>
        <img
          className='weather-status-icon'
          src={dayWeatherData.weatherStatus.icon}
          alt={`${dayWeatherData.weatherStatus.description} icon`}
          width={50}
          height={50}
          loading='lazy'
          decoding='async'
        />

        <figcaption className='weather-status'>
          {dayWeatherData.weatherStatus.description}
        </figcaption>
      </figure>
    </div>
  )
}
