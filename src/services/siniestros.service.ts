import { api } from './api'
import { siniestroBackendToFrontend } from './mappers'
import type {
  Incidente,
  IncidenteDetalle,
  TimelineEvent,
  SiniestroResponseDTO,
  AsignarAjustadorDTO,
  EnviarTallerDTO,
} from '../types'

const MOCK_LIST = false
const MOCK_DETAIL = true

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockIncidentes: Incidente[] = [
  { id: '1', numero: 'INC-2026-001', tipo: 'Colisión leve', asegurado: 'Juan Pérez', fecha: '15/06/2026', estado: 'pendiente', prioridad: 'Alta' },
  { id: '2', numero: 'INC-2026-002', tipo: 'Daño por granizo', asegurado: 'María García', fecha: '14/06/2026', estado: 'en_progreso', prioridad: 'Media' },
  { id: '3', numero: 'INC-2026-003', tipo: 'Choque trasero', asegurado: 'Carlos López', fecha: '12/06/2026', estado: 'completado', prioridad: 'Alta' },
  { id: '4', numero: 'INC-2026-004', tipo: 'Rotura de parabrisas', asegurado: 'Ana Martínez', fecha: '10/06/2026', estado: 'pendiente', prioridad: 'Baja' },
  { id: '5', numero: 'INC-2026-005', tipo: 'Incendio', asegurado: 'Roberto Sánchez', fecha: '08/06/2026', estado: 'aprobado', prioridad: 'Alta' },
  { id: '6', numero: 'INC-2026-006', tipo: 'Robo', asegurado: 'Laura Jiménez', fecha: '07/06/2026', estado: 'rechazado', prioridad: 'Alta' },
  { id: '7', numero: 'INC-2026-007', tipo: 'Daño por inundación', asegurado: 'Pedro Gómez', fecha: '05/06/2026', estado: 'pendiente', prioridad: 'Media' },
  { id: '8', numero: 'INC-2026-008', tipo: 'Colisión múltiple', asegurado: 'Sofía Herrera', fecha: '03/06/2026', estado: 'completado', prioridad: 'Alta' },
]

const mockEvidencias: Record<string, { id: string; url: string; descripcion: string; fecha: string }[]> = {
  '1': [
    { id: 'e1', url: 'https://placehold.co/400x300/1e3a5f/fff?text=Frontal', descripcion: 'Vista frontal del vehículo', fecha: '15/06/2026' },
    { id: 'e2', url: 'https://placehold.co/400x300/2563eb/fff?text=Lateral', descripcion: 'Lateral izquierdo', fecha: '15/06/2026' },
    { id: 'e3', url: 'https://placehold.co/400x300/0891b2/fff?text=Parachoques', descripcion: 'Parachoques delantero', fecha: '15/06/2026' },
    { id: 'e4', url: 'https://placehold.co/400x300/059669/fff?text=Faro', descripcion: 'Faro izquierdo', fecha: '15/06/2026' },
  ],
  '2': [
    { id: 'e5', url: 'https://placehold.co/400x300/1e3a5f/fff?text=Cofre', descripcion: 'Cofre con abolladuras', fecha: '14/06/2026' },
    { id: 'e6', url: 'https://placehold.co/400x300/d97706/fff?text=Techo', descripcion: 'Techo con daños por granizo', fecha: '14/06/2026' },
    { id: 'e7', url: 'https://placehold.co/400x300/dc2626/fff?text=Costado', descripcion: 'Costado derecho', fecha: '14/06/2026' },
  ],
  '3': [
    { id: 'e8', url: 'https://placehold.co/400x300/1e3a5f/fff?text=Trasera', descripcion: 'Vista trasera del vehículo', fecha: '12/06/2026' },
    { id: 'e9', url: 'https://placehold.co/400x300/7c3aed/fff?text=Defensa', descripcion: 'Defensa trasera', fecha: '12/06/2026' },
  ],
}

const mockPeritajes: Record<string, { id: string; ajustador: string; fecha: string; montoEstimado: number; descripcion: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }> = {
  '1': { id: 'p1', ajustador: 'Carlos Mendoza', fecha: '16/06/2026', montoEstimado: 15300, descripcion: 'Reemplazo de parachoques delantero, radiador y faro izquierdo. Mano de obra estimada en 8 horas.', estado: 'pendiente' },
  '2': { id: 'p2', ajustador: 'María García', fecha: '15/06/2026', montoEstimado: 28400, descripcion: 'Reparación de 3 paneles con abolladuras. Pintura completa de cofre y techo.', estado: 'aprobado' },
}

