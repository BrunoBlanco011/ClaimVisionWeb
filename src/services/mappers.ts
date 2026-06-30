import type { TallerResponseDTO, Taller } from '../types'
import type { AjustadorResponseDTO, AjustadorCreateDTO, Ajustador } from '../types'
import type { SiniestroResponseDTO } from '../types'
import type { SiniestroTecnicoDTO, Expediente } from '../types'
import type { StatusVariant } from '../types'

const STATUS_MAP: Record<string, StatusVariant> = {
  REPORTADO_PRELIMINAR: 'pendiente',
  ASIGNADO_A_AJUSTADOR: 'en_progreso',
  PERITAJE_VALIDADO: 'aprobado',
  ASIGNADO_A_TALLER: 'en_progreso',
  TRABAJO_CONCLUIDO: 'completado',
  LISTO_PARA_ENTREGA: 'completado',
  ENTREGADO: 'completado',
}

const STATUS_TALLER_MAP: Record<string, StatusVariant> = {
  REPORTADO_PRELIMINAR: 'pendiente',
  ASIGNADO_A_AJUSTADOR: 'pendiente',
  PERITAJE_VALIDADO: 'pendiente',
  ASIGNADO_A_TALLER: 'en_progreso',
  TRABAJO_CONCLUIDO: 'completado',
  LISTO_PARA_ENTREGA: 'completado',
  ENTREGADO: 'completado',
}

export function tallerBackendToFrontend(dto: TallerResponseDTO, nombre?: string, email?: string): Taller {
  return {
    id: dto.id,
    nombre: nombre ?? dto.nombre_comercial,
    direccion: dto.direccion_tecnica,
    contacto: email ?? '',
    telefono: dto.telefono_contacto,
    capacidad: 0,
    estado: dto.deleted_at ? 'cancelado' : 'pendiente',
  }
}

export function ajustadorBackendToFrontend(
  dto: AjustadorResponseDTO,
  nombre?: string,
  email?: string,
  telefono?: string,
): Ajustador {
  return {
    id: dto.id,
    nombre: nombre ?? '',
    email: email ?? '',
    telefono: telefono ?? '',
    especialidad: dto.cedula_profesional,
    incidentesAsignados: 0,
    estado: dto.deleted_at ? 'cancelado' : dto.activo_para_servicio ? 'aprobado' : 'pendiente',
  }
}

export function ajustadorToCreateDTO(
  data: {
    nombre: string
    email: string
    telefono: string
    password_temporal: string
    cedula_profesional: string
  },
): AjustadorCreateDTO {
  return {
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    password_temporal: data.password_temporal,
    cedula_profesional: data.cedula_profesional,
  }
}

export function siniestroBackendToFrontend(dto: SiniestroResponseDTO, clienteNombre?: string) {
  return {
    id: dto.id,
    numero: dto.id.slice(0, 8).toUpperCase(),
    tipo: 'Accidente',
    asegurado: clienteNombre ?? dto.cliente_id,
    fecha: new Date(dto.fecha_siniestro).toLocaleDateString('es-MX'),
    estado: STATUS_MAP[dto.estatus] ?? ('pendiente' as StatusVariant),
    prioridad: 'Media' as const,
    vehiculo: `${dto.vehiculo_marca} ${dto.vehiculo_modelo} ${dto.vehiculo_anio}`,
    placa: dto.vehiculo_placas,
  }
}

export function expedienteBackendToFrontend(dto: SiniestroTecnicoDTO): Expediente {
  return {
    id: dto.id,
    numero: dto.id.slice(0, 8).toUpperCase(),
    aseguradora: '',
    fechaIngreso: new Date(dto.fecha_siniestro).toLocaleDateString('es-MX'),
    estado: STATUS_TALLER_MAP[dto.estatus] ?? ('pendiente' as StatusVariant),
    vehiculo: `${dto.vehiculo_marca} ${dto.vehiculo_modelo} ${dto.vehiculo_anio}`,
    placa: '',
  }
}
