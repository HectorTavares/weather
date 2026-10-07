export function MainHeader() {
  return (
    <div className='design-setting-container'>
      <a className='design' target='_blank' href='https://dribbble.com/thearthurk'>
        design by Arthur K
      </a>
      <button onClick={() => console.log('Abriu as config')} className='settings-button'>
        <img
          className='settings-icon'
          src='/settings.svg'
          alt='settings button'
          width={50}
          height={50}
          loading='lazy'
          decoding='async'
        />
      </button>
    </div>
  )
}
