import { api } from '../../client'
import type { Ajustador, AjustadorResponseDTO, AjustadorCreateDTO, AjustadorUpdateDTO } from './ajustadores.schemas'

function ajustadorBackendToFrontend(dto: AjustadorResponseDTO): Ajustador {
  return {
    id: dto.id,
    usuarioId: dto.usuario_id,
    nombre: dto.nombre ?? '',
    email: dto.email ?? '',
    telefono: dto.telefono ?? '',
    especialidad: dto.cedula_profesional,
    incidentesAsignados: 0,
    estado: dto.deleted_at ? 'cancelado' : dto.activo_para_servicio ? 'aprobado' : 'pendiente',
  }
}

export async function getAll(): Promise<Ajustador[]> {
  const res = await api.get<{ data: AjustadorResponseDTO[] }>('/aseguradora/crud/ajustadores?page=1&page_size=100')
  return res.data.map((dto) => ajustadorBackendToFrontend(dto))
}

export async function create(data: Omit<Ajustador, 'id' | 'usuarioId' | 'incidentesAsignados' | 'estado'> & { password_temporal: string }): Promise<Ajustador> {
  const dto: AjustadorCreateDTO = {
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    password_temporal: data.password_temporal,
    cedula_profesional: data.especialidad,
  }
  const res = await api.post<AjustadorResponseDTO>('/aseguradora/crud/ajustadores', dto)
  return ajustadorBackendToFrontend(res)
}

export async function update(id: string, data: Omit<Ajustador, 'id' | 'usuarioId' | 'incidentesAsignados' | 'estado'>): Promise<Ajustador> {
  const dto: AjustadorUpdateDTO = {
    cedula_profesional: data.especialidad,
  }
  const res = await api.put<AjustadorResponseDTO>(`/aseguradora/crud/ajustadores/${id}`, dto)
  return ajustadorBackendToFrontend(res)
}

export async function remove(id: string): Promise<void> {
  await api.delete(`/aseguradora/crud/ajustadores/${id}`)
}
