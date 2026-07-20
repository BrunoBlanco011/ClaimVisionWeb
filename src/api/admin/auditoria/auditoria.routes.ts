import { api } from '../../client'
import type { RoleVariant } from '../../../components/atoms/RoleBadge'
import type { ActionVariant } from '../../../components/atoms/ActionBadge'
import type { PaginatedResponse } from '../aseguradoras/aseguradoras.schemas'
import type { AuditResponse, AuditDetailResponse, AuditoriaResumenResponse, EventoAuditoria, AuditFiltros } from './auditoria.schemas'

const ROLE_VARIANTS: RoleVariant[] = ['Administrador_Global', 'Operador_Aseguradora', 'Ajustador', 'Operador_Taller', 'Cliente']

// El backend no documenta un enum de roles: se compara sin distinguir mayúsculas
// y se cae a 'Cliente' (badge neutro) si llega un valor que no reconocemos.
function normalizeRol(rol: string | null): RoleVariant {
  const match = ROLE_VARIANTS.find((r) => r.toLowerCase() === (rol ?? '').toLowerCase())
  return match ?? 'Cliente'
}

const ACCION_BUCKETS: Record<string, ActionVariant> = {
  actualizar_ajustador: 'UPDATE', actualizar_cliente: 'UPDATE', actualizar_consentimientos: 'UPDATE',
  actualizar_cotizacion: 'UPDATE', actualizar_disponibilidad: 'UPDATE', actualizar_suscripcion: 'UPDATE',
  actualizar_taller: 'UPDATE', actualizar_usuario: 'UPDATE', actualizar_vehiculo: 'UPDATE',
  editar_peritaje: 'UPDATE', editar_siniestro: 'UPDATE',

  agregar_dano: 'CREATE', confirmar_datos: 'CREATE', crear_ajustador: 'CREATE', crear_cliente: 'CREATE',
  crear_cotizacion: 'CREATE', crear_desde_poliza: 'CREATE', crear_operador: 'CREATE', crear_operador_taller: 'CREATE',
  crear_taller: 'CREATE', crear_usuario: 'CREATE', crear_vehiculo: 'CREATE', crear_vehiculo_desde_poliza: 'CREATE',
  registrar_ajustador: 'CREATE', registrar_peritaje: 'CREATE', registrar_aseguradora: 'CREATE',
  reportar_siniestro: 'CREATE', subir_imagen: 'CREATE',

  bloqueo_arco: 'DELETE', desincorporar_aseguradora: 'DELETE', eliminar_ajustador: 'DELETE',
  eliminar_taller: 'DELETE', eliminar_usuario: 'DELETE', eliminar_vehiculo: 'DELETE',
  purga_aseguradora: 'DELETE', rechazar_cotizacion: 'DELETE',

  aprobar_cotizacion: 'ASSIGN', asignar_ajustador: 'ASSIGN', autorizar_entrega: 'ASSIGN',
  concluir_trabajo: 'ASSIGN', desbloqueo_arco: 'ASSIGN', enviar_taller: 'ASSIGN',
  listo_entrega: 'ASSIGN', reactivar_aseguradora: 'ASSIGN', verificar_aseguradora: 'ASSIGN',
}

function classifyAccion(accion: string | null): ActionVariant {
  return ACCION_BUCKETS[accion ?? ''] ?? 'UPDATE'
}

function eventoAuditoriaBackendToFrontend(dto: AuditResponse): EventoAuditoria {
  return {
    id: dto.id ?? '',
    fechaHora: new Date(dto.created_at).toLocaleString('es-MX'),
    fechaHoraISO: dto.created_at,
    usuario: dto.usuario_id ?? '—',
    rolUsuario: normalizeRol(dto.usuario_rol),
    accion: classifyAccion(dto.accion_realizada),
    accionRaw: dto.accion_realizada ?? '—',
    tablaAfectada: dto.evento_modulo ?? '—',
    detalle: dto.metadata_context ? JSON.stringify(dto.metadata_context) : '—',
    ip: dto.direccion_ip ?? undefined,
  }
}

function filtrosToQuery(filtros: AuditFiltros): string {
  const params = new URLSearchParams()
  if (filtros.fechaInicio) params.set('fecha_inicio', filtros.fechaInicio)
  if (filtros.fechaFin) params.set('fecha_fin', filtros.fechaFin)
  if (filtros.accion) params.set('accion_realizada', filtros.accion)
  if (filtros.modulo) params.set('evento_modulo', filtros.modulo)
  if (filtros.rol) params.set('usuario_rol', filtros.rol)
  return params.toString()
}

export async function getAll(
  page: number = 1,
  pageSize: number = 20,
  filtros: AuditFiltros = {},
): Promise<{ items: EventoAuditoria[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const query = filtrosToQuery(filtros)
  const res = await api.get<PaginatedResponse<AuditResponse>>(
    `/admin/auditoria/logs?page=${page}&page_size=${pageSize}${query ? `&${query}` : ''}`,
  )
  return {
    items: res.data.map(eventoAuditoriaBackendToFrontend),
    total: res.total,
    page: res.page,
    pageSize: res.page_size,
    totalPages: res.page_size > 0 ? Math.ceil(res.total / res.page_size) : 0,
  }
}

export async function getDetalle(logId: string): Promise<AuditDetailResponse> {
  return api.get<AuditDetailResponse>(`/admin/auditoria/logs/${logId}`)
}

export async function getResumen(dias: number = 30): Promise<AuditoriaResumenResponse> {
  return api.get<AuditoriaResumenResponse>(`/admin/auditoria/resumen?dias=${dias}`)
}

export async function exportCsv(filtros: AuditFiltros = {}): Promise<Blob> {
  const query = filtrosToQuery(filtros)
  return api.getBlob(`/admin/auditoria/logs/export${query ? `?${query}` : ''}`)
}
