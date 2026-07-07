import type { StatusVariant } from '../../../api/shared/status'
export type { StatusVariant }

export type StatusSize = 'sm' | 'md'

export interface StatusBadgeProps {
  variant: StatusVariant
  size?: StatusSize
  className?: string
}

const variantClasses: Record<StatusVariant, string> = {
  pendiente:    'bg-warning-50 text-warning-600 border-warning-500',
  aprobado:     'bg-success-50 text-success-600 border-success-500',
  rechazado:    'bg-error-50  text-error-600  border-error-500',
  en_progreso:  'bg-primary-50  text-primary-600  border-primary-500',
  completado:   'bg-success-50 text-success-600 border-success-500',
  cancelado:    'bg-neutral-100 text-neutral-500 border-neutral-300',
}

const labels: Record<StatusVariant, string> = {
  pendiente:    'Pendiente',
  aprobado:     'Aprobado',
  rechazado:    'Rechazado',
  en_progreso:  'En Progreso',
  completado:   'Completado',
  cancelado:    'Cancelado',
}

const sizeClasses: Record<StatusSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function StatusBadge({ variant, size = 'sm', className = '' }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-medium border',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />
      {labels[variant]}
    </span>
  )
}
