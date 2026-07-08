export interface UsuarioResponseDTO {
  id: string
  email: string
  nombre_completo: string
  telefono: string | null
  rol: string
  estatus_arco: string
  aseguradora_id: string | null
  created_at: string
  deleted_at: string | null
}

export interface CreateUsuarioRequestDTO {
  nombre: string
  email: string
  password: string
  rol: string
  aseguradora_id?: string | null
  telefono?: string | null
}

export interface UpdateUsuarioRequestDTO {
  nombre?: string
  email?: string
  password?: string
  rol?: string
  aseguradora_id?: string | null
  telefono?: string | null
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: string
  aseguradoraId: string | null
  estatusArco: string
  bloqueado: boolean
  createdAt: string
}
