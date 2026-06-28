import { api } from './api'
import type { Trabajo } from '../types'

const MOCK = true

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Trabajo[] = [
  { id: '1', numero: 'EXP-2026-004', vehiculo: 'Mazda 3 2023', taller: 'Taller Central', fechaInicio: '10/06/2026', fechaFin: '20/06/2026', monto: '$5,670.00', estado: 'completado' },
  { id: '2', numero: 'EXP-2026-006', vehiculo: 'Ford Escape 2021', taller: 'Taller Norte', fechaInicio: '05/06/2026', fechaFin: '18/06/2026', monto: '$12,300.00', estado: 'completado' },
  { id: '3', numero: 'EXP-2026-007', vehiculo: 'Volkswagen Jetta 2022', taller: 'Taller Central', fechaInicio: '01/06/2026', fechaFin: '15/06/2026', monto: '$9,800.00', estado: 'completado' },
  { id: '4', numero: 'EXP-2026-008', vehiculo: 'Kia Rio 2023', taller: 'Taller Sur', fechaInicio: '28/05/2026', fechaFin: '12/06/2026', monto: '$7,450.00', estado: 'cancelado' },
  { id: '5', numero: 'EXP-2026-009', vehiculo: 'Hyundai Tucson 2022', taller: 'Taller Central', fechaInicio: '20/05/2026', fechaFin: '05/06/2026', monto: '$14,200.00', estado: 'completado' },
  { id: '6', numero: 'EXP-2026-010', vehiculo: 'Chevrolet Trax 2023', taller: 'Taller Norte', fechaInicio: '15/05/2026', fechaFin: '28/05/2026', monto: '$3,900.00', estado: 'completado' },
  { id: '7', numero: 'EXP-2026-011', vehiculo: 'Nissan Frontier 2021', taller: 'Taller Sur', fechaInicio: '10/05/2026', fechaFin: '25/05/2026', monto: '$18,700.00', estado: 'cancelado' },
]

export async function getAll(): Promise<Trabajo[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  return api.get<Trabajo[]>('/trabajos')
}
