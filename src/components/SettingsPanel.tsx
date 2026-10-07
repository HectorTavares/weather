import { FormEvent, useState } from 'react'
import {
  getWeatherProviderPriority,
  setWeatherProviderPriority,
  weatherProviderOptions,
} from '@/services/weather'

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
  const [selectedProvider, setSelectedProvider] = useState(getWeatherProviderPriority()[0])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWeatherProviderPriority(selectedProvider)
    onProviderPriorityChange()
    onClose()
  }

  return (
    <div className='settings-panel-backdrop'>
      <form className='settings-panel' onSubmit={handleSubmit}>
        <div className='settings-panel-header'>
          <h2>Settings</h2>
          <button type='button' className='settings-close-button' onClick={onClose}>
            X
          </button>
        </div>

        <fieldset className='settings-fieldset'>
          <legend>Primary weather API</legend>
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

        <button type='submit' className='settings-save-button'>
          Save
        </button>
      </form>
    </div>
  )
}
