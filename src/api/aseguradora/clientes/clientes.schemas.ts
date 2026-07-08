export interface Cliente {
  id: string
  usuarioId: string
  nombre: string
  email: string
  telefono: string
  numeroPoliza: string
  vigenciaPoliza: string
}

export interface ClienteResponseDTO {
  id: string
  usuario_id: string
  numero_poliza: string
  vigencia_poliza: string
  consentimiento_aviso_privacidad: boolean
  consentimiento_biometria: boolean
  autoriza_transferencia_talleres: boolean
  fecha_consentimiento: string | null
  nombre: string | null
  email: string | null
  telefono: string | null
}

export interface ClienteCreateDTO {
  nombre: string
  email: string
  telefono: string
  password_temporal: string
}
