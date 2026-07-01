export type { StatusVariant } from './status'

export type { Prioridad, Incidente, IncidenteDetalle, TimelineEvent, EvidenciaFoto, Peritaje, PeritajeEstado } from './incidentes'
export type { Expediente, SiniestroTecnicoDTO, DanoAjustadoDTO, PeritajeAjustadorTecnicoDTO, CotizacionTallerDTO, ExpedienteTecnicoResponseDTO, MessageResponseDTO } from './expedientes'
export type { Presupuesto, Part, VehicleData, GuardarPresupuestoRequestDTO, CotizacionTallerResponseDTO } from './presupuestos'
export type { Ajustador, AjustadorResponseDTO, AjustadorCreateDTO, AjustadorUpdateDTO } from './ajustadores'
export type { Taller, TallerResponseDTO, TallerCreateDTO, TallerUpdateDTO } from './talleres'
export type { Trabajo } from './trabajos'
export type { LoginRequest, LoginResponseDTO } from './auth'
export type { SiniestroResponseDTO, AsignarAjustadorDTO, EnviarTallerDTO } from './siniestro'

export type { UsuarioSistema, EstatusUsuario } from './usuarios'
export type { AseguradoraAdmin, EstatusAseguradora } from './aseguradora-admin'
export type { TallerAdmin, EstatusTallerAdmin } from './taller-admin'
export type { EventoAuditoria } from './auditoria'

export type {
  AseguradoraResponseDTO,
  AseguradoraRequestDTO,
  UpdateAseguradoraDTO,
  UpdateSuscripcionDTO,
  OperadorAseguradoraRequestDTO,
  PaginatedResponse,
} from './admin-aseguradoras'

export type { AuditResponse } from './admin-auditoria'
