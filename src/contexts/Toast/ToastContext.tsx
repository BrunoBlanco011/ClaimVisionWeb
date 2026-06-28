import { createContext } from 'react'
import type { ToastType } from '../../components/atoms/Toast/Toast'

export interface ToastContextValue {
  addToast: (type: ToastType, message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
