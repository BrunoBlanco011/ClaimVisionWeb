import type { RoleVariant } from '../components/atoms/RoleBadge'

export type EstatusUsuario = 'Activo' | 'Inactivo'

export interface UsuarioSistema {
  id: string
  nombre: string
  email: string
  rolUsuario: RoleVariant
  aseguradoraOTaller?: string
  estatus: EstatusUsuario
  ultimoAcceso: string
}
