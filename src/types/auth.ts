export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponseDTO {
  token: string
  usuario_id: string
  email: string
  rol: string
  aseguradora_id: string | null
}
