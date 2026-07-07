import type { RoleVariant } from '../../../components/atoms/RoleBadge'
import type { ActionVariant } from '../../../components/atoms/ActionBadge'

export interface AuditResponse {
  id: string | null
  usuario_id: string | null
  aseguradora_id: string | null
  evento_modulo: string | null
  accion_realizada: string | null
  direccion_ip: string | null
  user_agent: string | null
  metadata_context: Record<string, unknown> | null
  created_at: string
}

export interface EventoAuditoria {
  id: string
  fechaHora: string
  usuario: string
  rolUsuario: RoleVariant
  accion: ActionVariant
  tablaAfectada: string
  detalle: string
  ip?: string
}
