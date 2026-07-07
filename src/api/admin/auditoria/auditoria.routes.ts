import { api } from '../../client'
import type { RoleVariant } from '../../../components/atoms/RoleBadge'
import type { ActionVariant } from '../../../components/atoms/ActionBadge'
import type { PaginatedResponse } from '../aseguradoras/aseguradoras.schemas'
import type { EventoAuditoria, AuditResponse } from './auditoria.schemas'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: EventoAuditoria[] = [
  { id: '1', fechaHora: '30/06/2026 14:23:05', usuario: 'Sistema', rolUsuario: 'Administrador_Global', accion: 'LOGIN', tablaAfectada: 'usuarios', detalle: 'Inicio de sesión exitoso', ip: '192.168.1.10' },
]

// El backend registra acciones en español (p. ej. "asignar_ajustador",
// "crear_taller"), no los 5 valores fijos de ActionVariant — se clasifican por
// prefijo/heurística para elegir el color del badge.
function classifyAccion(accion: string | null): ActionVariant {
  const a = (accion ?? '').toLowerCase()
  if (a.startsWith('crear') || a.startsWith('registrar') || a.startsWith('reportar')) return 'CREATE'
  if (a.startsWith('eliminar') || a.includes('desincorporar') || a.includes('rechazar') || a.includes('bloqueo_arco')) return 'DELETE'
  if (a.startsWith('asignar') || a.startsWith('enviar') || a.includes('autorizar') || a.includes('aprobar') || a.includes('verificar') || a.includes('concluir') || a.includes('listo_entrega')) return 'ASSIGN'
  return 'UPDATE'
}

function eventoAuditoriaBackendToFrontend(dto: AuditResponse): EventoAuditoria {
  return {
    id: dto.id ?? '',
    fechaHora: new Date(dto.created_at).toLocaleString('es-MX'),
    usuario: dto.usuario_id ?? '—',
    rolUsuario: 'Administrador_Global' as RoleVariant,
    accion: classifyAccion(dto.accion_realizada),
    tablaAfectada: dto.evento_modulo ?? '—',
    detalle: dto.metadata_context ? JSON.stringify(dto.metadata_context) : '—',
    ip: dto.direccion_ip ?? undefined,
  }
}

export async function getAll(page: number = 1, pageSize: number = 20): Promise<{ items: EventoAuditoria[]; total: number; page: number; pageSize: number; totalPages: number }> {
  if (MOCK) {
    await delay(300)
    return { items: [...mockData], total: mockData.length, page: 1, pageSize: 20, totalPages: 1 }
  }
  const res = await api.get<PaginatedResponse<AuditResponse>>(`/admin/auditoria/logs?page=${page}&page_size=${pageSize}`)
  return {
    items: res.data.map(eventoAuditoriaBackendToFrontend),
    total: res.total,
    page: res.page,
    pageSize: res.page_size,
    totalPages: res.page_size > 0 ? Math.ceil(res.total / res.page_size) : 0,
  }
}
