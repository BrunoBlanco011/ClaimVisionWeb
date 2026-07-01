export type EstatusTallerAdmin = 'Verificado' | 'Pendiente'

export interface TallerAdmin {
  id: string
  nombre: string
  ciudadEstado: string
  aseguradoraVinculada?: string
  capacidadOcupada: number
  ordenesActivas: number
  calificacion: number | null
  estatus: EstatusTallerAdmin
}
