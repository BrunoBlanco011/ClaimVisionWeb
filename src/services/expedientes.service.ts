import { api } from './api'
import type { Expediente } from '../types'

const MOCK = true

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Expediente[] = [
  { id: '1', numero: 'EXP-2026-001', aseguradora: 'Seguros Atlas', fechaIngreso: '15/06/2026', estado: 'pendiente', vehiculo: 'Toyota Corolla 2020', placa: 'ABC-1234' },
  { id: '2', numero: 'EXP-2026-002', aseguradora: 'Aseguradora del Sur', fechaIngreso: '14/06/2026', estado: 'en_progreso', vehiculo: 'Honda Civic 2022', placa: 'DEF-5678' },
  { id: '3', numero: 'EXP-2026-003', aseguradora: 'Seguros Atlas', fechaIngreso: '12/06/2026', estado: 'aprobado', vehiculo: 'Nissan Versa 2021', placa: 'GHI-9012' },
  { id: '4', numero: 'EXP-2026-004', aseguradora: 'Protección Total', fechaIngreso: '10/06/2026', estado: 'completado', vehiculo: 'Mazda 3 2023', placa: 'JKL-3456' },
  { id: '5', numero: 'EXP-2026-005', aseguradora: 'Aseguradora del Sur', fechaIngreso: '08/06/2026', estado: 'rechazado', vehiculo: 'Chevrolet Onix 2022', placa: 'MNO-7890' },
  { id: '6', numero: 'EXP-2026-006', aseguradora: 'Seguros Atlas', fechaIngreso: '05/06/2026', estado: 'pendiente', vehiculo: 'Ford Escape 2021', placa: 'PQR-1234' },
  { id: '7', numero: 'EXP-2026-007', aseguradora: 'Protección Total', fechaIngreso: '01/06/2026', estado: 'en_progreso', vehiculo: 'Volkswagen Jetta 2022', placa: 'STU-5678' },
]

export async function getAll(): Promise<Expediente[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  return api.get<Expediente[]>('/expedientes')
}

export async function getById(id: string): Promise<Expediente> {
  if (MOCK) {
    await delay(200)
    const item = mockData.find((e) => e.id === id)
    if (!item) throw new Error('Expediente no encontrado')
    return { ...item }
  }
  return api.get<Expediente>(`/expedientes/${id}`)
}
