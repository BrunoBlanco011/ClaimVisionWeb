import { SearchInput } from '../../molecules/SearchInput'
import { useEventStream } from '../../../contexts/EventStream'

export interface TopBarProps {
  userName?: string
  userRole?: string
  onLogout?: () => void
  showNotifications?: boolean
}

const liveStatusConfig = {
  open: { label: 'En vivo', dot: 'bg-success-500', text: 'text-success-600', pulse: true },
  connecting: { label: 'Conectando…', dot: 'bg-amber-500', text: 'text-amber-600', pulse: true },
  error: { label: 'Reconectando…', dot: 'bg-error-500', text: 'text-error-600', pulse: false },
  closed: { label: 'Sin conexión en vivo', dot: 'bg-neutral-300', text: 'text-neutral-400', pulse: false },
} as const

function LiveStatusIndicator() {
  const { status } = useEventStream()
  const cfg = liveStatusConfig[status]

  return (
    <div
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-50 border border-neutral-200"
      title={cfg.label}
    >
      <span className="relative flex h-2 w-2">
        {cfg.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-60`} aria-hidden="true" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
      </span>
      <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
    </div>
  )
}

export function TopBar({ userName = 'Usuario', userRole, onLogout, showNotifications = true }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 gap-4 shrink-0">
      <div className="flex-1 max-w-md">
        <SearchInput />
      </div>

      <div className="flex items-center gap-4">
        <LiveStatusIndicator />

        {showNotifications && (
          <button
            type="button"
            className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" aria-hidden="true" />
          </button>
        )}

        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-neutral-900">{userName}</span>
            {userRole && <span className="text-xs text-neutral-500 capitalize">{userRole}</span>}
          </div>

          <div className="w-9 h-9 rounded-full bg-primary-800 text-white flex items-center justify-center text-sm font-medium shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Cerrar sesión"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
