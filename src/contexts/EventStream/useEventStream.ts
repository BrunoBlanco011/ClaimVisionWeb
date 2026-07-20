import { useContext } from 'react'
import { EventStreamContext } from './EventStreamContext'

export function useEventStream() {
  const ctx = useContext(EventStreamContext)
  if (!ctx) throw new Error('useEventStream debe usarse dentro de un EventStreamProvider')
  return ctx
}
