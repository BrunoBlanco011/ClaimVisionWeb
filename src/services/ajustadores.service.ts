import { api } from './api'
import type { Ajustador } from '../types'

const MOCK = true
const STORAGE_KEY = 'claimvision_ajustadores'

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function loadAll(): Ajustador[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Ajustador[]
  } catch { /* ignore */ }
  const initial: Ajustador[] = [
    { id: '1', nombre: 'Carlos Mendoza', email: 'carlos@example.com', telefono: '555-0101', especialidad: 'Colisiones', incidentesAsignados: 5, estado: 'aprobado' },
    { id: '2', nombre: 'María García', email: 'maria@example.com', telefono: '555-0102', especialidad: 'Daños múltiples', incidentesAsignados: 3, estado: 'aprobado' },
    { id: '3', nombre: 'Roberto Sánchez', email: 'roberto@example.com', telefono: '555-0103', especialidad: 'Incendios', incidentesAsignados: 2, estado: 'en_progreso' },
    { id: '4', nombre: 'Ana Torres', email: 'ana@example.com', telefono: '555-0104', especialidad: 'Robos', incidentesAsignados: 0, estado: 'pendiente' },
    { id: '5', nombre: 'Luis Vega', email: 'luis@example.com', telefono: '555-0105', especialidad: 'Colisiones', incidentesAsignados: 4, estado: 'cancelado' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function saveAll(data: Ajustador[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function getAll(): Promise<Ajustador[]> {
  if (MOCK) {
    await delay(300)
    return [...loadAll()]
  }
  return api.get<Ajustador[]>('/ajustadores')
}

export async function create(data: Omit<Ajustador, 'id' | 'incidentesAsignados' | 'estado'>): Promise<Ajustador> {
  if (MOCK) {
    await delay(300)
    const all = loadAll()
    const nuevo: Ajustador = {
      id: String(Date.now()),
      ...data,
      incidentesAsignados: 0,
      estado: 'pendiente',
    }
    all.push(nuevo)
    saveAll(all)
    return { ...nuevo }
  }
  return api.post<Ajustador>('/ajustadores', data)
}

export async function update(id: string, data: Omit<Ajustador, 'id' | 'incidentesAsignados' | 'estado'>): Promise<Ajustador> {
  if (MOCK) {
    await delay(300)
    const all = loadAll()
    const idx = all.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Ajustador no encontrado')
    all[idx] = { ...all[idx], ...data }
    saveAll(all)
    return { ...all[idx] }
  }
  return api.put<Ajustador>(`/ajustadores/${id}`, data)
}

export async function remove(id: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    const all = loadAll().filter((a) => a.id !== id)
    saveAll(all)
    return
  }
  await api.delete(`/ajustadores/${id}`)
}
