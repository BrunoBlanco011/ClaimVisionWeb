import { useState, useEffect } from 'react'
import { ActionBadge } from '../../components/atoms/ActionBadge'
import { RoleBadge, type RoleVariant } from '../../components/atoms/RoleBadge'
import { CountUp } from '../../components/atoms/CountUp'
import { getAll as getAdminAuditoria, getDetalle, getResumen, exportCsv } from '../../api/admin/auditoria/auditoria.routes'
import { ACCIONES_AUDITORIA } from '../../api/admin/auditoria/auditoria.schemas'
import { getErrorMessage } from '../../api/errors'
import { useToast } from '../../contexts/Toast'
import type { EventoAuditoria, AuditFiltros, AuditoriaResumenResponse, AuditDetailResponse } from '../../api/admin/auditoria/auditoria.schemas'

type EventoRow = EventoAuditoria

const ROLES: (RoleVariant | '')[] = ['', 'Administrador_Global', 'Operador_Aseguradora', 'Ajustador', 'Operador_Taller', 'Cliente']

const roleLabels: Record<RoleVariant | '', string> = {
  '': 'Todos los roles',
  Administrador_Global: 'Administrador Global',
  Operador_Aseguradora: 'Operador Aseguradora',
  Ajustador: 'Ajustador',
  Operador_Taller: 'Operador Taller',
  Cliente: 'Cliente',
}

