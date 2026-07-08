import { api } from '../../client'
import { ESTATUS_A_STATUS_ASEGURADORA, construirTimeline } from '../../shared/estatus-siniestro'
import type { TimelineEvent } from '../../shared/estatus-siniestro'
import type { StatusVariant } from '../../shared/status'
import type { CotizacionV1DTO } from '../../taller/cotizaciones/cotizaciones.schemas'
import type {
  Incidente,
  IncidenteDetalle,
  Peritaje,
  SiniestroResponseDTO,
  SiniestroDetalleAseguradoraDTO,
  SiniestroUpdateDTO,
  AsignarAjustadorDTO,
  EnviarTallerDTO,
  RechazarCotizacionRequest,
} from './siniestros.schemas'

const MOCK_LIST = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockIncidentes: Incidente[] = [
  { id: '1', numero: 'INC-2026-001', tipo: 'Colisión leve', asegurado: 'Juan Pérez', fecha: '15/06/2026', estado: 'pendiente', estatusRaw: 'Reportado_Preliminar', ajustadorId: null, prioridad: 'Alta' },
]

function siniestroBackendToFrontend(dto: SiniestroResponseDTO): Incidente {
  return {
    id: dto.id,
    numero: dto.id.slice(0, 8).toUpperCase(),
    tipo: 'Accidente',
    asegurado: dto.cliente_id,
    fecha: new Date(dto.fecha_siniestro).toLocaleDateString('es-MX'),
    estado: ESTATUS_A_STATUS_ASEGURADORA[dto.estatus] ?? ('pendiente' as StatusVariant),
    estatusRaw: dto.estatus,
    ajustadorId: dto.ajustador_id,
    prioridad: 'Media',
  }
}

function siniestroDetalleBackendToFrontend(dto: SiniestroDetalleAseguradoraDTO): IncidenteDetalle {
  let peritaje: Peritaje | null = null
  if (dto.peritaje) {
    peritaje = {
      id: dto.peritaje.id,
      ajustador: dto.peritaje.ajustador_id,
      fecha: new Date(dto.peritaje.created_at).toLocaleDateString('es-MX'),
      montoEstimado: dto.peritaje.costo_definitivo_ajustador,
      descripcion: dto.peritaje.observaciones_campo ?? '',
      estado: dto.cotizacion?.estatus === 'Aprobada' ? 'aprobado' : dto.cotizacion?.estatus === 'Rechazada' ? 'rechazado' : 'pendiente',
    }
  }

  return {
    id: dto.id,
    numero: dto.id.slice(0, 8).toUpperCase(),
    tipo: 'Accidente',
    asegurado: dto.cliente_nombre ?? dto.cliente_id,
    fecha: new Date(dto.fecha_siniestro).toLocaleDateString('es-MX'),
    estado: ESTATUS_A_STATUS_ASEGURADORA[dto.estatus] ?? ('pendiente' as StatusVariant),
    estatusRaw: dto.estatus,
    prioridad: 'Media',
    aseguradora: dto.aseguradora_id ?? '—',
    vehiculo: `${dto.vehiculo_marca} ${dto.vehiculo_modelo} ${dto.vehiculo_anio}`,
    placa: dto.vehiculo_placas,
    taller: dto.taller_nombre ?? dto.taller_id ?? '—',
    descripcion: dto.narracion_texto ?? '—',
    ajustadorAsignado: dto.ajustador_nombre ?? dto.ajustador_id,
    evidencias: dto.imagenes.map((img) => ({
      id: img.id,
      url: img.imagen_url,
      descripcion: img.es_calidad_valida ? 'Imagen válida' : 'Calidad no validada',
      fecha: new Date(img.created_at).toLocaleDateString('es-MX'),
    })),
    peritaje,
    cotizacionId: dto.cotizacion?.id ?? null,
    cotizacionEstatus: dto.cotizacion?.estatus ?? null,
  }
}

export async function getAll(): Promise<Incidente[]> {
  if (MOCK_LIST) {
    await delay(300)
    return [...mockIncidentes]
  }
  const res = await api.get<{ data: SiniestroResponseDTO[] }>('/aseguradora/siniestros?page=1&page_size=100')
  return res.data.map((dto) => siniestroBackendToFrontend(dto))
}

export async function getById(id: string): Promise<{ incidente: IncidenteDetalle; timeline: TimelineEvent[] }> {
  const dto = await api.get<SiniestroDetalleAseguradoraDTO>(`/aseguradora/siniestros/${id}`)
  const incidente = siniestroDetalleBackendToFrontend(dto)
  return { incidente, timeline: construirTimeline(dto.estatus) }
}

export async function editarSiniestro(id: string, dto: SiniestroUpdateDTO): Promise<SiniestroResponseDTO> {
  return api.put<SiniestroResponseDTO>(`/aseguradora/siniestros/${id}`, dto)
}

export async function assignAjustador(incidenteId: string, ajustadorId: string): Promise<void> {
  const dto: AsignarAjustadorDTO = { ajustador_id: ajustadorId }
  await api.post(`/aseguradora/siniestros/${incidenteId}/asignar-ajustador`, dto)
}

export async function assignTaller(incidenteId: string, tallerId: string): Promise<void> {
  const dto: EnviarTallerDTO = { taller_id: tallerId }
  await api.post(`/aseguradora/siniestros/${incidenteId}/enviar-taller`, dto)
}

export async function autorizarEntrega(incidenteId: string): Promise<SiniestroResponseDTO> {
  return api.post<SiniestroResponseDTO>(`/aseguradora/siniestros/${incidenteId}/autorizar-entrega`, {})
}

export async function aprobarCotizacion(cotizacionId: string): Promise<CotizacionV1DTO> {
  return api.post<CotizacionV1DTO>(`/aseguradora/cotizaciones/${cotizacionId}/aprobar`, {})
}

export async function rechazarCotizacion(cotizacionId: string, motivo?: string): Promise<CotizacionV1DTO> {
  const dto: RechazarCotizacionRequest = { motivo }
  return api.post<CotizacionV1DTO>(`/aseguradora/cotizaciones/${cotizacionId}/rechazar`, dto)
}
