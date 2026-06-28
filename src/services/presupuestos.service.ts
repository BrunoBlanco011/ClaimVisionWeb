import { api } from './api'
import type { Presupuesto, Part, VehicleData } from '../types'

const MOCK = true
const STORAGE_KEY = 'claimvision_presupuestos'

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function loadAll(): Presupuesto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Presupuesto[]
  } catch { /* ignore */ }
  const initial: Presupuesto[] = [
    { id: '1', numero: 'PRE-001', expediente: 'EXP-2026-001', aseguradora: 'Seguros Atlas', monto: '$15,230.00', fechaEnvio: '15/06/2026', estado: 'pendiente' },
    { id: '2', numero: 'PRE-002', expediente: 'EXP-2026-002', aseguradora: 'Aseguradora del Sur', monto: '$8,450.00', fechaEnvio: '14/06/2026', estado: 'aprobado' },
    { id: '3', numero: 'PRE-003', expediente: 'EXP-2026-003', aseguradora: 'Seguros Atlas', monto: '$22,100.00', fechaEnvio: '12/06/2026', estado: 'rechazado' },
    { id: '4', numero: 'PRE-004', expediente: 'EXP-2026-004', aseguradora: 'Protección Total', monto: '$5,670.00', fechaEnvio: '10/06/2026', estado: 'completado' },
    { id: '5', numero: 'PRE-005', expediente: 'EXP-2026-005', aseguradora: 'Aseguradora del Sur', monto: '$12,400.00', fechaEnvio: '08/06/2026', estado: 'pendiente' },
    { id: '6', numero: 'PRE-006', expediente: 'EXP-2026-006', aseguradora: 'Seguros Atlas', monto: '$3,800.00', fechaEnvio: '05/06/2026', estado: 'aprobado' },
    { id: '7', numero: 'PRE-007', expediente: 'EXP-2026-007', aseguradora: 'Protección Total', monto: '$9,200.00', fechaEnvio: '01/06/2026', estado: 'rechazado' },
    { id: '8', numero: 'PRE-008', expediente: 'EXP-2026-008', aseguradora: 'Seguros Atlas', monto: '$18,500.00', fechaEnvio: '28/05/2026', estado: 'completado' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function saveAll(data: Presupuesto[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export interface CreatePresupuestoData {
  vehicle: VehicleData
  parts: Part[]
  hours: number
  hourlyRate: number
  expedienteId?: string
}

export async function getAll(): Promise<Presupuesto[]> {
  if (MOCK) {
    await delay(300)
    return [...loadAll()]
  }
  return api.get<Presupuesto[]>('/presupuestos')
}

export async function create(data: CreatePresupuestoData): Promise<Presupuesto> {
  if (MOCK) {
    await delay(500)
    const all = loadAll()
    const partsTotal = data.parts.reduce((s, p) => s + p.quantity * p.unitPrice, 0)
    const laborTotal = data.hours * data.hourlyRate
    const total = partsTotal + laborTotal + (partsTotal + laborTotal) * 0.16
    const nuevo: Presupuesto = {
      id: String(Date.now()),
      numero: `PRE-${String(all.length + 1).padStart(3, '0')}`,
      expediente: data.vehicle.expediente || data.expedienteId || '—',
      aseguradora: 'Pendiente',
      monto: `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      fechaEnvio: new Date().toLocaleDateString('es-MX'),
      estado: 'pendiente',
    }
    all.push(nuevo)
    saveAll(all)
    return { ...nuevo }
  }
  return api.post<Presupuesto>('/presupuestos', data)
}
