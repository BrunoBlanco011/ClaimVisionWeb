import { api } from './api'
import type { Taller } from '../types'

const MOCK = true
const STORAGE_KEY = 'claimvision_talleres'

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function loadAll(): Taller[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Taller[]
  } catch { /* ignore */ }
  const initial: Taller[] = [
    { id: '1', nombre: 'Taller Central', direccion: 'Av. Principal 123', contacto: 'Pedro Gómez', telefono: '555-0201', capacidad: 20, estado: 'aprobado' },
    { id: '2', nombre: 'Taller Norte', direccion: 'Calle Norte 456', contacto: 'Lucía Fernández', telefono: '555-0202', capacidad: 15, estado: 'aprobado' },
    { id: '3', nombre: 'Taller Sur', direccion: 'Av. del Sur 789', contacto: 'Jorge Ruiz', telefono: '555-0203', capacidad: 10, estado: 'en_progreso' },
    { id: '4', nombre: 'Taller Express', direccion: 'Blvd. Oriente 321', contacto: 'Sofía Herrera', telefono: '555-0204', capacidad: 8, estado: 'pendiente' },
    { id: '5', nombre: 'Taller Premium', direccion: 'Paseo Central 654', contacto: 'Diego Navarro', telefono: '555-0205', capacidad: 25, estado: 'aprobado' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function saveAll(data: Taller[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function getAll(): Promise<Taller[]> {
  if (MOCK) {
    await delay(300)
    return [...loadAll()]
  }
  return api.get<Taller[]>('/talleres')
}

export async function create(data: Omit<Taller, 'id' | 'estado'>): Promise<Taller> {
  if (MOCK) {
    await delay(300)
    const all = loadAll()
    const nuevo: Taller = {
      id: String(Date.now()),
      ...data,
      estado: 'pendiente',
    }
    all.push(nuevo)
    saveAll(all)
    return { ...nuevo }
  }
  return api.post<Taller>('/talleres', data)
}

export async function update(id: string, data: Omit<Taller, 'id' | 'estado'>): Promise<Taller> {
  if (MOCK) {
    await delay(300)
    const all = loadAll()
    const idx = all.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Taller no encontrado')
    all[idx] = { ...all[idx], ...data }
    saveAll(all)
    return { ...all[idx] }
  }
  return api.put<Taller>(`/talleres/${id}`, data)
}

export async function remove(id: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    const all = loadAll().filter((t) => t.id !== id)
    saveAll(all)
    return
  }
  await api.delete(`/talleres/${id}`)
}
