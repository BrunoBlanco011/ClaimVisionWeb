import type { StatusVariant } from './status'

export interface Expediente {
  id: string
  numero: string
  aseguradora: string
  fechaIngreso: string
  estado: StatusVariant
  vehiculo: string
  placa: string
}

export interface SiniestroTecnicoDTO {
  id: string
  estatus: string
  vehiculo_marca: string
  vehiculo_modelo: string
  vehiculo_anio: number
  vehiculo_vin: string | null
  narracion_texto: string | null
  indicaciones_dano_interno: boolean
  fecha_siniestro: string
}

export interface DanoAjustadoDTO {
  zona_vehiculo: string
  tipo: string
  severidad: string
}

export interface PeritajeAjustadorTecnicoDTO {
  observaciones_campo: string | null
  danos_ajustados: DanoAjustadoDTO[]
}

export interface CotizacionTallerDTO {
  monto_mano_obra: number
  monto_refacciones: number
  monto_total: number
  desglose_pdf_url: string
  estatus: string
  observaciones_tecnicas: string | null
}

export interface ExpedienteTecnicoResponseDTO {
  siniestro: SiniestroTecnicoDTO
  peritaje_ajustador: PeritajeAjustadorTecnicoDTO | null
  cotizacion: CotizacionTallerDTO | null
}

export interface MessageResponseDTO {
  message: string
}
