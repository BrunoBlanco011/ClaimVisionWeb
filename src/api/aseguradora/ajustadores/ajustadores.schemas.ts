import type { StatusVariant } from '../../shared/status'

export interface Ajustador {
  id: string
  usuarioId: string
  nombre: string
  email: string
  telefono: string
  especialidad: string
  incidentesAsignados: number
  estado: StatusVariant
}

export interface AjustadorResponseDTO {
  id: string
  usuario_id: string
  cedula_profesional: string
  geolocalizacion_actual: [number, number] | null
  activo_para_servicio: boolean
  nombre: string | null
  email: string | null
  telefono: string | null
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AjustadorCreateDTO {
  nombre: string
  email: string
  telefono: string
  password_temporal: string
  cedula_profesional: string
}

export interface AjustadorUpdateDTO {
  cedula_profesional?: string
  activo_para_servicio?: boolean
}
