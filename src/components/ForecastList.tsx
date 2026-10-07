import { DayWeatherData } from '@/types'
import { DayResumeInfo } from './DayResumeInfo'

interface ForecastListProps {
  nextDaysWeatherData: DayWeatherData[]
}

export function ForecastList({ nextDaysWeatherData }: ForecastListProps) {
  return (
    <section className='next-days-info'>
      <h2>Next Days</h2>

      {nextDaysWeatherData.map((dayWeatherData) => (
        <DayResumeInfo key={dayWeatherData.day} dayWeatherData={dayWeatherData} />
      ))}
    </section>
  )
}
