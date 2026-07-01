import { StatProgressList, type StatProgressItem } from '../../components/molecules/StatProgressList'

const kpis = [
  { label: 'Siniestros totales', value: '2,418', delta: '+186 este mes' },
  { label: 'Usuarios activos', value: '347', delta: '+12 esta semana' },
  { label: 'Talleres registrados', value: '58', delta: '3 pendientes' },
  { label: 'Aseguradoras', value: '4', delta: '100% activas' },
]

const statusProgress: StatProgressItem[] = [
  { label: 'Reportado Preliminar', count: 845, color: '#94a3b8' },
  { label: 'Asignado a Ajustador', count: 623, color: '#3b82f6' },
  { label: 'Peritaje Validado', count: 412, color: '#f59e0b' },
  { label: 'Asignado a Taller', count: 318, color: '#f97316' },
  { label: 'Trabajo Concluido', count: 220, color: '#22c55e' },
]

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const currentMonth = new Date().getMonth()

export function PanelGlobalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Panel Global</h1>
          <p className="text-sm text-neutral-500 mt-1">Resumen del sistema · 4 aseguradoras activas</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            Exportar
          </button>
          <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-admin-500 rounded-lg hover:bg-admin-600 transition-colors">
            + Nueva aseguradora
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
            <p className="text-sm text-neutral-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{kpi.value}</p>
            <p className="text-xs text-admin-500 mt-1">{kpi.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Siniestros por mes</h2>
          <div className="h-48 flex items-end gap-2">
            {months.map((month, i) => {
              const value = Math.floor(Math.random() * 200) + 50
              const height = (value / 300) * 100
              const isCurrent = i === currentMonth
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md transition-all ${isCurrent ? 'bg-admin-500' : 'bg-primary-300'}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-neutral-400">{month}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Por estatus siniestro</h2>
          <StatProgressList items={statusProgress} />
        </div>
      </div>
    </div>
  )
}
