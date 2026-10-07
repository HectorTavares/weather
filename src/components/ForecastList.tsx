import { DayWeatherData } from '@/types'
import { useTranslation } from '@/i18n'
import { DayResumeInfo } from './DayResumeInfo'

interface ForecastListProps {
  nextDaysWeatherData: DayWeatherData[]
}

export function ForecastList({ nextDaysWeatherData }: ForecastListProps) {
  const { t } = useTranslation()

  return (
    <section className='next-days-info'>
      <h2>{t('nextDays')}</h2>

      {nextDaysWeatherData.map((dayWeatherData) => (
        <DayResumeInfo key={dayWeatherData.day} dayWeatherData={dayWeatherData} />
      ))}
    </section>
  )
}
