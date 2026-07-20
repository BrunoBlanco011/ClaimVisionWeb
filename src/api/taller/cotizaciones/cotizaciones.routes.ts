import { api } from '../../client'
import type { MessageResponseDTO } from '../../shared/common'
import type { SiniestroResponseDTO } from '../../aseguradora/siniestros/siniestros.schemas'
import { getAll as getExpedientes, getDetalleById } from '../ordenes/ordenes.routes'
import type { Part, VehicleData, EditarCotizacionRequest, CotizacionV1DTO, PresupuestoEnviado } from './cotizaciones.schemas'

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
  pdfFile: Blob
  pdfFilename: string
}

export async function create(data: CreatePresupuestoData): Promise<CotizacionV1DTO> {
  const montoManoObra = data.hours * data.hourlyRate
  const montoRefacciones = data.parts.reduce((s, p) => s + p.quantity * p.unitPrice, 0)
  const observaciones = data.parts.map((p) => `${p.code}: ${p.description} x${p.quantity} = $${(p.quantity * p.unitPrice).toFixed(2)}`).join('\n')

  if (MOCK) {
    await delay(500)
    const total = montoManoObra + montoRefacciones + (montoManoObra + montoRefacciones) * 0.16
    return {
      id: String(Date.now()),
      siniestro_id: data.siniestroId,
      taller_id: '',
      monto_mano_obra: montoManoObra,
      monto_refacciones: montoRefacciones,
      monto_total: total,
      desglose_pdf_url: '',
      estatus: 'Pendiente_Aprobacion',
      observaciones_tecnicas: observaciones,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  const formData = new FormData()
  formData.append('monto_mano_obra', String(montoManoObra))
  formData.append('monto_refacciones', String(montoRefacciones))
  formData.append('monto_total', String(montoManoObra + montoRefacciones))
  formData.append('observaciones_tecnicas', observaciones)
  formData.append('desglose_pdf', data.pdfFile, data.pdfFilename)
  return api.postForm<CotizacionV1DTO>(`/taller/siniestros/${data.siniestroId}/cotizacion`, formData)
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

// El backend no expone un endpoint que liste las cotizaciones del taller
// (`GET /taller/ordenes` no trae la cotización anidada); se recorren los
// expedientes que ya llegaron al taller (Asignado_A_Taller en adelante,
// incluyendo Trabajo_Concluido/Listo_Para_Entrega/Entregado) y se consulta
// el detalle de cada uno para quedarnos solo con los que ya tienen cotización.
export async function getEnviados(): Promise<PresupuestoEnviado[]> {
  const expedientes = await getExpedientes()
  const candidatos = expedientes.filter((e) => e.estado !== 'pendiente')
  const detalles = await Promise.all(candidatos.map((e) => getDetalleById(e.id).catch(() => null)))

  const enviados: PresupuestoEnviado[] = []
  detalles.forEach((detalle, i) => {
    if (!detalle?.cotizacion) return
    const expediente = candidatos[i]
    enviados.push({
      id: detalle.cotizacion.id,
      siniestroId: expediente.id,
      numero: expediente.numero,
      vehiculo: expediente.vehiculo,
      placa: expediente.placa,
      monto: detalle.cotizacion.monto_total,
      estatus: detalle.cotizacion.estatus,
      siniestroEstatus: detalle.estatus,
      fechaEnvio: new Date(detalle.cotizacion.created_at).toLocaleDateString('es-MX'),
      pdfUrl: detalle.cotizacion.desglose_pdf_url,
    })
  })
  return enviados
}
