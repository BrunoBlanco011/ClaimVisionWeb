export interface TallerPerfilResponseDTO {
  id: string
  nombre_comercial: string
  rfc: string
  direccion_tecnica: string
  telefono_contacto: string
  nombre: string | null
  email: string | null
  telefono: string | null
  version: number
  created_at: string
  updated_at: string
}

export interface TallerPerfilUpdateRequestDTO {
  nombre_comercial?: string
  direccion_tecnica?: string
  telefono_contacto?: string
  nombre?: string
  email?: string
  telefono?: string
}

export interface TallerPerfil {
  tallerId: string
  nombreComercial: string
  rfc: string
  direccion: string
  telefonoContacto: string
  operadorNombre: string
  operadorEmail: string
  operadorTelefono: string
}
