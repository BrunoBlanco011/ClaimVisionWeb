export { api } from './api'
export { login, logout } from './auth.service'
export type { LoginResult } from './auth.service'

export {
  getAll as getIncidentes,
  getById as getIncidenteById,
  assignAjustador,
  assignTaller,
} from './siniestros.service'

export {
  getAll as getExpedientes,
  getById as getExpedienteById,
} from './expedientes.service'

export {
  create as createPresupuesto,
} from './presupuestos.service'
export type { CreatePresupuestoData } from './presupuestos.service'

export {
  getAll as getAjustadores,
  create as createAjustador,
  update as updateAjustador,
  remove as removeAjustador,
} from './ajustadores.service'

export {
  getAll as getTalleres,
  create as createTaller,
  update as updateTaller,
  remove as removeTaller,
} from './talleres.service'

export {
  getAll as getTrabajos,
} from './trabajos.service'

export {
  getAll as getPeritajes,
  getPendingCount as getPeritajesPendientesCount,
} from './peritajes.service'
