import { api } from '../../client'
import type { TallerAdmin, TallerAdminResponseDTO } from './talleres.schemas'

function tallerAdminBackendToFrontend(dto: TallerAdminResponseDTO): TallerAdmin {
  return {
    id: dto.id,
    nombre: dto.nombre_comercial,
    rfc: dto.rfc,
    direccion: dto.direccion_tecnica,
    telefono: dto.telefono_contacto,
    aseguradorasVinculadas: dto.aseguradoras_vinculadas,
    activo: dto.deleted_at === null,
  }
}

export async function getAll(): Promise<TallerAdmin[]> {
  const res = await api.get<{ data: TallerAdminResponseDTO[] }>('/admin/talleres?page=1&page_size=100')
  return res.data.map(tallerAdminBackendToFrontend)
}

export async function getById(id: string): Promise<TallerAdmin> {
  const dto = await api.get<TallerAdminResponseDTO>(`/admin/talleres/${id}`)
  return tallerAdminBackendToFrontend(dto)
}
