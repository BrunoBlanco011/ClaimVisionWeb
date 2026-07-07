import type { StatusVariant } from '../../shared/status'
import type { SiniestroResponseDTO, PeritajeResponseDTO } from '../../aseguradora/siniestros/siniestros.schemas'
import type { CotizacionV1DTO } from '../cotizaciones/cotizaciones.schemas'

export interface Expediente {
  id: string
  numero: string
  aseguradora: string
  fechaIngreso: string
  estado: StatusVariant
  vehiculo: string
  placa: string
}

// `GET /taller/siniestros/{id}` — extiende SiniestroResponseDTO con peritaje/cotización
// a nivel raíz (no viene anidado bajo `siniestro`).
export interface TallerExpedienteDTO extends SiniestroResponseDTO {
  peritaje: PeritajeResponseDTO | null
  cotizacion: CotizacionV1DTO | null
}
