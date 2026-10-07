import { useTranslation } from '@/i18n'

export function LoadingOverlay() {
  const { t } = useTranslation()

  return (
    <div className='loader-container'>
      <div className='loader'>
        <p className='loading'>{t('loading')}</p>
      </div>
    </div>
  )
}
