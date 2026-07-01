import type { RoleVariant } from '../components/atoms/RoleBadge'
import type { ActionVariant } from '../components/atoms/ActionBadge'

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
