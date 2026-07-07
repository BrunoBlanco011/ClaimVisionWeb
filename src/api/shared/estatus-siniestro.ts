import type { StatusVariant } from './status'

// Ciclo de vida real del siniestro (backend: src/shared/domain/models.py::EstatusSiniestro).
// El valor en el wire usa Title_Case_Con_Guion_Bajo, no MAYUSCULAS — ojo al agregar entradas.
export const SINIESTRO_ORDEN = [
  'Reportado_Preliminar',
  'Asignado_A_Ajustador',
  'Peritaje_Validado',
  'Asignado_A_Taller',
  'Trabajo_Concluido',
  'Listo_Para_Entrega',
  'Entregado',
] as const

export const ESTATUS_A_STATUS_ASEGURADORA: Record<string, StatusVariant> = {
  Reportado_Preliminar: 'pendiente',
  Asignado_A_Ajustador: 'en_progreso',
  Peritaje_Validado: 'aprobado',
  Asignado_A_Taller: 'en_progreso',
  Trabajo_Concluido: 'completado',
  Listo_Para_Entrega: 'completado',
  Entregado: 'completado',
}

export const ESTATUS_A_STATUS_TALLER: Record<string, StatusVariant> = {
  Reportado_Preliminar: 'pendiente',
  Asignado_A_Ajustador: 'pendiente',
  Peritaje_Validado: 'pendiente',
  Asignado_A_Taller: 'en_progreso',
  Trabajo_Concluido: 'completado',
  Listo_Para_Entrega: 'completado',
  Entregado: 'completado',
}

export interface TimelineEvent {
  evento: string
  detalle: string
  tiempo: string
}

const TIMELINE_LABELS: Record<string, string> = {
  Reportado_Preliminar: 'Siniestro reportado',
  Asignado_A_Ajustador: 'Ajustador asignado',
  Peritaje_Validado: 'Peritaje validado',
  Asignado_A_Taller: 'Enviado a taller',
  Trabajo_Concluido: 'Trabajo concluido',
  Listo_Para_Entrega: 'Listo para entrega',
  Entregado: 'Vehículo entregado',
}

// El backend no guarda un historial de transiciones; se reconstruye la línea de
// tiempo en cliente a partir del ciclo de vida fijo del siniestro (ver
// src/shared/domain/transitions.py::construir_timeline en el backend).
export function construirTimeline(estatusActual: string): TimelineEvent[] {
  const idxActual = SINIESTRO_ORDEN.indexOf(estatusActual as (typeof SINIESTRO_ORDEN)[number])
  return SINIESTRO_ORDEN.filter((_, i) => idxActual >= 0 && i <= idxActual).map((estatus) => ({
    evento: TIMELINE_LABELS[estatus] ?? estatus,
    detalle: '',
    tiempo: '',
  }))
}
