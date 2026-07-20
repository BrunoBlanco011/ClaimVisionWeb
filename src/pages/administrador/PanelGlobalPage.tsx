import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatProgressList, type StatProgressItem } from '../../components/molecules/StatProgressList'
import { CountUp } from '../../components/atoms/CountUp'
import { getResumen } from '../../api/admin/dashboard/dashboard.routes'
import { getErrorMessage } from '../../api/errors'
import { useLiveRefresh } from '../../contexts/EventStream'
import type { DashboardResumenDTO } from '../../api/admin/dashboard/dashboard.schemas'

const STATUS_COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#f97316', '#22c55e', '#ef4444', '#8b5cf6', '#6b7280']

const LIVE_EVENTS = [
  'siniestro_created', 'siniestro_updated',
  'cliente_created', 'ajustador_created', 'taller_created', 'vehiculo_created',
]

export function PanelGlobalPage() {
  const [resumen, setResumen] = useState<DashboardResumenDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = (silent = false) => {
    if (!silent) setIsLoading(true)
    getResumen()
      .then((r) => {
        setResumen(r)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Error al cargar el panel global'))
        setIsLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  useLiveRefresh(LIVE_EVENTS, () => load(true))

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    )
  }

  if (isLoading || !resumen) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Cargando panel…</p>
      </div>
    )
  }

  const kpis = [
    { label: 'Siniestros totales', value: resumen.total_siniestros },
    { label: 'Usuarios activos', value: resumen.usuarios_activos },
    { label: 'Talleres registrados', value: resumen.total_talleres, delta: `${resumen.talleres_pendientes} pendientes` },
    { label: 'Aseguradoras', value: resumen.total_aseguradoras, delta: `${resumen.aseguradoras_activas} activas` },
  ]

  const statusProgress: StatProgressItem[] = resumen.siniestros_por_estatus.map((s, i) => ({
    label: s.estatus,
    count: s.count,
    color: STATUS_COLORS[i % STATUS_COLORS.length],
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Panel Global</h1>
        <p className="text-sm text-neutral-500 mt-1">Resumen del sistema · {resumen.aseguradoras_activas} aseguradoras activas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-sm text-neutral-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1"><CountUp value={kpi.value} /></p>
            {kpi.delta && <p className="text-xs text-amber-600 mt-1">{kpi.delta}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Siniestros por mes</h2>
          {resumen.siniestros_por_mes.length === 0 ? (
            <p className="text-sm text-neutral-400 italic py-8 text-center">No hay datos suficientes.</p>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumen.siniestros_por_mes} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#245394" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Por estatus siniestro</h2>
          {statusProgress.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">No hay datos suficientes.</p>
          ) : (
            <StatProgressList items={statusProgress} />
          )}
        </div>
      </div>
    </div>
  )
}
