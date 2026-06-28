import type { LabelHTMLAttributes } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ required = false, children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={[
        'block text-sm font-medium text-neutral-700',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-error-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}
