import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StatusBadge } from '../../components/atoms/StatusBadge'
import { getTrabajos } from '../../services'
import type { Trabajo, StatusVariant } from '../../types'

export function DetalleHistoricoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [trabajo, setTrabajo] = useState<Trabajo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setNotFound(false)
    getTrabajos()
      .then((result) => {
        const found = result.find((t) => t.id === id)
        if (found) setTrabajo(found)
        else setNotFound(true)
      })
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

  if (notFound || !trabajo) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Trabajo no encontrado</p>
        <button type="button" onClick={() => navigate('/taller/historico')} className="mt-4 text-sm text-primary-700 hover:text-primary-600 underline">
          Volver al historial
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/taller/historico')} className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Trabajo {trabajo.numero}</h1>
          <p className="text-sm text-neutral-500">Detalle del trabajo realizado</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Información del Trabajo</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="N° Expediente" value={trabajo.numero} />
          <Field label="Estado" value={<StatusBadge variant={trabajo.estado as StatusVariant} size="sm" />} />
          <Field label="Vehículo" value={trabajo.vehiculo} />
          <Field label="Taller" value={trabajo.taller} />
          <Field label="Fecha Inicio" value={trabajo.fechaInicio} />
          <Field label="Fecha Fin" value={trabajo.fechaFin} />
          <Field label="Monto" value={<span className="font-semibold">{trabajo.monto}</span>} />
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
