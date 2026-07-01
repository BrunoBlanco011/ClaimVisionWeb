import { api } from '../api'
import { eventoAuditoriaBackendToFrontend } from '../mappers'
import type { EventoAuditoria, AuditResponse, PaginatedResponse } from '../../types'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: EventoAuditoria[] = [
  { id: '1', fechaHora: '30/06/2026 14:23:05', usuario: 'Sistema', rolUsuario: 'Administrador_Global', accion: 'LOGIN', tablaAfectada: 'usuarios', detalle: 'Inicio de sesión exitoso', ip: '192.168.1.10' },
  { id: '2', fechaHora: '30/06/2026 13:15:42', usuario: 'María López', rolUsuario: 'Operador_Aseguradora', accion: 'UPDATE', tablaAfectada: 'incidentes', detalle: 'Actualizó estado del incidente INC-2026-0142 a "en_progreso"', ip: '192.168.1.25' },
  { id: '3', fechaHora: '30/06/2026 12:00:18', usuario: 'Juan Pérez', rolUsuario: 'Ajustador', accion: 'ASSIGN', tablaAfectada: 'peritajes', detalle: 'Se asignó al incidente INC-2026-0189', ip: '10.0.0.45' },
  { id: '4', fechaHora: '29/06/2026 18:30:00', usuario: 'Sistema', rolUsuario: 'Administrador_Global', accion: 'CREATE', tablaAfectada: 'aseguradoras', detalle: 'Creó nueva aseguradora: Previsión Total', ip: '192.168.1.10' },
  { id: '5', fechaHora: '29/06/2026 16:45:12', usuario: 'Admin Taller', rolUsuario: 'Operador_Taller', accion: 'DELETE', tablaAfectada: 'presupuestos', detalle: 'Eliminó presupuesto PRE-2026-0089', ip: '10.0.1.100' },
  { id: '6', fechaHora: '29/06/2026 14:00:33', usuario: 'Carlos Ruiz', rolUsuario: 'Cliente', accion: 'LOGIN', tablaAfectada: 'usuarios', detalle: 'Inicio de sesión fallido (contraseña incorrecta)', ip: '201.144.55.22' },
]

export async function getAll(page: number = 1, pageSize: number = 20): Promise<{ items: EventoAuditoria[]; total: number; page: number; pageSize: number; totalPages: number }> {
  if (MOCK) {
    await delay(300)
    return { items: [...mockData], total: mockData.length, page: 1, pageSize: 20, totalPages: 1 }
  }
  const res = await api.get<PaginatedResponse<AuditResponse>>(`/admin/auditoria/logs?page=${page}&page_size=${pageSize}`)
  return {
    items: res.items.map(eventoAuditoriaBackendToFrontend),
    total: res.total,
    page: res.page,
    pageSize: res.page_size,
    totalPages: res.total_pages,
  }
}