function labelizeAccion(accion: string): string {
  const texto = accion.replace(/_/g, ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function AuditoriaSistemaPage() {
  const { addToast } = useToast()
  const [eventos, setEventos] = useState<EventoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [accionFilter, setAccionFilter] = useState('')
  const [moduloFilter, setModuloFilter] = useState('')
  const [rolFilter, setRolFilter] = useState<RoleVariant | ''>('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [exporting, setExporting] = useState(false)

  const [resumen, setResumen] = useState<AuditoriaResumenResponse | null>(null)
  const [resumenLoading, setResumenLoading] = useState(true)

  const [selected, setSelected] = useState<AuditDetailResponse | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const currentFiltros = (): AuditFiltros => ({
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
    accion: accionFilter || undefined,
    modulo: moduloFilter || undefined,
    rol: rolFilter || undefined,
  })

  const load = async (p: number, filtros: AuditFiltros) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminAuditoria(p, 20, filtros)
      setEventos(res.items)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch (err) {
      setError(getErrorMessage(err, 'Error al cargar auditoría'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1, {})
    getResumen(30)
      .then(setResumen)
      .catch(() => setResumen(null))
      .finally(() => setResumenLoading(false))
  }, [])

  const applyFilter = (overrides: Partial<AuditFiltros>) => {
    load(1, { ...currentFiltros(), ...overrides })
  }

  const matchesSearch = (e: EventoRow) => {
    if (!search) return true
    const q = search.toLowerCase()
    return e.usuario.toLowerCase().includes(q) || e.tablaAfectada.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
  }

  const filtered = eventos.filter(matchesSearch)
  const hasDateFilter = fechaInicio || fechaFin

  const kpis = [
    { label: `Eventos (${resumen?.dias ?? 30}d)`, value: resumen?.total_eventos ?? 0, delta: 'Total del período' },
    { label: 'Accesos', value: resumen?.accesos_login ?? 0, delta: 'inicios de sesión' },
    { label: 'Cambios de config.', value: resumen?.cambios_configuracion ?? 0, delta: 'ajustes de sistema' },
    { label: 'Cambios CRUD', value: resumen?.cambios_CRUD ?? 0, delta: 'crear/editar/eliminar' },
  ]

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportCsv(currentFiltros())
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
      addToast('success', 'CSV generado')
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al generar el CSV'))
    } finally {
      setExporting(false)
    }
  }

  const clearDateFilter = () => {
    setFechaInicio('')
    setFechaFin('')
    load(1, { ...currentFiltros(), fechaInicio: undefined, fechaFin: undefined })
  }

  const openDetalle = async (id: string) => {
    setDetailLoading(true)
    try {
      const detalle = await getDetalle(id)
      setSelected(detalle)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al cargar el detalle del evento'))
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Auditoría del Sistema</h1>
          <p className="text-sm text-neutral-500 mt-1">Registro inmutable de eventos · últimos {resumen?.dias ?? 30} días</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-admin-500 rounded-lg hover:bg-admin-600 transition-colors disabled:opacity-50"
          >
            {exporting ? 'Generando…' : 'Descargar CSV'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-sm text-neutral-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">
              {resumenLoading ? <span className="text-neutral-300">···</span> : <CountUp value={kpi.value} />}
            </p>
            <p className="text-xs text-amber-600 mt-1">{kpi.delta}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar en esta página (usuario, tabla o ID)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
        <select
          value={accionFilter}
          onChange={(e) => { setAccionFilter(e.target.value); applyFilter({ accion: e.target.value || undefined }) }}
          className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
        >
          <option value="">Todas las acciones</option>
          {ACCIONES_AUDITORIA.map((a) => <option key={a} value={a}>{labelizeAccion(a)}</option>)}
        </select>
        <input
          type="text"
          placeholder="Módulo (tabla afectada)..."
          value={moduloFilter}
          onChange={(e) => setModuloFilter(e.target.value)}
          onBlur={() => applyFilter({ modulo: moduloFilter || undefined })}
          onKeyDown={(e) => { if (e.key === 'Enter') applyFilter({ modulo: moduloFilter || undefined }) }}
          className="w-48 px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
        <select
          value={rolFilter}
          onChange={(e) => { const v = e.target.value as RoleVariant | ''; setRolFilter(v); applyFilter({ rol: v || undefined }) }}
          className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
        >
          {ROLES.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => { setFechaInicio(e.target.value); applyFilter({ fechaInicio: e.target.value || undefined }) }}
            className="px-2 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
          />
          <label className="text-xs text-neutral-500">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => { setFechaFin(e.target.value); applyFilter({ fechaFin: e.target.value || undefined }) }}
            className="px-2 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
          />
          {hasDateFilter && (
            <button type="button" onClick={clearDateFilter} className="text-sm text-primary-700 hover:text-primary-600 underline">
              Limpiar fechas
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-neutral-400 -mt-3">
        Los filtros de acción, módulo, rol y fecha se aplican en el servidor. La búsqueda de texto solo filtra la página actual.
      </p>

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
                <th className="px-5 py-3 font-medium">Acción</th>
                <th className="px-5 py-3 font-medium">Módulo</th>
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
                  <tr
                    key={e.id}
                    onClick={() => openDetalle(e.id)}
                    className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 text-neutral-500 whitespace-nowrap">{e.fechaHora}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900 truncate max-w-[10rem]" title={e.usuario}>{e.usuario}</span>
                        <RoleBadge variant={e.rolUsuario} size="sm" />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1">
                        <ActionBadge variant={e.accion} />
                        <span className="text-xs text-neutral-400">{labelizeAccion(e.accionRaw)}</span>
                      </div>
                    </td>
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
            onClick={() => load(page - 1, currentFiltros())}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50"
          >
            Anterior
          </button>
          <span className="text-sm text-neutral-500">Página {page} de {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => load(page + 1, currentFiltros())}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {(selected || detailLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(ev) => { if (ev.target === ev.currentTarget) setSelected(null) }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">Detalle del evento</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {detailLoading || !selected ? (
                <p className="text-sm text-neutral-400 py-6 text-center">Cargando detalle...</p>
              ) : (
                <dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
                  <dt className="text-neutral-500">Usuario</dt>
                  <dd className="col-span-2 text-neutral-900 font-medium">{selected.usuario_nombre ?? selected.usuario_id ?? '—'}</dd>

                  <dt className="text-neutral-500">Correo</dt>
                  <dd className="col-span-2 text-neutral-900">{selected.usuario_email ?? '—'}</dd>

                  <dt className="text-neutral-500">Rol</dt>
                  <dd className="col-span-2"><RoleBadge variant={eventos.find((e) => e.id === selected.id)?.rolUsuario ?? 'Cliente'} size="sm" /></dd>

                  <dt className="text-neutral-500">Acción</dt>
                  <dd className="col-span-2 text-neutral-900">{selected.accion_realizada ? labelizeAccion(selected.accion_realizada) : '—'}</dd>

                  <dt className="text-neutral-500">Módulo</dt>
                  <dd className="col-span-2 text-neutral-900">{selected.evento_modulo ?? '—'}</dd>

                  <dt className="text-neutral-500">Fecha</dt>
                  <dd className="col-span-2 text-neutral-900">{new Date(selected.created_at).toLocaleString('es-MX')}</dd>

                  <dt className="text-neutral-500">IP</dt>
                  <dd className="col-span-2 text-neutral-900">{selected.direccion_ip ?? '—'}</dd>

                  <dt className="text-neutral-500">User agent</dt>
                  <dd className="col-span-2 text-neutral-500 text-xs break-all">{selected.user_agent ?? '—'}</dd>

                  {selected.metadata_context && (
                    <>
                      <dt className="text-neutral-500">Metadata</dt>
                      <dd className="col-span-2">
                        <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
                          {JSON.stringify(selected.metadata_context, null, 2)}
                        </pre>
                      </dd>
                    </>
                  )}
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
