import { useState, useEffect, useMemo } from 'react'
import { SearchInput } from '../../components/molecules/SearchInput'
import { getEnviados, concluirTrabajo, listoEntrega } from '../../api/taller/cotizaciones/cotizaciones.routes'
import { useToast } from '../../contexts/Toast'
import { getErrorMessage } from '../../api/errors'
import { useLiveRefresh } from '../../contexts/EventStream'
import type { PresupuestoEnviado } from '../../api/taller/cotizaciones/cotizaciones.schemas'

const SINIESTRO_ESTATUS_LABEL: Record<string, string> = {
  Asignado_A_Taller: 'En reparación',
  Trabajo_Concluido: 'Trabajo concluido',
  Listo_Para_Entrega: 'Listo para entrega',
  Entregado: 'Entregado',
}

const ESTATUS_LABEL: Record<string, string> = {
  Pendiente_Aprobacion: 'Pendiente de aprobación',
  Aprobada: 'Aprobada',
  Rechazada: 'Rechazada',
}

const ESTATUS_COLOR: Record<string, string> = {
  Pendiente_Aprobacion: 'bg-warning-50 text-warning-600',
  Aprobada: 'bg-success-50 text-success-600',
  Rechazada: 'bg-error-50 text-error-600',
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function PresupuestosEnviadosPage() {
  const { addToast } = useToast()
  const [data, setData] = useState<PresupuestoEnviado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const load = (silent = false) => {
    if (!silent) setIsLoading(true)
    getEnviados()
      .then((result) => {
        setData(result)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Error al cargar los presupuestos enviados.'))
        setIsLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  useLiveRefresh(['cotizacion_created', 'cotizacion_updated', 'siniestro_updated'], () => load(true))

  const handleConcluirTrabajo = async (item: PresupuestoEnviado) => {
    setProcessingId(item.id)
    try {
      await concluirTrabajo(item.siniestroId)
      addToast('success', 'Trabajo marcado como concluido')
      load()
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al concluir el trabajo'))
    } finally {
      setProcessingId(null)
    }
  }

  const handleListoEntrega = async (item: PresupuestoEnviado) => {
    setProcessingId(item.id)
    try {
      await listoEntrega(item.siniestroId)
      addToast('success', 'Expediente marcado como listo para entrega')
      load()
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al marcar como listo para entrega'))
    } finally {
      setProcessingId(null)
    }
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (!search) return true
      const q = search.toLowerCase()
      return item.numero.toLowerCase().includes(q) || item.vehiculo.toLowerCase().includes(q) || item.placa.toLowerCase().includes(q)
    })
  }, [search, data])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Presupuestos Enviados</h1>
        <p className="text-sm text-neutral-500 mt-1">Cotizaciones enviadas a la aseguradora y su estatus de aprobación.</p>
      </div>

      <div className="w-full sm:w-72">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por expediente, vehículo o placa…"
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-error-50 border border-error-200 rounded-lg p-4 text-sm text-error-700">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">N° Expediente</th>
                <th className="px-5 py-3 font-medium">Vehículo</th>
                <th className="px-5 py-3 font-medium">Placa</th>
                <th className="px-5 py-3 font-medium">Fecha de envío</th>
                <th className="px-5 py-3 font-medium">Monto</th>
                <th className="px-5 py-3 font-medium">Estatus aprobación</th>
                <th className="px-5 py-3 font-medium">Progreso</th>
                <th className="px-5 py-3 font-medium">PDF</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-neutral-400">Cargando presupuestos enviados…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-neutral-400">No hay presupuestos enviados</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-neutral-900">{p.numero}</td>
                    <td className="px-5 py-3 text-neutral-700">{p.vehiculo}</td>
                    <td className="px-5 py-3 text-neutral-500">{p.placa}</td>
                    <td className="px-5 py-3 text-neutral-500">{p.fechaEnvio}</td>
                    <td className="px-5 py-3 text-neutral-700 font-medium">{formatCurrency(p.monto)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${ESTATUS_COLOR[p.estatus] ?? 'bg-neutral-100 text-neutral-600'}`}>
                        {ESTATUS_LABEL[p.estatus] ?? p.estatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">
                      {SINIESTRO_ESTATUS_LABEL[p.siniestroEstatus] ?? p.siniestroEstatus}
                    </td>
                    <td className="px-5 py-3">
                      {p.pdfUrl ? (
                        <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:text-primary-600 underline">
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {p.estatus === 'Aprobada' && p.siniestroEstatus === 'Asignado_A_Taller' && (
                        <button
                          type="button"
                          disabled={processingId === p.id}
                          onClick={() => handleConcluirTrabajo(p)}
                          className="px-3 py-1.5 text-xs font-medium text-amber-dark bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                          {processingId === p.id ? 'Procesando…' : 'Concluir trabajo'}
                        </button>
                      )}
                      {p.siniestroEstatus === 'Trabajo_Concluido' && (
                        <button
                          type="button"
                          disabled={processingId === p.id}
                          onClick={() => handleListoEntrega(p)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-success-600 rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50"
                        >
                          {processingId === p.id ? 'Procesando…' : 'Listo para entrega'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
