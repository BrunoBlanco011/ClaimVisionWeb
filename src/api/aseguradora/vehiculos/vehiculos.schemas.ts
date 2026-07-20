export interface Vehiculo {
  id: string
  clienteId: string
  marca: string
  modelo: string
  anio: number
  placas: string
  vin: string
  color: string
}

export interface VehiculoResponseDTO {
  id: string
  aseguradora_id: string
  cliente_id: string
  marca: string
  modelo: string
  anio: number
  placas: string
  vin: string | null
  color: string | null
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface VehiculoCreateDTO {
  cliente_id: string
  marca: string
  modelo: string
  anio: number
  placas: string
  vin?: string | null
  color?: string | null
}

export interface VehiculoCreateInput {
  marca: string
  modelo: string
  anio: number
  placas: string
  vin: string
  color: string
}

export interface VehiculoUpdateDTO {
  marca?: string
  modelo?: string
  anio?: number
  placas?: string
  vin?: string | null
  color?: string | null
}
