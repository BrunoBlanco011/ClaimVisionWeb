import type { Vehiculo } from '../../../api/aseguradora/vehiculos/vehiculos.schemas'

export interface VehiculoCardProps {
  vehiculo: Vehiculo
}

function CarIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11m-14 0h14m-14 0a2 2 0 00-2 2v4a1 1 0 001 1h1m14-7a2 2 0 012 2v4a1 1 0 01-1 1h-1m-14 0a2 2 0 002 2h.5a2 2 0 002-2m9.5 0a2 2 0 002 2h.5a2 2 0 002-2m-14 0h14" />
    </svg>
  )
}

export function VehiculoCard({ vehiculo }: VehiculoCardProps) {
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
    </div>
  )
}
