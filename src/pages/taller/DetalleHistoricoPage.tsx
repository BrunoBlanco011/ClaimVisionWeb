import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StatusBadge } from '../../components/atoms/StatusBadge'
import { getDetalleById as getExpedienteDetalleById } from '../../api/taller/ordenes/ordenes.routes'
import type { TallerExpedienteDTO } from '../../api/taller/ordenes/ordenes.schemas'
import type { StatusVariant } from '../../api/shared/status'

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const ESTADO_MAP: Record<string, StatusVariant> = {
  Reportado_Preliminar: 'pendiente',
  Asignado_A_Ajustador: 'en_progreso',
  Peritaje_Validado: 'aprobado',
  Asignado_A_Taller: 'en_progreso',
  Trabajo_Concluido: 'completado',
  Listo_Para_Entrega: 'completado',
  Entregado: 'completado',
}

export function DetalleHistoricoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [expediente, setExpediente] = useState<TallerExpedienteDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    setNotFound(false)
    getExpedienteDetalleById(id)
      .then((result) => setExpediente(result))
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Cargando trabajo…</p>
      </div>
    )
  }

  if (notFound || !expediente) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Trabajo no encontrado</p>
        <button type="button" onClick={() => navigate('/taller/historico')} className="mt-4 text-sm text-primary-700 hover:text-primary-600 underline">
          Volver al historial
        </button>
      </div>
    )
  }

  const numero = expediente.id.slice(0, 8).toUpperCase()
  const vehiculo = `${expediente.vehiculo_marca} ${expediente.vehiculo_modelo} ${expediente.vehiculo_anio}`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/taller/historico')} className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Trabajo {numero}</h1>
          <p className="text-sm text-neutral-500">Detalle del trabajo realizado</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Información del Vehículo</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="N° Expediente" value={numero} />
          <Field label="Estado" value={<StatusBadge variant={ESTADO_MAP[expediente.estatus] ?? 'pendiente'} size="sm" />} />
          <Field label="Vehículo" value={vehiculo} />
          <Field label="Placa" value={expediente.vehiculo_placas} />
          <Field label="Fecha del siniestro" value={new Date(expediente.fecha_siniestro).toLocaleDateString('es-MX')} />
        </div>
      </div>

      {expediente.cotizacion && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cotización</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Field label="Mano de obra" value={formatCurrency(expediente.cotizacion.monto_mano_obra)} />
            <Field label="Refacciones" value={formatCurrency(expediente.cotizacion.monto_refacciones)} />
            <Field label="Total" value={<span className="font-semibold">{formatCurrency(expediente.cotizacion.monto_total)}</span>} />
            <Field label="Estatus" value={expediente.cotizacion.estatus} />
            <Field
              label="Desglose PDF"
              value={
                <a href={expediente.cotizacion.desglose_pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:text-primary-600 underline">
                  Ver documento
                </a>
              }
            />
          </div>
        </div>
      )}
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
