import type { StatusVariant } from './status'

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

export interface GuardarPresupuestoRequestDTO {
  monto_mano_obra: number
  monto_refacciones: number
  observaciones_tecnicas?: string
}

export interface CotizacionTallerResponseDTO {
  monto_mano_obra: number
  monto_refacciones: number
  monto_total: number
  desglose_pdf_url: string
  estatus: string
  observaciones_tecnicas: string | null
}
