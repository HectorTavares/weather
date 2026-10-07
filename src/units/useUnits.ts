import { useContext } from 'react'
import { UnitsContext } from './UnitsContext'

export function useUnits() {
  const context = useContext(UnitsContext)

  if (!context) {
    throw new Error('useUnits must be used within UnitsProvider')
  }

  return context
}
