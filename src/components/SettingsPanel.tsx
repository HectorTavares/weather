import { FormEvent, useState } from 'react'
import {
  getWeatherProviderPriority,
  setWeatherProviderPriority,
  weatherProviderOptions,
} from '@/services/weather'
import { languageOptions, Language, useTranslation } from '@/i18n'
import {
  TemperatureUnit,
  temperatureUnitOptions,
  useUnits,
  WindUnit,
  windUnitOptions,
} from '@/units'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onProviderPriorityChange: () => void
}

export function SettingsPanel({
  isOpen,
  onClose,
  onProviderPriorityChange,
}: SettingsPanelProps) {
  const { language, setLanguage, t } = useTranslation()
  const { temperatureUnit, windUnit, setTemperatureUnit, setWindUnit } = useUnits()
  const [selectedProvider, setSelectedProvider] = useState(getWeatherProviderPriority()[0])
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)
  const [selectedTemperatureUnit, setSelectedTemperatureUnit] =
    useState<TemperatureUnit>(temperatureUnit)
  const [selectedWindUnit, setSelectedWindUnit] = useState<WindUnit>(windUnit)

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWeatherProviderPriority(selectedProvider)
    setLanguage(selectedLanguage)
    setTemperatureUnit(selectedTemperatureUnit)
    setWindUnit(selectedWindUnit)
    onProviderPriorityChange()
    onClose()
  }

  return (
    <div className='settings-panel-backdrop'>
      <form className='settings-panel' onSubmit={handleSubmit}>
        <div className='settings-panel-header'>
          <h2>{t('settings')}</h2>
          <button
            type='button'
            className='settings-close-button'
            aria-label={t('closeSettings')}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <fieldset className='settings-fieldset'>
          <legend>{t('primaryWeatherApi')}</legend>
          <div className='provider-options'>
            {weatherProviderOptions.map((provider) => (
              <label className='provider-option' key={provider.name}>
                <input
                  type='radio'
                  name='provider'
                  value={provider.name}
                  checked={selectedProvider === provider.name}
                  onChange={(event) => setSelectedProvider(event.target.value)}
                />
                <span>{provider.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className='settings-fieldset'>
          <legend>{t('language')}</legend>
          <div className='provider-options language-options'>
            {languageOptions.map((option) => (
              <label className='language-option' key={option.value}>
                <input
                  type='radio'
                  name='language'
                  value={option.value}
                  checked={selectedLanguage === option.value}
                  onChange={(event) => setSelectedLanguage(event.target.value as Language)}
                />
                <span className='language-option-content'>
                  <span className='language-option-flag' aria-hidden='true'>
                    {option.flag}
                  </span>
                  <span>{option.label}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className='settings-fieldset'>
          <legend>{t('units')}</legend>
          <div className='provider-options'>
            <p className='settings-option-label'>{t('temperatureUnit')}</p>
            {temperatureUnitOptions.map((option) => (
              <label className='provider-option' key={option.value}>
                <input
                  type='radio'
                  name='temperature-unit'
                  value={option.value}
                  checked={selectedTemperatureUnit === option.value}
                  onChange={(event) =>
                    setSelectedTemperatureUnit(event.target.value as TemperatureUnit)
                  }
                />
                <span>{t(option.labelKey)}</span>
              </label>
            ))}
          </div>
          <div className='provider-options'>
            <p className='settings-option-label'>{t('windUnit')}</p>
            {windUnitOptions.map((option) => (
              <label className='provider-option' key={option.value}>
                <input
                  type='radio'
                  name='wind-unit'
                  value={option.value}
                  checked={selectedWindUnit === option.value}
                  onChange={(event) => setSelectedWindUnit(event.target.value as WindUnit)}
                />
                <span>{t(option.labelKey)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type='submit' className='settings-save-button'>
          {t('save')}
        </button>
      </form>
    </div>
  )
}
