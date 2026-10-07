import { useEffect, useRef, useState } from 'react'
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
  const [shouldScrollToForecast, setShouldScrollToForecast] = useState(false)
  const hourlyForecastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      nextDaysWeatherData.length &&
      !nextDaysWeatherData.some((dayWeatherData) => dayWeatherData.day === selectedDay)
    ) {
      setSelectedDay(nextDaysWeatherData[0].day)
    }
  }, [nextDaysWeatherData, selectedDay])

  useEffect(() => {
    if (shouldScrollToForecast && selectedDay) {
      hourlyForecastRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setShouldScrollToForecast(false)
    }
  }, [selectedDay, shouldScrollToForecast])

  const handleDaySelection = (day: string) => {
    setSelectedDay(day)
    setShouldScrollToForecast(true)
  }

  return (
    <section className='next-days-info'>
      {selectedDay ? (
        <div className='hourly-forecast-container' ref={hourlyForecastRef}>
          <HourlyForecast day={selectedDay} hourlyWeatherData={hourlyWeatherData} />
        </div>
      ) : null}

      <h2 className='next-days-title'>{t('nextDays')}</h2>

      {nextDaysWeatherData.map((dayWeatherData) => (
        <DayResumeInfo
          key={dayWeatherData.day}
          dayWeatherData={dayWeatherData}
          isSelected={selectedDay === dayWeatherData.day}
          onSelect={() => handleDaySelection(dayWeatherData.day)}
        />
      ))}
    </section>
  )
}
