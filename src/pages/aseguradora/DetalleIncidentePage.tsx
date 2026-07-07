import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StatusBadge } from '../../components/atoms/StatusBadge'
import {
  getById as getIncidenteById,
  assignAjustador,
  assignTaller,
  autorizarEntrega,
  aprobarCotizacion,
  rechazarCotizacion,
} from '../../api/aseguradora/siniestros/siniestros.routes'
import { getAll as getAjustadores } from '../../api/aseguradora/ajustadores/ajustadores.routes'
import { getAll as getTalleres } from '../../api/aseguradora/talleres/talleres.routes'
import { useToast } from '../../contexts/Toast'
import type { IncidenteDetalle, TimelineEvent } from '../../api/aseguradora/siniestros/siniestros.schemas'
import type { Ajustador } from '../../api/aseguradora/ajustadores/ajustadores.schemas'
import type { Taller } from '../../api/aseguradora/talleres/talleres.schemas'

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const peritajeEstadoLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
}

const peritajeEstadoColor: Record<string, string> = {
  pendiente: 'bg-warning-50 text-warning-600',
  aprobado: 'bg-success-50 text-success-600',
  rechazado: 'bg-error-50 text-error-600',
}

export function DetalleIncidentePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const id = searchParams.get('id') ?? '1'

  const [incidente, setIncidente] = useState<IncidenteDetalle | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [ajustadores, setAjustadores] = useState<Ajustador[]>([])
  const [ajustadorId, setAjustadorId] = useState('')
  const [assigningAjustador, setAssigningAjustador] = useState(false)

  const [talleres, setTalleres] = useState<Taller[]>([])
  const [tallerId, setTallerId] = useState('')
  const [assigningTaller, setAssigningTaller] = useState(false)

  const [processingEntrega, setProcessingEntrega] = useState(false)
  const [processingCotizacion, setProcessingCotizacion] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setNotFound(false)
    Promise.all([
      getIncidenteById(id),
      getAjustadores(),
      getTalleres(),
    ])
      .then(([incResult, ajustResult, tallResult]) => {
        setIncidente(incResult.incidente)
        setEvents(incResult.timeline)
        setAjustadores(ajustResult)
        setTalleres(tallResult)
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false))
  }, [id])

  const handleAssignAjustador = async () => {
    if (!ajustadorId) return
    setAssigningAjustador(true)
    try {
      await assignAjustador(id, ajustadorId)
      addToast('success', 'Ajustador asignado correctamente')
      setAjustadorId('')
      await refreshIncidente()
    } catch {
      addToast('error', 'Error al asignar ajustador')
    } finally {
      setAssigningAjustador(false)
    }
  }

  const handleAssignTaller = async () => {
    if (!tallerId) return
    setAssigningTaller(true)
    try {
      await assignTaller(id, tallerId)
      addToast('success', 'Taller asignado correctamente')
      setTallerId('')
      await refreshIncidente()
    } catch {
      addToast('error', 'Error al asignar taller')
    } finally {
      setAssigningTaller(false)
    }
  }

  const refreshIncidente = async () => {
    const incResult = await getIncidenteById(id)
    setIncidente(incResult.incidente)
    setEvents(incResult.timeline)
  }

  const handleAutorizarEntrega = async () => {
    setProcessingEntrega(true)
    try {
      await autorizarEntrega(id)
      addToast('success', 'Entrega autorizada correctamente')
      await refreshIncidente()
    } catch {
      addToast('error', 'Error al autorizar la entrega')
    } finally {
      setProcessingEntrega(false)
    }
  }

  const handleAprobarCotizacion = async () => {
    if (!incidente?.cotizacionId) return
    setProcessingCotizacion(true)
    try {
      await aprobarCotizacion(incidente.cotizacionId)
      addToast('success', 'Cotización aprobada correctamente')
      await refreshIncidente()
    } catch {
      addToast('error', 'Error al aprobar la cotización')
    } finally {
      setProcessingCotizacion(false)
    }
  }

  const handleRechazarCotizacion = async () => {
    if (!incidente?.cotizacionId) return
    setProcessingCotizacion(true)
    try {
      await rechazarCotizacion(incidente.cotizacionId)
      addToast('success', 'Cotización rechazada')
      await refreshIncidente()
    } catch {
      addToast('error', 'Error al rechazar la cotización')
    } finally {
      setProcessingCotizacion(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Cargando incidente…</p>
      </div>
    )
  }

  if (notFound || !incidente) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Incidente no encontrado</p>
        <button type="button" onClick={() => navigate('/aseguradora/incidentes')} className="mt-4 text-sm text-primary-700 hover:text-primary-600 underline">
          Volver a la bandeja
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/aseguradora/incidentes')} className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{incidente.numero}</h1>
          <p className="text-sm text-neutral-500">{incidente.tipo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Información General</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="N° Incidente" value={incidente.numero} />
              <Field label="Estado" value={<StatusBadge variant={incidente.estado} size="sm" />} />
              <Field label="Tipo" value={incidente.tipo} />
              <Field label="Prioridad" value={incidente.prioridad} />
              <Field label="Fecha de Reporte" value={incidente.fecha} />
              <Field label="Aseguradora" value={incidente.aseguradora} />
              <Field label="Asegurado" value={incidente.asegurado} />
              <Field label="Vehículo" value={incidente.vehiculo} />
              <Field label="Placa" value={incidente.placa} />
              <Field label="Taller Asignado" value={incidente.taller || '—'} />
              <Field label="Ajustador" value={incidente.ajustadorAsignado || '—'} />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Descripción</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">{incidente.descripcion}</p>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Evidencias Fotográficas</h2>
            {incidente.evidencias.length === 0 ? (
              <p className="text-sm text-neutral-400 italic">No hay evidencias registradas para este incidente.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {incidente.evidencias.map((ev) => (
                  <a key={ev.id} href={ev.url} target="_blank" rel="noopener noreferrer" className="group block bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden hover:border-primary-300 hover:shadow-sm transition-all">
                    <div className="aspect-[4/3] bg-neutral-100">
                      <img src={ev.url} alt={ev.descripcion} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="text-xs text-neutral-600 truncate">{ev.descripcion}</p>
                      <p className="text-[10px] text-neutral-400">{ev.fecha}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          {incidente.peritaje && (
            <section className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Estimado del Peritaje</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Field label="Ajustador" value={incidente.peritaje.ajustador} />
                  <Field label="Fecha del peritaje" value={incidente.peritaje.fecha} />
                  <Field label="Estado" value={
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${peritajeEstadoColor[incidente.peritaje.estado] ?? 'bg-neutral-100 text-neutral-600'}`}>
                      {peritajeEstadoLabel[incidente.peritaje.estado] ?? incidente.peritaje.estado}
                    </span>
                  } />
                  <Field label="Monto estimado" value={<span className="font-semibold text-lg text-neutral-900">{formatCurrency(incidente.peritaje.montoEstimado)}</span>} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Descripción</span>
                  <p className="text-sm text-neutral-700 leading-relaxed">{incidente.peritaje.descripcion}</p>
                </div>
              </div>
            </section>
          )}

          {incidente.cotizacionId && incidente.cotizacionEstatus === 'Pendiente_Aprobacion' && (
            <section className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cotización del Taller</h2>
              <p className="text-sm text-neutral-500 mb-4">La cotización enviada por el taller está pendiente de aprobación.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={processingCotizacion}
                  onClick={handleAprobarCotizacion}
                  className="px-4 py-2 bg-success-600 text-white text-sm font-medium rounded-md hover:bg-success-700 transition-colors disabled:opacity-50"
                >
                  {processingCotizacion ? 'Procesando…' : 'Aprobar Cotización'}
                </button>
                <button
                  type="button"
                  disabled={processingCotizacion}
                  onClick={handleRechazarCotizacion}
                  className="px-4 py-2 bg-error-600 text-white text-sm font-medium rounded-md hover:bg-error-700 transition-colors disabled:opacity-50"
                >
                  {processingCotizacion ? 'Procesando…' : 'Rechazar Cotización'}
                </button>
              </div>
            </section>
          )}

          {incidente.estatusRaw === 'Listo_Para_Entrega' && (
            <section className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Entrega del Vehículo</h2>
              <p className="text-sm text-neutral-500 mb-4">El vehículo está listo para entrega al asegurado.</p>
              <button
                type="button"
                disabled={processingEntrega}
                onClick={handleAutorizarEntrega}
                className="px-4 py-2 bg-primary-800 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {processingEntrega ? 'Procesando…' : 'Autorizar Entrega'}
              </button>
            </section>
          )}

          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Asignar Ajustador</h2>
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">Ajustador</label>
                <select
                  value={ajustadorId}
                  onChange={(e) => setAjustadorId(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Seleccionar ajustador…</option>
                  {ajustadores.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre} — {a.especialidad}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={!ajustadorId || assigningAjustador}
                onClick={handleAssignAjustador}
                className="w-full sm:w-auto px-4 py-2 bg-primary-800 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigningAjustador ? 'Asignando…' : 'Asignar'}
              </button>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Asignar Taller</h2>
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">Taller</label>
                <select
                  value={tallerId}
                  onChange={(e) => setTallerId(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Seleccionar taller…</option>
                  {talleres.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre} — {t.direccion}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={!tallerId || assigningTaller}
                onClick={handleAssignTaller}
                className="w-full sm:w-auto px-4 py-2 bg-primary-800 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigningTaller ? 'Asignando…' : 'Asignar'}
              </button>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Línea de Tiempo</h2>
            <div className="flex flex-col gap-0">
              {events.map((evt, i) => (
                <div key={i} className="relative flex items-start gap-3 pb-5 last:pb-0">
                  {i < events.length - 1 && (
                    <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-neutral-200" aria-hidden="true" />
                  )}
                  <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 ${i === 0 ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-white'}`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${i === 0 ? 'text-neutral-900' : 'text-neutral-700'}`}>{evt.evento}</p>
                    <p className="text-xs text-neutral-500">{evt.detalle}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{evt.tiempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-0.5">{label}</dt>
      <dd className="text-sm text-neutral-900">{value}</dd>
    </div>
  )
}