const mockDetalles: Record<string, IncidenteDetalle> = {
  '1': { id: '1', numero: 'INC-2026-001', tipo: 'Colisión leve', asegurado: 'Juan Pérez', fecha: '15/06/2026', estado: 'pendiente', prioridad: 'Alta', aseguradora: 'Seguros Atlas', vehiculo: 'Toyota Corolla 2020', placa: 'ABC-1234', taller: '—', descripcion: 'Colisión frontal leve contra barrera de contención en Av. Principal. El vehículo presenta daños en el parachoques delantero, radiador y faro izquierdo. No se reportaron lesionados.', ajustadorAsignado: null, evidencias: mockEvidencias['1'], peritaje: mockPeritajes['1'] },
  '2': { id: '2', numero: 'INC-2026-002', tipo: 'Daño por granizo', asegurado: 'María García', fecha: '14/06/2026', estado: 'en_progreso', prioridad: 'Media', aseguradora: 'Aseguradora del Sur', vehiculo: 'Honda Civic 2022', placa: 'DEF-5678', taller: 'Taller Central', descripcion: 'Granizada severa en Colonia del Valle. Múltiples abolladuras en cofre, techo y costados. Requiere reparación de pintura en 3 paneles.', ajustadorAsignado: 'Carlos Mendoza', evidencias: mockEvidencias['2'], peritaje: mockPeritajes['2'] },
  '3': { id: '3', numero: 'INC-2026-003', tipo: 'Choque trasero', asegurado: 'Carlos López', fecha: '12/06/2026', estado: 'completado', prioridad: 'Alta', aseguradora: 'Seguros Atlas', vehiculo: 'Nissan Versa 2021', placa: 'GHI-9012', taller: 'Taller Norte', descripcion: 'Impacto trasero en semáforo. Daños en defensa trasera, cajuela y luz trasera izquierda. Se realizó reparación completa.', ajustadorAsignado: 'María García', evidencias: mockEvidencias['3'], peritaje: null },
}

const mockTimeline: Record<string, TimelineEvent[]> = {
  '1': [
    { evento: 'Incidente reportado', detalle: 'Por asegurado vía web', tiempo: '15/06 09:30' },
    { evento: 'Caso abierto', detalle: 'Asignado a bandeja de pendientes', tiempo: '15/06 09:35' },
    { evento: 'En revisión', detalle: 'Pendiente de asignación de ajustador', tiempo: '15/06 10:00' },
  ],
  '2': [
    { evento: 'Incidente reportado', detalle: 'Por asegurado vía web', tiempo: '14/06 14:20' },
    { evento: 'Caso abierto', detalle: 'Asignado a bandeja de pendientes', tiempo: '14/06 14:25' },
    { evento: 'Ajustador asignado', detalle: 'Carlos Mendoza', tiempo: '14/06 16:00' },
    { evento: 'En reparación', detalle: 'Taller Central asignado', tiempo: '15/06 09:00' },
  ],
  '3': [
    { evento: 'Incidente reportado', detalle: 'Por asegurado vía web', tiempo: '12/06 08:15' },
    { evento: 'Caso abierto', detalle: 'Asignado a bandeja de pendientes', tiempo: '12/06 08:20' },
    { evento: 'Ajustador asignado', detalle: 'María García', tiempo: '12/06 10:00' },
    { evento: 'Presupuesto aprobado', detalle: 'Taller Norte - $12,300', tiempo: '14/06 11:30' },
    { evento: 'Reparación completada', detalle: 'Vehículo entregado al asegurado', tiempo: '20/06 17:00' },
  ],
}

export async function getAll(): Promise<Incidente[]> {
  if (MOCK_LIST) {
    await delay(300)
    return [...mockIncidentes]
  }
  const res = await api.get<{ data: SiniestroResponseDTO[] }>('/aseguradora/siniestros?offset=0&limit=200')
  return res.data.map((dto) => siniestroBackendToFrontend(dto))
}

export async function getById(id: string): Promise<{ incidente: IncidenteDetalle; timeline: TimelineEvent[] }> {
  if (MOCK_DETAIL) {
    await delay(200)
    const incidente = mockDetalles[id]
    const timeline = mockTimeline[id] ?? []
    if (!incidente) throw new Error('Incidente no encontrado')
    return { incidente, timeline }
  }
  return api.get<{ incidente: IncidenteDetalle; timeline: TimelineEvent[] }>(`/aseguradora/siniestros/${id}`)
}

export async function assignAjustador(incidenteId: string, ajustadorId: string): Promise<void> {
  if (MOCK_LIST) {
    await delay(300)
    return
  }
  const dto: AsignarAjustadorDTO = { ajustador_id: ajustadorId }
  await api.post(`/aseguradora/siniestros/${incidenteId}/asignar-ajustador`, dto)
}

export async function assignTaller(incidenteId: string, tallerId: string): Promise<void> {
  if (MOCK_LIST) {
    await delay(300)
    return
  }
  const dto: EnviarTallerDTO = { taller_id: tallerId }
  await api.post(`/aseguradora/siniestros/${incidenteId}/enviar-taller`, dto)
}
