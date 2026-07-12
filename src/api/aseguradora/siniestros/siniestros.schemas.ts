import type { StatusVariant } from '../../shared/status'
import type { CotizacionV1DTO } from '../../taller/cotizaciones/cotizaciones.schemas'

export type { TimelineEvent } from '../../shared/estatus-siniestro'

export interface SiniestroResponseDTO {
  id: string
  aseguradora_id: string | null
  cliente_id: string
  ajustador_id: string | null
  taller_id: string | null
  vehiculo_id: string | null
  estatus: string
  vehiculo_marca: string
  vehiculo_modelo: string
  vehiculo_anio: number
  vehiculo_placas: string
  vehiculo_vin: string | null
  latitud_siniestro: number
  longitud_siniestro: number
  narracion_texto: string | null
  narracion_audio_url: string | null
  indicaciones_dano_interno: boolean
  fecha_siniestro: string
  created_at: string
}

export interface SiniestroUpdateDTO {
  vehiculo_id?: string
  vehiculo_marca?: string
  vehiculo_modelo?: string
  vehiculo_anio?: number
  vehiculo_placas?: string
  vehiculo_vin?: string
  latitud_siniestro?: number
  longitud_siniestro?: number
  narracion_texto?: string
  narracion_audio_url?: string
  indicaciones_dano_interno?: boolean
}

export interface ImagenSiniestroResponseDTO {
  id: string
  siniestro_id: string
  imagen_url: string
  es_calidad_valida: boolean
  metadatos_json: Record<string, unknown> | null
  created_at: string
}

export interface DanoAjustadoResponseDTO {
  id: string
  zona_vehiculo: string
  tipo: string
  severidad: string
  costo_real_reparacion: number
  origen_cambio: string
}

export interface PeritajeResponseDTO {
  id: string
  siniestro_id: string
  ajustador_id: string
  costo_definitivo_ajustador: number
  firma_digital_ajustador: string
  observaciones_campo: string | null
  danos: DanoAjustadoResponseDTO[]
  version: number
  created_at: string
  updated_at: string
}

export interface SiniestroDetalleAseguradoraDTO extends SiniestroResponseDTO {
  imagenes: ImagenSiniestroResponseDTO[]
  peritaje: PeritajeResponseDTO | null
  cotizacion: CotizacionV1DTO | null
  peritaje_ia: Record<string, unknown> | null
  cliente_nombre: string | null
  ajustador_nombre: string | null
  taller_nombre: string | null
}

export interface AsignarAjustadorDTO {
  ajustador_id: string
}

export interface EnviarTallerDTO {
  taller_id: string
}

export interface RechazarCotizacionRequest {
  motivo?: string
}

// ── Vista de la aseguradora sobre el siniestro (bandeja + detalle) ──────────

export type Prioridad = 'Alta' | 'Media' | 'Baja'

export type PeritajeEstado = 'pendiente' | 'aprobado' | 'rechazado'

export interface Incidente {
  id: string
  numero: string
  tipo: string
  asegurado: string
  fecha: string
  estado: StatusVariant
  estatusRaw: string
  ajustadorId: string | null
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
  estatusRaw: string
  prioridad: Prioridad
  aseguradora: string
  vehiculo: string
  placa: string
  taller: string
  descripcion: string
  ajustadorAsignado: string | null
  evidencias: EvidenciaFoto[]
  peritaje: Peritaje | null
  cotizacionId: string | null
  cotizacionEstatus: string | null
}
