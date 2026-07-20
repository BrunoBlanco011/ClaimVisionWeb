import { createContext } from 'react'

export type EventStreamStatus = 'connecting' | 'open' | 'error' | 'closed'
export type EventStreamHandler = (data: unknown) => void

export interface EventStreamState {
  status: EventStreamStatus
  subscribe: (eventNames: string[], handler: EventStreamHandler) => () => void
}

export const EventStreamContext = createContext<EventStreamState | null>(null)
