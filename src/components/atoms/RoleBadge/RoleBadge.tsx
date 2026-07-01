export type RoleVariant =
  | 'Administrador_Global'
  | 'Operador_Aseguradora'
  | 'Ajustador'
  | 'Operador_Taller'
  | 'Cliente'

export type RoleBadgeSize = 'sm' | 'md'

export interface RoleBadgeProps {
  variant: RoleVariant
  size?: RoleBadgeSize
  className?: string
}

const variantClasses: Record<RoleVariant, string> = {
  Administrador_Global: 'bg-indigo-50 text-indigo-700 border-indigo-300',
  Operador_Aseguradora: 'bg-primary-50 text-primary-700 border-primary-300',
  Ajustador:            'bg-amber-50 text-amber-700 border-amber-300',
  Operador_Taller:      'bg-success-50 text-success-600 border-success-300',
  Cliente:              'bg-neutral-100 text-neutral-500 border-neutral-300',
}

const labels: Record<RoleVariant, string> = {
  Administrador_Global: 'Administrador Global',
  Operador_Aseguradora: 'Operador Aseguradora',
  Ajustador:            'Ajustador',
  Operador_Taller:      'Operador Taller',
  Cliente:              'Cliente',
}

const sizeClasses: Record<RoleBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function RoleBadge({ variant, size = 'sm', className = '' }: RoleBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-medium border',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {labels[variant]}
    </span>
  )
}
