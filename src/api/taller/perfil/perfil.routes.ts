import { api } from '../../client'
import type { TallerPerfil, TallerPerfilResponseDTO, TallerPerfilUpdateRequestDTO } from './perfil.schemas'

function perfilBackendToFrontend(dto: TallerPerfilResponseDTO): TallerPerfil {
  return {
    tallerId: dto.id,
    nombreComercial: dto.nombre_comercial,
    rfc: dto.rfc,
    direccion: dto.direccion_tecnica,
    telefonoContacto: dto.telefono_contacto,
    operadorNombre: dto.nombre ?? '',
    operadorEmail: dto.email ?? '',
    operadorTelefono: dto.telefono ?? '',
  }
}

export async function getPerfil(): Promise<TallerPerfil> {
  const dto = await api.get<TallerPerfilResponseDTO>('/taller/perfil')
  return perfilBackendToFrontend(dto)
}

export async function updatePerfil(data: { nombreComercial: string; direccion: string; telefonoContacto: string; operadorNombre: string; operadorTelefono: string }): Promise<TallerPerfil> {
  const dto: TallerPerfilUpdateRequestDTO = {
    nombre_comercial: data.nombreComercial,
    direccion_tecnica: data.direccion,
    telefono_contacto: data.telefonoContacto,
    nombre: data.operadorNombre,
    telefono: data.operadorTelefono,
  }
  const res = await api.put<TallerPerfilResponseDTO>('/taller/perfil', dto)
  return perfilBackendToFrontend(res)
}
