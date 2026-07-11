import { api } from '../../client'
import type { Vehiculo, VehiculoResponseDTO, VehiculoCreateDTO, VehiculoCreateInput } from './vehiculos.schemas'

function vehiculoBackendToFrontend(dto: VehiculoResponseDTO): Vehiculo {
  return {
    id: dto.id,
    clienteId: dto.cliente_id,
    marca: dto.marca,
    modelo: dto.modelo,
    anio: dto.anio,
    placas: dto.placas,
    vin: dto.vin ?? '',
    color: dto.color ?? '',
  }
}

export async function getByCliente(clienteId: string): Promise<Vehiculo[]> {
  const res = await api.get<{ data: VehiculoResponseDTO[] }>(
    `/aseguradora/crud/vehiculos?page=1&page_size=100&cliente_id=${encodeURIComponent(clienteId)}`,
  )
  return res.data.map((dto) => vehiculoBackendToFrontend(dto))
}

export async function create(clienteId: string, data: VehiculoCreateInput): Promise<Vehiculo> {
  const dto: VehiculoCreateDTO = {
    cliente_id: clienteId,
    marca: data.marca,
    modelo: data.modelo,
    anio: data.anio,
    placas: data.placas,
    vin: data.vin || null,
    color: data.color || null,
  }
  const res = await api.post<VehiculoResponseDTO>('/aseguradora/crud/vehiculos', dto)
  return vehiculoBackendToFrontend(res)
}
