import { api } from '../../client'
import type { PerfilAseguradora, PerfilAseguradoraDTO, PerfilAseguradoraUpdateDTO } from './perfil.schemas'

function perfilBackendToFrontend(dto: PerfilAseguradoraDTO): PerfilAseguradora {
  return {
    id: dto.id,
    nombre: dto.nombre,
    rfc: dto.rfc,
    dominioCorreo: dto.dominio_correo,
    contactoLegalEmail: dto.contacto_legal_email,
    plan: dto.plan_suscripcion,
    limitePeritajesMes: dto.limite_peritajes_mes,
    peritajesConsumidosMes: dto.peritajes_consumidos_mes,
    estatusComercial: dto.estatus_comercial,
    desde: dto.created_at,
  }
}

export async function getPerfil(): Promise<PerfilAseguradora> {
  const dto = await api.get<PerfilAseguradoraDTO>('/aseguradora/perfil')
  return perfilBackendToFrontend(dto)
}

export async function updatePerfil(data: { nombre: string; rfc: string; dominioCorreo: string; contactoLegalEmail: string; operadorNombre?: string; operadorEmail?: string; operadorTelefono?: string }): Promise<PerfilAseguradora> {
  const dto: PerfilAseguradoraUpdateDTO = {
    nombre: data.nombre,
    rfc: data.rfc,
    dominio_correo: data.dominioCorreo,
    contacto_legal_email: data.contactoLegalEmail,
    operador_nombre: data.operadorNombre,
    operador_email: data.operadorEmail,
    operador_telefono: data.operadorTelefono,
  }
  const res = await api.put<PerfilAseguradoraDTO>('/aseguradora/perfil', dto)
  return perfilBackendToFrontend(res)
}
