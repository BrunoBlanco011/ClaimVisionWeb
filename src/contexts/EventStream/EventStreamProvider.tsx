import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { EventStreamContext, type EventStreamStatus, type EventStreamHandler } from './EventStreamContext'
import { useAuth } from '../useAuth'
import { API_BASE_URL } from '../../api/client'

interface Subscription {
  eventNames: string[]
  handler: EventStreamHandler
}

const RECONNECT_DELAY_MS = 3000

// El backend expone SSE en /events/stream, pero la autenticación por query
// param (`?token=`) documentada para EventSource nativo no funciona (confirmado
// contra el backend real: siempre devuelve 401). Solo el header `Authorization`
// funciona, así que consumimos el stream a mano con fetch + ReadableStream en
// vez de la API EventSource (que no puede mandar headers custom).
function parseSseBlock(rawBlock: string): { eventName: string; data: string } | null {
  let eventName = 'message'
  const dataLines: string[] = []
  for (const line of rawBlock.split('\n')) {
    if (!line || line.startsWith(':')) continue
    if (line.startsWith('event:')) eventName = line.slice(6).trim()
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
  }
  if (dataLines.length === 0) return null
  return { eventName, data: dataLines.join('\n') }
}

export function EventStreamProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [status, setStatus] = useState<EventStreamStatus>('closed')
  const subscribersRef = useRef<Set<Subscription>>(new Set())

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus('closed')
      return
    }

    let cancelled = false
    let abortController: AbortController | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    const dispatch = (eventName: string, rawData: string) => {
      let parsed: unknown = rawData
      try {
        parsed = JSON.parse(rawData)
      } catch {
        // deja el dato crudo si no es JSON (p. ej. ": ping" ya se filtra antes de llegar aquí)
      }
      subscribersRef.current.forEach((sub) => {
        if (sub.eventNames.includes(eventName)) sub.handler(parsed)
      })
    }

    const connect = async () => {
      const token = localStorage.getItem('claimvision_token')
      if (!token) return
      abortController = new AbortController()
      setStatus((s) => (s === 'open' ? s : 'connecting'))

      try {
        const res = await fetch(`${API_BASE_URL}/events/stream`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
          signal: abortController.signal,
        })
        if (!res.ok || !res.body) throw new Error(`SSE HTTP ${res.status}`)

        if (cancelled) return
        setStatus('open')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!cancelled) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let sepIndex = buffer.indexOf('\n\n')
          while (sepIndex !== -1) {
            const rawBlock = buffer.slice(0, sepIndex)
            buffer = buffer.slice(sepIndex + 2)
            const parsed = parseSseBlock(rawBlock)
            if (parsed) dispatch(parsed.eventName, parsed.data)
            sepIndex = buffer.indexOf('\n\n')
          }
        }
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) return
      }

      if (!cancelled) {
        setStatus('error')
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      cancelled = true
      abortController?.abort()
      if (reconnectTimer) clearTimeout(reconnectTimer)
      setStatus('closed')
    }
  }, [isAuthenticated])

  const subscribe = useCallback((eventNames: string[], handler: EventStreamHandler) => {
    const sub: Subscription = { eventNames, handler }
    subscribersRef.current.add(sub)
    return () => {
      subscribersRef.current.delete(sub)
    }
  }, [])

  return <EventStreamContext.Provider value={{ status, subscribe }}>{children}</EventStreamContext.Provider>
}
