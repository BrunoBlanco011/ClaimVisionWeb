import { api } from './api'
import { ajustadorBackendToFrontend, ajustadorToCreateDTO } from './mappers'
import type { Ajustador, AjustadorResponseDTO, AjustadorUpdateDTO } from '../types'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Ajustador[] = [
  { id: '1', nombre: 'Carlos Mendoza', email: 'carlos@example.com', telefono: '555-0101', especialidad: 'Colisiones', incidentesAsignados: 5, estado: 'aprobado' },
  { id: '2', nombre: 'María García', email: 'maria@example.com', telefono: '555-0102', especialidad: 'Daños múltiples', incidentesAsignados: 3, estado: 'aprobado' },
  { id: '3', nombre: 'Roberto Sánchez', email: 'roberto@example.com', telefono: '555-0103', especialidad: 'Incendios', incidentesAsignados: 2, estado: 'en_progreso' },
  { id: '4', nombre: 'Ana Torres', email: 'ana@example.com', telefono: '555-0104', especialidad: 'Robos', incidentesAsignados: 0, estado: 'pendiente' },
  { id: '5', nombre: 'Luis Vega', email: 'luis@example.com', telefono: '555-0105', especialidad: 'Colisiones', incidentesAsignados: 4, estado: 'cancelado' },
]

export async function getAll(): Promise<Ajustador[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  const res = await api.get<{ data: AjustadorResponseDTO[] }>('/aseguradora/ajustadores?offset=0&limit=200')
  return res.data.map((dto) => ajustadorBackendToFrontend(dto))
}

export async function create(data: Omit<Ajustador, 'id' | 'incidentesAsignados' | 'estado'>): Promise<Ajustador> {
  if (MOCK) {
    await delay(300)
    const nuevo: Ajustador = { id: String(Date.now()), ...data, incidentesAsignados: 0, estado: 'pendiente' }
    return { ...nuevo }
  }
  const dto = ajustadorToCreateDTO({
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    password_temporal: 'temporal123',
    cedula_profesional: data.especialidad,
  })
  const res = await api.post<AjustadorResponseDTO>('/aseguradora/ajustadores', dto)
  return ajustadorBackendToFrontend(res, data.nombre, data.email, data.telefono)
}

export async function update(id: string, data: Omit<Ajustador, 'id' | 'incidentesAsignados' | 'estado'>): Promise<Ajustador> {
  if (MOCK) {
    await delay(300)
    return { id, ...data, incidentesAsignados: 0, estado: 'pendiente' }
  }
  const dto: AjustadorUpdateDTO = {
    cedula_profesional: data.especialidad,
  }
  const res = await api.put<AjustadorResponseDTO>(`/aseguradora/ajustadores/${id}`, dto)
  return ajustadorBackendToFrontend(res, data.nombre, data.email, data.telefono)
}

export async function remove(id: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  await api.delete(`/aseguradora/ajustadores/${id}`)
}
