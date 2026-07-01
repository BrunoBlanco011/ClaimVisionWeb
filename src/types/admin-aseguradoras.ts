export interface AseguradoraResponseDTO {
  id: string
  nombre: string
  rfc: string
  dominio_correo: string
  plan_suscripcion: string
  limite_peritajes_mes: number
  peritajes_consumidos_mes: number
  estatus_comercial: string
  contacto_legal_email: string
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AseguradoraRequestDTO {
  nombre: string
  rfc: string
  dominio_correo: string
  plan_suscripcion: string
  contacto_legal_email: string
}

export interface UpdateAseguradoraDTO {
  nombre?: string
  rfc?: string
  dominio_correo?: string
  contacto_legal_email?: string
}

export interface UpdateSuscripcionDTO {
  nuevo_plan: string
}

export interface OperadorAseguradoraRequestDTO {
  nombre: string
  email: string
  password: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
