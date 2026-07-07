import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getAll as getIncidentes } from '../../api/aseguradora/siniestros/siniestros.routes'
import type { Incidente } from '../../api/aseguradora/siniestros/siniestros.schemas'

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En Progreso',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#6b7280']

const PLAN_DATA = {
  consumo: { usado: 45, total: 100, label: 'Consultas mensuales' },
  plan: { nombre: 'Empresarial', costo: '$2,500.00', proximoPago: '31/07/2026' },
  estatus: { texto: 'Activo', desde: '01/01/2026', vence: '31/12/2026' },
}

export function TableroGeneralPage() {
  const [incidentes, setIncidentes] = useState<Incidente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getIncidentes().then((inc) => {
      setIncidentes(inc)
      setIsLoading(false)
    })
  }, [])

  const activos = incidentes.filter((i) => i.estado === 'en_progreso' || i.estado === 'pendiente' || i.estado === 'aprobado').length
  const pendientes = incidentes.filter((i) => i.estado === 'pendiente').length
  const completados = incidentes.filter((i) => i.estado === 'completado').length
  // Peritaje pendiente = siniestro ya asignado a un ajustador pero aún no validado
  // (GET /aseguradora/siniestros no expone el peritaje anidado; se deriva del estatus real).
  const peritajesPendientes = incidentes.filter((i) => i.estatusRaw === 'Asignado_A_Ajustador').length

  const barData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const inc of incidentes) {
      const label = STATUS_LABELS[inc.estado] ?? inc.estado
      counts[label] = (counts[label] ?? 0) + 1
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [incidentes])

  const ultimos = [...incidentes].slice(0, 4)
  const pct = Math.round((PLAN_DATA.consumo.usado / PLAN_DATA.consumo.total) * 100)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Cargando tablero…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tablero General</h1>
        <p className="text-sm text-neutral-500 mt-1">Resumen general de siniestros y actividad del sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Siniestros Activos" value={String(activos)} color="primary" />
        <KpiCard label="Pendientes" value={String(pendientes)} color="warning" />
        <KpiCard label="Completados" value={String(completados)} color="success" />
        <KpiCard label="Peritajes Pendientes" value={String(peritajesPendientes)} color="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Siniestros por Estatus</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 600, color: '#111827' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Plan de Suscripción</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Consumo mensual</span>
                <span className="text-neutral-900 font-medium">{PLAN_DATA.consumo.usado} / {PLAN_DATA.consumo.total}</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-700 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-neutral-400">{PLAN_DATA.consumo.label}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Plan</span>
                <p className="text-base font-semibold text-neutral-900 mt-1">{PLAN_DATA.plan.nombre}</p>
                <p className="text-sm text-neutral-600">{PLAN_DATA.plan.costo} / mes</p>
                <p className="text-xs text-neutral-400 mt-1">Próximo pago: {PLAN_DATA.plan.proximoPago}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Estatus Comercial</span>
                <p className="text-base font-semibold text-success-600 mt-1">{PLAN_DATA.estatus.texto}</p>
                <p className="text-sm text-neutral-600">Desde: {PLAN_DATA.estatus.desde}</p>
                <p className="text-xs text-neutral-400 mt-1">Vence: {PLAN_DATA.estatus.vence}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Últimos Siniestros</h2>
        <div className="flex flex-col gap-3">
          {ultimos.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">No hay siniestros registrados.</p>
          ) : (
            ultimos.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{inc.tipo}</p>
                  <p className="text-xs text-neutral-500">{inc.numero} · {inc.fecha}</p>
                </div>
                <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
                  {STATUS_LABELS[inc.estado] ?? inc.estado}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function KpiCard({ label, value, color }: { label: string; value: string; color: 'primary' | 'warning' | 'success' | 'neutral' }) {
  const colorMap = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-600', dot: 'bg-warning-500' },
    success: { bg: 'bg-success-50', text: 'text-success-600', dot: 'bg-success-500' },
    neutral: { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-500' },
  }

  const c = colorMap[color]

  return (
    <div className={`${c.bg} rounded-xl border border-neutral-200 p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} aria-hidden="true" />
        <span className={`text-xs font-medium ${c.text}`}>{label}</span>
      </div>
      <p className="text-3xl font-bold text-neutral-900">{value}</p>
    </div>
  )
}
