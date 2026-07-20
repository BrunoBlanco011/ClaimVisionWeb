import { useEffect, useRef } from 'react'
import { useEventStream } from './useEventStream'

const DEBOUNCE_MS = 400

// Suscribe una página/lista a uno o más eventos SSE y llama `onEvent` (con
// debounce, para que una ráfaga de eventos dispare un solo refetch) cada vez
// que llegue alguno. `onEvent` no necesita ser estable entre renders.
export function useLiveRefresh(eventNames: string[], onEvent: (data: unknown) => void) {
  const { subscribe } = useEventStream()
  const handlerRef = useRef(onEvent)
  handlerRef.current = onEvent

  const eventKey = eventNames.join(',')

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const unsubscribe = subscribe(eventKey.split(','), (data) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => handlerRef.current(data), DEBOUNCE_MS)
    })
    return () => {
      if (timer) clearTimeout(timer)
      unsubscribe()
    }
    // eventKey ya representa la identidad real de eventNames; subscribe es estable (useCallback en el provider).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventKey])
}
