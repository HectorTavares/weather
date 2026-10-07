import { useState } from 'react'
import { DayWeatherData, HourWeatherData } from '@/types'
import { useTranslation } from '@/i18n'
import { DayResumeInfo } from './DayResumeInfo'
import { HourlyForecast } from './HourlyForecast'

interface ForecastListProps {
  nextDaysWeatherData: DayWeatherData[]
  hourlyWeatherData: HourWeatherData[]
}

export function ForecastList({ nextDaysWeatherData, hourlyWeatherData }: ForecastListProps) {
  const { t } = useTranslation()
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  return (
    <section className='next-days-info'>
      <h2>{t('nextDays')}</h2>

      {nextDaysWeatherData.map((dayWeatherData) => (
        <DayResumeInfo
          key={dayWeatherData.day}
          dayWeatherData={dayWeatherData}
          isSelected={selectedDay === dayWeatherData.day}
          onSelect={() =>
            setSelectedDay((currentDay) =>
              currentDay === dayWeatherData.day ? null : dayWeatherData.day
            )
          }
        />
      ))}
      {selectedDay ? (
        <HourlyForecast
          day={selectedDay}
          hourlyWeatherData={hourlyWeatherData}
          onClose={() => setSelectedDay(null)}
        />
      ) : (
        <p className='hourly-forecast-hint'>{t('selectDay')}</p>
      )}
    </section>
  )
}
