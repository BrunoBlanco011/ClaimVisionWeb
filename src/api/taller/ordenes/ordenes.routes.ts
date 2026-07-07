import { api } from '../../client'
import { ESTATUS_A_STATUS_TALLER } from '../../shared/estatus-siniestro'
import type { StatusVariant } from '../../shared/status'
import type { SiniestroResponseDTO } from '../../aseguradora/siniestros/siniestros.schemas'
import type { Expediente, TallerExpedienteDTO } from './ordenes.schemas'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Expediente[] = [
  { id: '1', numero: 'EXP-2026-001', aseguradora: 'Seguros Atlas', fechaIngreso: '15/06/2026', estado: 'pendiente', vehiculo: 'Toyota Corolla 2020', placa: 'ABC-1234' },
]

function expedienteBackendToFrontend(dto: SiniestroResponseDTO): Expediente {
  return {
    id: dto.id,
    numero: dto.id.slice(0, 8).toUpperCase(),
    aseguradora: dto.aseguradora_id ?? '—',
    fechaIngreso: new Date(dto.fecha_siniestro).toLocaleDateString('es-MX'),
    estado: ESTATUS_A_STATUS_TALLER[dto.estatus] ?? ('pendiente' as StatusVariant),
    vehiculo: `${dto.vehiculo_marca} ${dto.vehiculo_modelo} ${dto.vehiculo_anio}`,
    placa: dto.vehiculo_placas,
  }
}

export async function getAll(): Promise<Expediente[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  const res = await api.get<{ data: SiniestroResponseDTO[] }>('/taller/ordenes?page=1&page_size=100')
  return res.data.map((dto) => expedienteBackendToFrontend(dto))
}

export async function getById(id: string): Promise<Expediente> {
  if (MOCK) {
    await delay(200)
    const item = mockData.find((e) => e.id === id)
    if (!item) throw new Error('Expediente no encontrado')
    return { ...item }
  }
  const dto = await api.get<TallerExpedienteDTO>(`/taller/siniestros/${id}`)
  return expedienteBackendToFrontend(dto)
}

export async function getDetalleById(id: string): Promise<TallerExpedienteDTO> {
  return api.get<TallerExpedienteDTO>(`/taller/siniestros/${id}`)
}
