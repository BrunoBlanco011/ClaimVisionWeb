import type { StatusVariant } from './status'

export interface Ajustador {
  id: string
  nombre: string
  email: string
  telefono: string
  especialidad: string
  incidentesAsignados: number
  estado: StatusVariant
}
