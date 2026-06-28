import { api } from './api'
import type { Peritaje } from '../types'

const MOCK = true

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const mockData: Peritaje[] = [
  { id: 'p1', ajustador: 'Carlos Mendoza', fecha: '16/06/2026', montoEstimado: 15300, descripcion: 'Reemplazo de parachoques delantero, radiador y faro izquierdo.', estado: 'pendiente' },
  { id: 'p2', ajustador: 'María García', fecha: '15/06/2026', montoEstimado: 28400, descripcion: 'Reparación de 3 paneles con abolladuras. Pintura completa.', estado: 'aprobado' },
  { id: 'p3', ajustador: 'Carlos Mendoza', fecha: '14/06/2026', montoEstimado: 8900, descripcion: 'Remplazo de parabrisas y calibración de sensores.', estado: 'pendiente' },
  { id: 'p4', ajustador: 'Lucía Fernández', fecha: '12/06/2026', montoEstimado: 42000, descripcion: 'Reparación por incendio. Múltiples componentes dañados.', estado: 'pendiente' },
  { id: 'p5', ajustador: 'María García', fecha: '10/06/2026', montoEstimado: 12500, descripcion: 'Reparación de defensa trasera y sistema de escape.', estado: 'rechazado' },
]

export async function getAll(): Promise<Peritaje[]> {
  if (MOCK) {
    await delay(300)
    return [...mockData]
  }
  return api.get<Peritaje[]>('/peritajes')
}

export async function getPendingCount(): Promise<number> {
  if (MOCK) {
    await delay(100)
    return mockData.filter((p) => p.estado === 'pendiente').length
  }
  return api.get<number>('/peritajes/pendientes/count')
}
