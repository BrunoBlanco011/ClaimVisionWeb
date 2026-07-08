import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatProgressList, type StatProgressItem } from '../../components/molecules/StatProgressList'
import { getResumen } from '../../api/admin/dashboard/dashboard.routes'
import type { DashboardResumenDTO } from '../../api/admin/dashboard/dashboard.schemas'

const STATUS_COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#f97316', '#22c55e', '#ef4444', '#8b5cf6', '#6b7280']

export function PanelGlobalPage() {
  const [resumen, setResumen] = useState<DashboardResumenDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getResumen().then((r) => {
      setResumen(r)
      setIsLoading(false)
    })
  }, [])

  if (isLoading || !resumen) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Cargando panel…</p>
      </div>
    )
  }

  const kpis = [
    { label: 'Siniestros totales', value: String(resumen.total_siniestros) },
    { label: 'Usuarios activos', value: String(resumen.usuarios_activos) },
    { label: 'Talleres registrados', value: String(resumen.total_talleres), delta: `${resumen.talleres_pendientes} pendientes` },
    { label: 'Aseguradoras', value: String(resumen.total_aseguradoras), delta: `${resumen.aseguradoras_activas} activas` },
  ]

  const statusProgress: StatProgressItem[] = resumen.siniestros_por_estatus.map((s, i) => ({
    label: s.estatus,
    count: s.count,
    color: STATUS_COLORS[i % STATUS_COLORS.length],
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Panel Global</h1>
          <p className="text-sm text-neutral-500 mt-1">Resumen del sistema · {resumen.aseguradoras_activas} aseguradoras activas</p>
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
            {kpi.delta && <p className="text-xs text-admin-500 mt-1">{kpi.delta}</p>}
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
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={48} />
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
