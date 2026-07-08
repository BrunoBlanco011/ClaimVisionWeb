import { api } from '../../client'
import type { DashboardResumenDTO } from './dashboard.schemas'

export async function getResumen(): Promise<DashboardResumenDTO> {
  return api.get<DashboardResumenDTO>('/admin/dashboard/resumen')
}
