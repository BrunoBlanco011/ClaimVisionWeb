import type { RoleVariant } from '../../../components/atoms/RoleBadge'
import type { ActionVariant } from '../../../components/atoms/ActionBadge'

// Catálogo real de `accion_realizada` expuesto por el backend (enum `AccionAudit`).
export const ACCIONES_AUDITORIA = [
  'actualizar_ajustador', 'actualizar_cliente', 'actualizar_consentimientos', 'actualizar_cotizacion',
  'actualizar_disponibilidad', 'actualizar_suscripcion', 'actualizar_taller', 'actualizar_usuario', 'actualizar_vehiculo',
  'agregar_dano', 'aprobar_cotizacion', 'asignar_ajustador', 'autorizar_entrega', 'bloqueo_arco', 'concluir_trabajo',
  'confirmar_datos', 'crear_ajustador', 'crear_cliente', 'crear_cotizacion', 'crear_desde_poliza', 'crear_operador',
  'crear_operador_taller', 'crear_taller', 'crear_usuario', 'crear_vehiculo', 'crear_vehiculo_desde_poliza',
  'desbloqueo_arco', 'desincorporar_aseguradora', 'editar_peritaje', 'editar_siniestro', 'eliminar_ajustador',
  'eliminar_taller', 'eliminar_usuario', 'eliminar_vehiculo', 'enviar_taller', 'listo_entrega', 'purga_aseguradora',
  'reactivar_aseguradora', 'rechazar_cotizacion', 'registrar_ajustador', 'registrar_peritaje', 'registrar_aseguradora',
  'reportar_siniestro', 'subir_imagen', 'verificar_aseguradora',
] as const

export type AccionAuditoria = (typeof ACCIONES_AUDITORIA)[number]

export interface AuditFiltros {
  fechaInicio?: string
  fechaFin?: string
  accion?: string
  modulo?: string
  rol?: string
}

export interface AuditResponse {
  id: string | null
  usuario_id: string | null
  usuario_rol: string | null
  aseguradora_id: string | null
  evento_modulo: string | null
  accion_realizada: string | null
  direccion_ip: string | null
  user_agent: string | null
  metadata_context: Record<string, unknown> | null
  created_at: string
}

export interface AuditDetailResponse extends AuditResponse {
  usuario_nombre: string | null
  usuario_email: string | null
}

export interface AuditoriaResumenResponse {
  total_eventos: number
  accesos_login: number
  cambios_configuracion: number
  cambios_CRUD: number
  dias: number
  fecha_desde: string
}

export interface EventoAuditoria {
  id: string
  fechaHora: string
  fechaHoraISO: string
  usuario: string
  rolUsuario: RoleVariant
  accion: ActionVariant
  accionRaw: string
  tablaAfectada: string
  detalle: string
  ip?: string
}
