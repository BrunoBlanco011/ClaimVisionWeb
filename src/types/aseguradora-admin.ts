import type { PlanTier } from '../components/organisms/InsurerCard'

export type EstatusAseguradora = 'Activa' | 'Inactiva'

export interface AseguradoraAdmin {
  id: string
  nombre: string
  rfc: string
  estatus: EstatusAseguradora
  operadores: number
  ajustadores: number
  siniestrosActivos: number
  talleres: number
  plan: PlanTier
}
