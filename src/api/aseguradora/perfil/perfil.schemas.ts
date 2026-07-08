export interface PerfilAseguradoraDTO {
  id: string
  nombre: string
  rfc: string
  dominio_correo: string
  plan_suscripcion: string
  limite_peritajes_mes: number
  peritajes_consumidos_mes: number
  estatus_comercial: string
  contacto_legal_email: string
  created_at: string
  updated_at: string
}

export interface PerfilAseguradoraUpdateDTO {
  nombre?: string
  rfc?: string
  dominio_correo?: string
  contacto_legal_email?: string
  operador_nombre?: string
  operador_email?: string
  operador_telefono?: string
}

export interface PerfilAseguradora {
  id: string
  nombre: string
  rfc: string
  dominioCorreo: string
  contactoLegalEmail: string
  plan: string
  limitePeritajesMes: number
  peritajesConsumidosMes: number
  estatusComercial: string
  desde: string
}
