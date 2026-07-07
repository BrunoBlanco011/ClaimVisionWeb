import type { StatusVariant } from '../../shared/status'

export interface CotizacionV1DTO {
  id: string
  siniestro_id: string
  taller_id: string
  monto_mano_obra: number
  monto_refacciones: number
  monto_total: number
  desglose_pdf_url: string
  estatus: string
  observaciones_tecnicas: string | null
  version: number
  created_at: string
  updated_at: string
}

export interface CrearCotizacionRequest {
  monto_mano_obra: number
  monto_refacciones: number
  monto_total?: number
  desglose_pdf_url: string
  observaciones_tecnicas?: string
}

export interface EditarCotizacionRequest {
  monto_mano_obra?: number
  monto_refacciones?: number
  monto_total?: number
  desglose_pdf_url?: string
  observaciones_tecnicas?: string
}

export interface Presupuesto {
  id: string
  numero: string
  expediente: string
  aseguradora: string
  monto: string
  fechaEnvio: string
  estado: StatusVariant
}

export interface Part {
  id: string
  code: string
  description: string
  quantity: number
  unitPrice: number
}

export interface VehicleData {
  brand: string
  model: string
  year: string
  plate: string
  expediente: string
}
