import type { StatusVariant } from './status'

export type Prioridad = 'Alta' | 'Media' | 'Baja'

export type PeritajeEstado = 'pendiente' | 'aprobado' | 'rechazado'

export interface Incidente {
  id: string
  numero: string
  tipo: string
  asegurado: string
  fecha: string
  estado: StatusVariant
  prioridad: Prioridad
}

export interface EvidenciaFoto {
  id: string
  url: string
  descripcion: string
  fecha: string
}

export interface Peritaje {
  id: string
  ajustador: string
  fecha: string
  montoEstimado: number
  descripcion: string
  estado: PeritajeEstado
}

export interface IncidenteDetalle {
  id: string
  numero: string
  tipo: string
  asegurado: string
  fecha: string
  estado: StatusVariant
  prioridad: Prioridad
  aseguradora: string
  vehiculo: string
  placa: string
  taller: string
  descripcion: string
  ajustadorAsignado: string | null
  evidencias: EvidenciaFoto[]
  peritaje: Peritaje | null
}

export interface TimelineEvent {
  evento: string
  detalle: string
  tiempo: string
}
