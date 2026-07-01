export type PlanTier = 'Básico' | 'Pro' | 'Enterprise'

export interface InsurerCardProps {
  nombre: string
  rfc: string
  estatus: 'Activa' | 'Inactiva'
  operadores: number
  ajustadores: number
  siniestrosActivos: number
  talleres: number
  plan: PlanTier
  onAdminClick?: () => void
  className?: string
}

const avatarColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
]

function InsurerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const colorIndex = name.length % avatarColors.length
  return (
    <div
      className={`w-10 h-10 rounded-lg ${avatarColors[colorIndex]} text-white flex items-center justify-center text-sm font-bold shrink-0`}
    >
      {initials}
    </div>
  )
}

export function InsurerCard({
  nombre,
  rfc,
  estatus,
  operadores,
  ajustadores,
  siniestrosActivos,
  talleres,
  plan,
  onAdminClick,
  className = '',
}: InsurerCardProps) {
  const isActive = estatus === 'Activa'

  return (
    <div
      className={[
        'bg-white rounded-xl border border-neutral-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <InsurerAvatar name={nombre} />
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">{nombre}</h3>
            <p className="text-xs text-neutral-500">RFC: {rfc}</p>
          </div>
        </div>
        <span
          className={[
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0',
            isActive
              ? 'bg-success-50 text-success-600 border-success-300'
              : 'bg-neutral-100 text-neutral-500 border-neutral-300',
          ].join(' ')}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-success-500' : 'bg-neutral-400'}`} />
          {estatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <MetricBox label="Operadores" value={operadores} />
        <MetricBox label="Ajustadores" value={ajustadores} />
        <MetricBox label="Siniestros activos" value={siniestrosActivos} />
        <MetricBox label="Talleres" value={talleres} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <span className="text-xs font-medium text-neutral-500">
          Plan: <span className="text-neutral-700">{plan}</span>
        </span>
        <button
          type="button"
          onClick={onAdminClick}
          className="text-sm font-medium text-admin-500 hover:text-admin-600 transition-colors"
        >
          Administrar
        </button>
      </div>
    </div>
  )
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-neutral-50 rounded-lg p-2.5">
      <p className="text-lg font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500 truncate">{label}</p>
    </div>
  )
}
