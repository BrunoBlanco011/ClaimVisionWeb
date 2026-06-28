import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export function Input({ hasError = false, className = '', ...props }: InputProps) {
  return (
    <input
      className={[
        'w-full rounded-md border px-3 py-2.5',
        'text-neutral-900 placeholder-neutral-400',
        'bg-white',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        hasError
          ? 'border-error-500 focus:ring-error-500'
          : 'border-neutral-300 focus:ring-primary-600 focus:border-primary-600',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
