import { CSSProperties, useMemo, useState } from 'react'
import { HourWeatherData } from '@/types'
import { useTranslation } from '@/i18n'

type HourlyMetric = 'temperature' | 'wind' | 'rain'

interface HourlyForecastProps {
  day: string
  hourlyWeatherData: HourWeatherData[]
}

const metrics: HourlyMetric[] = ['temperature', 'rain', 'wind']

export function HourlyForecast({ day, hourlyWeatherData }: HourlyForecastProps) {
  const { forecastDate, hourTime, t, weatherStatus } = useTranslation()
  const [metric, setMetric] = useState<HourlyMetric>('temperature')
  const hourlyData = useMemo(
    () => hourlyWeatherData.filter((hour) => hour.time.slice(0, 10) === day.slice(0, 10)),
    [day, hourlyWeatherData]
  )

  const getMetricValue = (hour: HourWeatherData): number => {
    if (metric === 'wind') {
      return hour.windSpeed
    }

    if (metric === 'rain') {
      return hour.precipitationProbability
    }

    return hour.temperature
  }

  const formatMetricValue = (hour: HourWeatherData): string => {
    if (metric === 'wind') {
      return `${hour.windSpeed} m/s`
    }

    if (metric === 'rain') {
      return `${hour.precipitationProbability}%`
    }

    return `${hour.temperature}°`
  }

  const values = hourlyData.map(getMetricValue)
  const maxValue = Math.max(...values, 1)
  const minValue = Math.min(...values, 0)
  const valueRange = maxValue - minValue || 1

  return (
    <section className='hourly-forecast' aria-label={t('hourlyForecast')}>
      <div className='hourly-forecast-header'>
        <div>
          <p className='hourly-forecast-eyebrow'>{t('hourlyForecast')}</p>
          <h3>{forecastDate(day)}</h3>
        </div>
      </div>

      {hourlyData.length ? (
        <>
          <div className='hourly-metric-tabs' role='tablist' aria-label={t('hourlyForecast')}>
            {metrics.map((currentMetric) => (
              <button
                type='button'
                role='tab'
                aria-selected={metric === currentMetric}
                className={metric === currentMetric ? 'active' : ''}
                key={currentMetric}
                onClick={() => setMetric(currentMetric)}
              >
                {t(currentMetric === 'wind' ? 'wind' : currentMetric)}
              </button>
            ))}
          </div>

          <div className={`hourly-chart ${metric}`}>
            {hourlyData.map((hour) => {
              const value = getMetricValue(hour)
              const chartHeight = 18 + ((value - minValue) / valueRange) * 62

              return (
                <article className='hourly-chart-item' key={hour.time}>
                  <p className='hourly-chart-value'>{formatMetricValue(hour)}</p>
                  <div className='hourly-chart-track'>
                    <span
                      className='hourly-chart-bar'
                      style={{ '--chart-height': `${chartHeight}%` } as CSSProperties}
                    />
                  </div>
                  <p className='hourly-chart-time'>{hourTime(hour.time)}</p>
                  <img
                    className='hourly-weather-icon'
                    src={hour.weatherStatus.icon}
                    alt={`${weatherStatus(hour.weatherStatus.description)} ${t('weatherIcon')}`}
                    width={28}
                    height={28}
                    loading='lazy'
                    decoding='async'
                  />
                </article>
              )
            })}
          </div>
        </>
      ) : (
        <p className='hourly-empty'>{t('noHourlyForecast')}</p>
      )}
    </section>
  )
}
