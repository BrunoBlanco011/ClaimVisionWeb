import { api } from '../../client'
import type { MessageResponseDTO } from '../../shared/common'
import type { SiniestroResponseDTO } from '../../aseguradora/siniestros/siniestros.schemas'
import type { Part, VehicleData, CrearCotizacionRequest, EditarCotizacionRequest, CotizacionV1DTO } from './cotizaciones.schemas'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export interface CreatePresupuestoData {
  siniestroId: string
  vehicle: VehicleData
  parts: Part[]
  hours: number
  hourlyRate: number
  desglosePdfUrl: string
}

export async function create(data: CreatePresupuestoData): Promise<CotizacionV1DTO> {
  if (MOCK) {
    await delay(500)
    const partsTotal = data.parts.reduce((s, p) => s + p.quantity * p.unitPrice, 0)
    const laborTotal = data.hours * data.hourlyRate
    const total = partsTotal + laborTotal + (partsTotal + laborTotal) * 0.16
    return {
      id: String(Date.now()),
      siniestro_id: data.siniestroId,
      taller_id: '',
      monto_mano_obra: laborTotal,
      monto_refacciones: partsTotal,
      monto_total: total,
      desglose_pdf_url: data.desglosePdfUrl,
      estatus: 'Pendiente_Aprobacion',
      observaciones_tecnicas: null,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
  const montoManoObra = data.hours * data.hourlyRate
  const montoRefacciones = data.parts.reduce((s, p) => s + p.quantity * p.unitPrice, 0)
  const dto: CrearCotizacionRequest = {
    monto_mano_obra: montoManoObra,
    monto_refacciones: montoRefacciones,
    monto_total: montoManoObra + montoRefacciones,
    desglose_pdf_url: data.desglosePdfUrl,
    observaciones_tecnicas: data.parts.map((p) => `${p.code}: ${p.description} x${p.quantity} = $${(p.quantity * p.unitPrice).toFixed(2)}`).join('\n'),
  }
  return api.post<CotizacionV1DTO>(`/taller/siniestros/${data.siniestroId}/cotizacion`, dto)
}

export async function editar(cotizacionId: string, dto: EditarCotizacionRequest): Promise<CotizacionV1DTO> {
  return api.patch<CotizacionV1DTO>(`/taller/cotizaciones/${cotizacionId}`, dto)
}

export async function concluirTrabajo(siniestroId: string): Promise<MessageResponseDTO> {
  return api.post<MessageResponseDTO>(`/taller/siniestros/${siniestroId}/concluir-trabajo`, {})
}

export async function listoEntrega(siniestroId: string): Promise<SiniestroResponseDTO> {
  return api.post<SiniestroResponseDTO>(`/taller/siniestros/${siniestroId}/listo-entrega`, {})
}
