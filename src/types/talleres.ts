import type { StatusVariant } from './status'

export interface Taller {
  id: string
  nombre: string
  direccion: string
  contacto: string
  telefono: string
  capacidad: number
  estado: StatusVariant
}
