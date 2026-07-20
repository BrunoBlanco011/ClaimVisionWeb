import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export function Input({ hasError = false, className = '', ...props }: InputProps) {
  return (
    <input
      className={[
        'w-full rounded-lg border px-3 py-2.5',
        'text-neutral-900 placeholder-neutral-400',
        'bg-white shadow-sm',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        hasError
          ? 'border-error-500 focus:ring-error-500'
          : 'border-neutral-300 hover:border-neutral-400 focus:ring-primary-600 focus:border-primary-600',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:hover:border-neutral-300',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
