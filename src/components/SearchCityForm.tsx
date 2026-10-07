import React from 'react'

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
  return (
    <form className='form' onSubmit={onSubmit}>
      <div className='form-top'>
        <input
          className='form-input'
          value={city}
          onChange={onCityChange}
          type='text'
          placeholder='Another Location'
        />
        <button className='submit-button' type='submit'>
          <img
            className='submit-icon'
            src='/search.svg'
            alt='search button'
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
