export interface SiniestroResponseDTO {
  id: string
  aseguradora_id: string | null
  cliente_id: string
  ajustador_id: string | null
  taller_id: string | null
  estatus: string
  vehiculo_marca: string
  vehiculo_modelo: string
  vehiculo_anio: number
  vehiculo_placas: string
  vehiculo_vin: string | null
  latitud_siniestro: number
  longitud_siniestro: number
  narracion_texto: string | null
  narracion_audio_url: string | null
  indicaciones_dano_interno: boolean
  fecha_siniestro: string
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AsignarAjustadorDTO {
  ajustador_id: string
}

export interface EnviarTallerDTO {
  taller_id: string
}
