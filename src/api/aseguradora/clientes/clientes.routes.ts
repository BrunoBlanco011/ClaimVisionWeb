import { api } from '../../client'
import type {
  Cliente,
  ClienteResponseDTO,
  ClienteCreateDTO,
  DocumentoCliente,
  DocumentoItemDTO,
  DocumentosCliente,
  DocumentosClienteResponseDTO,
} from './clientes.schemas'

function clienteBackendToFrontend(dto: ClienteResponseDTO): Cliente {
  return {
    id: dto.id,
    usuarioId: dto.usuario_id,
    nombre: dto.nombre ?? '',
    email: dto.email ?? '',
    telefono: dto.telefono ?? '',
    numeroPoliza: dto.numero_poliza,
    vigenciaPoliza: dto.vigencia_poliza,
  }
}

function documentoBackendToFrontend(dto: DocumentoItemDTO | null): DocumentoCliente | null {
  if (!dto) return null
  return { url: dto.url, tipo: dto.tipo, subidoEn: dto.subido_en }
}

export async function getAll(): Promise<Cliente[]> {
  const res = await api.get<{ data: ClienteResponseDTO[] }>('/aseguradora/crud/clientes?page=1&page_size=100')
  return res.data.map((dto) => clienteBackendToFrontend(dto))
}

export async function getById(id: string): Promise<Cliente> {
  const dto = await api.get<ClienteResponseDTO>(`/aseguradora/crud/clientes/${id}`)
  return clienteBackendToFrontend(dto)
}

export async function create(data: { nombre: string; email: string; telefono: string; passwordTemporal: string }): Promise<Cliente> {
  const dto: ClienteCreateDTO = {
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    password_temporal: data.passwordTemporal,
  }
  const res = await api.post<ClienteResponseDTO>('/aseguradora/crud/clientes', dto)
  return clienteBackendToFrontend(res)
}

export async function getDocumentos(id: string): Promise<DocumentosCliente> {
  const dto = await api.get<DocumentosClienteResponseDTO>(`/aseguradora/crud/clientes/${id}/documentos`)
  return {
    identificacion: documentoBackendToFrontend(dto.identificacion),
    poliza: documentoBackendToFrontend(dto.poliza),
  }
}
