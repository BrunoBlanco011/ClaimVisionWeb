import type { Vehiculo } from '../../../api/aseguradora/vehiculos/vehiculos.schemas'

export interface VehiculoCardProps {
  vehiculo: Vehiculo
  onEdit?: () => void
  onDelete?: () => void
}

function CarIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11m-14 0h14m-14 0a2 2 0 00-2 2v4a1 1 0 001 1h1m14-7a2 2 0 012 2v4a1 1 0 01-1 1h-1m-14 0a2 2 0 002 2h.5a2 2 0 002-2m9.5 0a2 2 0 002 2h.5a2 2 0 002-2m-14 0h14" />
    </svg>
  )
}

export function VehiculoCard({ vehiculo, onEdit, onDelete }: VehiculoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-primary-800 text-white flex items-center justify-center shrink-0">
        <CarIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">{vehiculo.marca} {vehiculo.modelo} · {vehiculo.anio}</p>
        <p className="text-xs text-neutral-500 truncate">
          Placas: {vehiculo.placas}
          {vehiculo.color && ` · Color: ${vehiculo.color}`}
          {vehiculo.vin && ` · VIN: ${vehiculo.vin}`}
        </p>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button type="button" onClick={onEdit} className="p-1.5 text-neutral-400 hover:text-primary-700 transition-colors" aria-label="Editar vehículo">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} className="p-1.5 text-neutral-400 hover:text-error-600 transition-colors" aria-label="Eliminar vehículo">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
