export interface TallerAdminResponseDTO {
  id: string
  nombre_comercial: string
  rfc: string
  direccion_tecnica: string
  telefono_contacto: string
  aseguradoras_vinculadas: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface TallerAdmin {
  id: string
  nombre: string
  rfc: string
  direccion: string
  telefono: string
  aseguradorasVinculadas: string[]
  activo: boolean
}
