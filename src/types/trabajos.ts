import type { StatusVariant } from './status'

export interface Trabajo {
  id: string
  numero: string
  vehiculo: string
  taller: string
  fechaInicio: string
  fechaFin: string
  monto: string
  estado: StatusVariant
}
