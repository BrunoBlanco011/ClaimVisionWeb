import { api } from '../../client'
import type { Taller, TallerResponseDTO, TallerCreateDTO, TallerUpdateDTO, OperadorTallerRequestDTO } from './talleres.schemas'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Taller[] = [
  { id: '1', nombre: 'Taller Central', rfc: 'TCE010101AB1', direccion: 'Av. Principal 123', telefono: '555-0201', estado: 'aprobado' },
  { id: '2', nombre: 'Taller Norte', rfc: 'TNO020202BC2', direccion: 'Calle Norte 456', telefono: '555-0202', estado: 'aprobado' },
  { id: '3', nombre: 'Taller Sur', rfc: 'TSU030303CD3', direccion: 'Av. del Sur 789', telefono: '555-0203', estado: 'en_progreso' },
]

function tallerBackendToFrontend(dto: TallerResponseDTO): Taller {
  return {
    id: dto.id,
    nombre: dto.nombre_comercial,
    rfc: dto.rfc,
    direccion: dto.direccion_tecnica,
    telefono: dto.telefono_contacto,
    estado: dto.deleted_at ? 'cancelado' : 'aprobado',
  }
}

export async function getAll(): Promise<Taller[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  const res = await api.get<{ data: TallerResponseDTO[] }>('/aseguradora/crud/talleres?page=1&page_size=100')
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
    rfc: data.rfc,
    direccion_tecnica: data.direccion,
    telefono_contacto: data.telefono,
  }
  const res = await api.post<TallerResponseDTO>('/aseguradora/crud/talleres', dto)
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
  const res = await api.put<TallerResponseDTO>(`/aseguradora/crud/talleres/${id}`, dto)
  return tallerBackendToFrontend(res)
}

export async function remove(id: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  await api.delete(`/aseguradora/crud/talleres/${id}`)
}

export async function createOperador(tallerId: string, data: OperadorTallerRequestDTO): Promise<void> {
  if (MOCK) {
    await delay(300)
    return
  }
  await api.post<unknown>(`/aseguradora/crud/talleres/${tallerId}/operadores`, data)
}
