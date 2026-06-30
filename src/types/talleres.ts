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

export interface TallerResponseDTO {
  id: string
  nombre_comercial: string
  rfc: string
  direccion_tecnica: string
  telefono_contacto: string
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface TallerCreateDTO {
  nombre_comercial: string
  rfc: string
  direccion_tecnica: string
  telefono_contacto: string
}

export interface TallerUpdateDTO {
  nombre_comercial?: string
  direccion_tecnica?: string
  telefono_contacto?: string
}
