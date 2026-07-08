export interface EstatusCountDTO {
  estatus: string
  count: number
}

export interface SiniestrosPorMesDTO {
  mes: string
  count: number
}

export interface DashboardResumenDTO {
  total_siniestros: number
  siniestros_por_estatus: EstatusCountDTO[]
  siniestros_por_mes: SiniestrosPorMesDTO[]
  usuarios_activos: number
  total_aseguradoras: number
  aseguradoras_activas: number
  total_talleres: number
  talleres_pendientes: number
}
