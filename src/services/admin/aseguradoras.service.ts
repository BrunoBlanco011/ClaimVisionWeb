import { api } from '../api'
import { aseguradoraAdminBackendToFrontend, aseguradoraAdminToCreateDTO } from '../mappers'
import type { AseguradoraAdmin, AseguradoraResponseDTO, PaginatedResponse, AseguradoraRequestDTO } from '../../types'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: AseguradoraAdmin[] = [
  { id: '1', nombre: 'Seguros ABC', rfc: 'ABC-123456-XYZ', estatus: 'Activa', operadores: 12, ajustadores: 8, siniestrosActivos: 145, talleres: 15, plan: 'Enterprise' },
  { id: '2', nombre: 'Aseguradora XYZ', rfc: 'XYZ-789012-ABC', estatus: 'Activa', operadores: 8, ajustadores: 5, siniestrosActivos: 89, talleres: 10, plan: 'Pro' },
  { id: '3', nombre: 'Seguros del Valle', rfc: 'VAL-345678-DEF', estatus: 'Activa', operadores: 5, ajustadores: 3, siniestrosActivos: 42, talleres: 6, plan: 'Básico' },
  { id: '4', nombre: 'Previsión Total', rfc: 'PRE-901234-GHI', estatus: 'Inactiva', operadores: 0, ajustadores: 0, siniestrosActivos: 0, talleres: 0, plan: 'Básico' },
]

export async function getAll(page: number = 1, pageSize: number = 20, includeDeleted: boolean = false): Promise<{ items: AseguradoraAdmin[]; total: number; page: number; pageSize: number; totalPages: number }> {
  if (MOCK) {
    await delay(300)
    return { items: [...mockData], total: mockData.length, page: 1, pageSize: 20, totalPages: 1 }
  }
  const res = await api.get<PaginatedResponse<AseguradoraResponseDTO>>(`/admin/aseguradoras?page=${page}&page_size=${pageSize}&include_deleted=${includeDeleted}`)
  return {
    items: res.items.map(aseguradoraAdminBackendToFrontend),
    total: res.total,
    page: res.page,
    pageSize: res.page_size,
    totalPages: res.total_pages,
  }
}

export async function getById(id: string): Promise<AseguradoraAdmin> {
  const res = await api.get<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}`)
  return aseguradoraAdminBackendToFrontend(res)
}

export async function create(data: { nombre: string; rfc: string; dominioCorreo: string; emailContactoLegal: string; plan: string }): Promise<AseguradoraAdmin> {
  if (MOCK) {
    await delay(300)
    const nuevo: AseguradoraAdmin = { id: String(Date.now()), ...data, estatus: 'Activa', operadores: 0, ajustadores: 0, siniestrosActivos: 0, talleres: 0, plan: data.plan as AseguradoraAdmin['plan'] }
    return { ...nuevo }
  }
  const dto: AseguradoraRequestDTO = aseguradoraAdminToCreateDTO(data)
  const res = await api.post<AseguradoraResponseDTO>('/admin/aseguradoras', dto)
  return aseguradoraAdminBackendToFrontend(res)
}

export async function update(id: string, data: { nombre?: string; rfc?: string; dominioCorreo?: string; emailContactoLegal?: string }): Promise<AseguradoraAdmin> {
  if (MOCK) {
    await delay(300)
    return { id, ...data, estatus: 'Activa', operadores: 0, ajustadores: 0, siniestrosActivos: 0, talleres: 0, plan: 'Básico' } as AseguradoraAdmin
  }
  const res = await api.put<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}`, {
    nombre: data.nombre,
    rfc: data.rfc,
    dominio_correo: data.dominioCorreo,
    contacto_legal_email: data.emailContactoLegal,
  })
  return aseguradoraAdminBackendToFrontend(res)
}

export async function remove(id: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  await api.delete(`/admin/aseguradoras/${id}`)
}

export async function cambiarSuscripcion(id: string, nuevoPlan: string): Promise<AseguradoraAdmin> {
  const res = await api.put<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}/suscripcion`, { nuevo_plan: nuevoPlan })
  return aseguradoraAdminBackendToFrontend(res)
}

export async function verificar(id: string): Promise<AseguradoraAdmin> {
  const res = await api.post<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}/verificar`, {})
  return aseguradoraAdminBackendToFrontend(res)
}

export async function crearOperador(aseguradoraId: string, data: { nombre: string; email: string; password: string }): Promise<void> {
  await api.post<never>(`/admin/aseguradoras/${aseguradoraId}/operadores`, data)
}
