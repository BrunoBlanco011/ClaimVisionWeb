import { api } from './api'
import { tallerBackendToFrontend } from './mappers'
import type { Taller, TallerResponseDTO, TallerCreateDTO, TallerUpdateDTO } from '../types'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Taller[] = [
  { id: '1', nombre: 'Taller Central', direccion: 'Av. Principal 123', contacto: 'Pedro Gómez', telefono: '555-0201', capacidad: 20, estado: 'aprobado' },
  { id: '2', nombre: 'Taller Norte', direccion: 'Calle Norte 456', contacto: 'Lucía Fernández', telefono: '555-0202', capacidad: 15, estado: 'aprobado' },
  { id: '3', nombre: 'Taller Sur', direccion: 'Av. del Sur 789', contacto: 'Jorge Ruiz', telefono: '555-0203', capacidad: 10, estado: 'en_progreso' },
  { id: '4', nombre: 'Taller Express', direccion: 'Blvd. Oriente 321', contacto: 'Sofía Herrera', telefono: '555-0204', capacidad: 8, estado: 'pendiente' },
  { id: '5', nombre: 'Taller Premium', direccion: 'Paseo Central 654', contacto: 'Diego Navarro', telefono: '555-0205', capacidad: 25, estado: 'aprobado' },
]

export async function getAll(): Promise<Taller[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  const res = await api.get<{ data: TallerResponseDTO[] }>('/aseguradora/talleres?offset=0&limit=200')
  return res.data.map((dto) => tallerBackendToFrontend(dto))
}

export async function create(data: Omit<Taller, 'id' | 'estado'>): Promise<Taller> {
  if (MOCK) {
    await delay(300)
    const nuevo: Taller = { id: String(Date.now()), ...data, estado: 'pendiente' }
    return { ...nuevo }
  }
  const dto: TallerCreateDTO = {
    nombre_comercial: data.nombre,
    rfc: '',
    direccion_tecnica: data.direccion,
    telefono_contacto: data.telefono,
  }
  const res = await api.post<TallerResponseDTO>('/aseguradora/talleres', dto)
  return tallerBackendToFrontend(res)
}

export async function update(id: string, data: Omit<Taller, 'id' | 'estado'>): Promise<Taller> {
  if (MOCK) {
    await delay(300)
    return { id, ...data, estado: 'pendiente' }
  }
  const dto: TallerUpdateDTO = {
    nombre_comercial: data.nombre,
    direccion_tecnica: data.direccion,
    telefono_contacto: data.telefono,
  }
  const res = await api.put<TallerResponseDTO>(`/aseguradora/talleres/${id}`, dto)
  return tallerBackendToFrontend(res)
}

export async function remove(id: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  await api.delete(`/aseguradora/talleres/${id}`)
}
