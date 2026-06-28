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
