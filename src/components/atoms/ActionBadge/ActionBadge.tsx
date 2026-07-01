import type { ReactNode } from 'react'

export type ActionVariant = 'UPDATE' | 'ASSIGN' | 'CREATE' | 'DELETE' | 'LOGIN'

export type ActionBadgeSize = 'sm' | 'md'

export interface ActionBadgeProps {
  variant: ActionVariant
  size?: ActionBadgeSize
  className?: string
}

const config: Record<ActionVariant, { label: string; classes: string; icon: ReactNode }> = {
  UPDATE: { label: 'UPDATE', classes: 'bg-primary-50 text-primary-700 border-primary-300', icon: null },
  ASSIGN: { label: 'ASSIGN', classes: 'bg-amber-50 text-amber-700 border-amber-300', icon: null },
  CREATE: { label: 'CREATE', classes: 'bg-success-50 text-success-600 border-success-300', icon: null },
  DELETE: { label: 'DELETE', classes: 'bg-error-50 text-error-600 border-error-300', icon: null },
  LOGIN:  { label: 'LOGIN', classes: 'bg-neutral-100 text-neutral-500 border-neutral-300', icon: null },
}

const sizeClasses: Record<ActionBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function ActionBadge({ variant, size = 'sm', className = '' }: ActionBadgeProps) {
  const { label, classes } = config[variant]
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-medium border',
        classes,
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
