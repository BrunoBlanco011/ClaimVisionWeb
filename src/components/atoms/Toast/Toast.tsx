import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  message: string
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const styles: Record<ToastType, string> = {
  success: 'bg-success-50 text-success-700 border-success-300',
  error: 'bg-error-50 text-error-700 border-error-300',
  warning: 'bg-warning-50 text-warning-700 border-warning-300',
  info: 'bg-primary-50 text-primary-700 border-primary-300',
}

export function Toast({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium animate-slide-in ${styles[toast.type]}`}
      role="alert"
    >
      <span className="text-base shrink-0">{icons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity shrink-0"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  )
}
