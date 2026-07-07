import { useState, useEffect } from 'react'
import { ActionBadge, type ActionVariant } from '../../components/atoms/ActionBadge'
import { RoleBadge, type RoleVariant } from '../../components/atoms/RoleBadge'
import { getAll as getAdminAuditoria } from '../../api/admin/auditoria/auditoria.routes'

interface EventoRow {
  id: string
  fechaHora: string
  usuario: string
  rolUsuario: RoleVariant
  accion: ActionVariant
  tablaAfectada: string
  detalle: string
  ip?: string
}

const ACCIONES = ['Todas', 'UPDATE', 'ASSIGN', 'CREATE', 'DELETE', 'LOGIN'] as const
const TABLAS = ['Todas las tablas', 'usuarios', 'incidentes', 'peritajes', 'aseguradoras', 'presupuestos']
const ROLES = ['Todos los roles', 'Administrador_Global', 'Operador_Aseguradora', 'Ajustador', 'Operador_Taller', 'Cliente'] as const

export function AuditoriaSistemaPage() {
  const [eventos, setEventos] = useState<EventoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [accionFilter, setAccionFilter] = useState('Todas')

  const load = async (p: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminAuditoria(p, 20)
      setEventos(res.items)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar auditoría')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [])

  const filtered = eventos.filter((e) => {
    if (search && !e.usuario.toLowerCase().includes(search.toLowerCase()) && !e.tablaAfectada.toLowerCase().includes(search.toLowerCase()) && !e.id.toLowerCase().includes(search.toLowerCase())) return false
    if (accionFilter !== 'Todas' && e.accion !== accionFilter) return false
    return true
  })

  const kpis = [
    { label: 'Eventos (30d)', value: loading ? '...' : String(eventos.length), delta: 'Últimos registros' },
    { label: 'Accesos', value: String(eventos.filter((e) => e.accion === 'LOGIN').length), delta: 'eventos de login' },
    { label: 'Cambios', value: String(eventos.filter((e) => e.accion === 'UPDATE' || e.accion === 'DELETE').length), delta: 'UPDATE / DELETE' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Auditoría del Sistema</h1>
          <p className="text-sm text-neutral-500 mt-1">Registro inmutable de eventos · últimos 30 días</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            Rango de fechas
          </button>
          <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-admin-500 rounded-lg hover:bg-admin-600 transition-colors">
            Descargar CSV
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

      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por usuario, entidad o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
        <select value={accionFilter} onChange={(e) => setAccionFilter(e.target.value)} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          {ACCIONES.map((a) => <option key={a}>{a === 'Todas' ? 'Todas las acciones' : a}</option>)}
        </select>
        <select className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          {TABLAS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Registro de eventos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">Fecha y hora</th>
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">accion</th>
                <th className="px-5 py-3 font-medium">tabla_afectada</th>
                <th className="px-5 py-3 font-medium">Detalle</th>
                <th className="px-5 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-400">Cargando eventos...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-400">No se encontraron eventos</td></tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 text-neutral-500 whitespace-nowrap">{e.fechaHora}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900">{e.usuario}</span>
                        <RoleBadge variant={e.rolUsuario} size="sm" />
                      </div>
                    </td>
                    <td className="px-5 py-3"><ActionBadge variant={e.accion} /></td>
                    <td className="px-5 py-3 text-neutral-500">{e.tablaAfectada}</td>
                    <td className="px-5 py-3 text-neutral-500 max-w-xs truncate">{e.detalle}</td>
                    <td className="px-5 py-3 text-neutral-400">{e.ip ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => load(page - 1)}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50"
          >
            Anterior
          </button>
          <span className="text-sm text-neutral-500">Página {page} de {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => load(page + 1)}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
