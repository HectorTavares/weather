import React from 'react'
import { useTranslation } from '@/i18n'

interface SearchCityFormProps {
  city: string
  cityOptions: string[]
  onCityChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCitySelect: (city: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function SearchCityForm({
  city,
  cityOptions,
  onCityChange,
  onCitySelect,
  onSubmit,
}: SearchCityFormProps) {
  const { t } = useTranslation()

  return (
    <form className='form' onSubmit={onSubmit}>
      <div className='form-top'>
        <input
          className='form-input'
          value={city}
          onChange={onCityChange}
          type='text'
          placeholder={t('anotherLocation')}
        />
        <button className='submit-button' type='submit'>
          <img
            className='submit-icon'
            src='/search.svg'
            alt={t('search')}
            width={50}
            height={50}
            loading='lazy'
            decoding='async'
          />
        </button>
      </div>

      <div className='searchCities'>
        {cityOptions.map((searchCity) => (
          <button
            type='button'
            className='searchCity-option '
            key={searchCity}
            onClick={() => onCitySelect(searchCity)}
          >
            {searchCity}
          </button>
        ))}
      </div>
    </form>
  )
}
