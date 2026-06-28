import type { StatusVariant } from './status'

export interface Expediente {
  id: string
  numero: string
  aseguradora: string
  fechaIngreso: string
  estado: StatusVariant
  vehiculo: string
  placa: string
}
