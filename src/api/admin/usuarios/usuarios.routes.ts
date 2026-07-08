import { api } from '../../client'
import type { Usuario, UsuarioResponseDTO, CreateUsuarioRequestDTO, UpdateUsuarioRequestDTO } from './usuarios.schemas'

function usuarioBackendToFrontend(dto: UsuarioResponseDTO): Usuario {
  return {
    id: dto.id,
    nombre: dto.nombre_completo,
    email: dto.email,
    telefono: dto.telefono ?? '',
    rol: dto.rol,
    aseguradoraId: dto.aseguradora_id,
    estatusArco: dto.estatus_arco,
    bloqueado: dto.estatus_arco !== 'Activo',
    createdAt: dto.created_at,
  }
}

export interface ListarUsuariosFiltros {
  rol?: string
  estatus?: string
  search?: string
}

export async function getAll(filtros: ListarUsuariosFiltros = {}): Promise<Usuario[]> {
  const params = new URLSearchParams({ page: '1', page_size: '100' })
  if (filtros.rol) params.set('rol', filtros.rol)
  if (filtros.estatus) params.set('estatus', filtros.estatus)
  if (filtros.search) params.set('search', filtros.search)
  const res = await api.get<{ data: UsuarioResponseDTO[] }>(`/admin/usuarios?${params.toString()}`)
  return res.data.map(usuarioBackendToFrontend)
}

export async function create(data: { nombre: string; email: string; password: string; rol: string; aseguradoraId?: string; telefono?: string }): Promise<Usuario> {
  const dto: CreateUsuarioRequestDTO = {
    nombre: data.nombre,
    email: data.email,
    password: data.password,
    rol: data.rol,
    aseguradora_id: data.aseguradoraId || null,
    telefono: data.telefono || null,
  }
  const res = await api.post<UsuarioResponseDTO>('/admin/usuarios', dto)
  return usuarioBackendToFrontend(res)
}

export async function update(id: string, data: { nombre?: string; email?: string; password?: string; rol?: string; aseguradoraId?: string; telefono?: string }): Promise<Usuario> {
  const dto: UpdateUsuarioRequestDTO = {
    nombre: data.nombre,
    email: data.email,
    password: data.password,
    rol: data.rol,
    aseguradora_id: data.aseguradoraId,
    telefono: data.telefono,
  }
  const res = await api.put<UsuarioResponseDTO>(`/admin/usuarios/${id}`, dto)
  return usuarioBackendToFrontend(res)
}

export async function remove(id: string): Promise<void> {
  await api.delete<UsuarioResponseDTO>(`/admin/usuarios/${id}`)
}

export async function bloqueoArco(usuarioId: string): Promise<void> {
  await api.post<never>(`/admin/usuarios/${usuarioId}/bloqueo-arco`, {})
}
