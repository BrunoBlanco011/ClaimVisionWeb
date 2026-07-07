import { api } from '../../client'
import type { Ajustador, AjustadorResponseDTO, AjustadorCreateDTO, AjustadorUpdateDTO } from './ajustadores.schemas'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Ajustador[] = [
  { id: '1', nombre: 'Carlos Mendoza', email: 'carlos@example.com', telefono: '555-0101', especialidad: 'Colisiones', incidentesAsignados: 5, estado: 'aprobado' },
  { id: '2', nombre: 'María García', email: 'maria@example.com', telefono: '555-0102', especialidad: 'Daños múltiples', incidentesAsignados: 3, estado: 'aprobado' },
]

function ajustadorBackendToFrontend(
  dto: AjustadorResponseDTO,
  nombre?: string,
  email?: string,
  telefono?: string,
): Ajustador {
  return {
    id: dto.id,
    nombre: nombre ?? '',
    email: email ?? '',
    telefono: telefono ?? '',
    especialidad: dto.cedula_profesional,
    incidentesAsignados: 0,
    estado: dto.deleted_at ? 'cancelado' : dto.activo_para_servicio ? 'aprobado' : 'pendiente',
  }
}

// Nota: AjustadorResponseDTO del backend no incluye nombre/email/telefono (viven en
// la tabla `usuarios` asociada, sin JOIN expuesto en este endpoint). Por eso getAll()
// sólo puede mostrar cedula_profesional/estado real; nombre/email/telefono quedan en
// blanco hasta que el backend agregue esos campos al listado.
export async function getAll(): Promise<Ajustador[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  const res = await api.get<{ data: AjustadorResponseDTO[] }>('/aseguradora/crud/ajustadores?page=1&page_size=100')
  return res.data.map((dto) => ajustadorBackendToFrontend(dto))
}

export async function create(data: Omit<Ajustador, 'id' | 'incidentesAsignados' | 'estado'> & { password_temporal: string }): Promise<Ajustador> {
  if (MOCK) {
    await delay(300)
    const nuevo: Ajustador = { id: String(Date.now()), nombre: data.nombre, email: data.email, telefono: data.telefono, especialidad: data.especialidad, incidentesAsignados: 0, estado: 'pendiente' }
    return { ...nuevo }
  }
  const dto: AjustadorCreateDTO = {
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    password_temporal: data.password_temporal,
    cedula_profesional: data.especialidad,
  }
  const res = await api.post<AjustadorResponseDTO>('/aseguradora/crud/ajustadores', dto)
  return ajustadorBackendToFrontend(res, data.nombre, data.email, data.telefono)
}

export async function update(id: string, data: Omit<Ajustador, 'id' | 'incidentesAsignados' | 'estado'>): Promise<Ajustador> {
  if (MOCK) {
    await delay(300)
    return { id, nombre: data.nombre, email: data.email, telefono: data.telefono, especialidad: data.especialidad, incidentesAsignados: 0, estado: 'pendiente' }
  }
  const dto: AjustadorUpdateDTO = {
    cedula_profesional: data.especialidad,
  }
  const res = await api.put<AjustadorResponseDTO>(`/aseguradora/crud/ajustadores/${id}`, dto)
  return ajustadorBackendToFrontend(res, data.nombre, data.email, data.telefono)
}

export async function remove(id: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  await api.delete(`/aseguradora/crud/ajustadores/${id}`)
}
