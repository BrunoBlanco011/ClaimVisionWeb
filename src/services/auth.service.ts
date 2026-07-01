import { api } from './api'
import type { UserRole, User } from '../contexts/types'
import type { LoginCredentials } from '../components/organisms/LoginForm'
import type { LoginResponseDTO } from '../types'

const MOCK = false

const ROLE_MAP: Record<string, UserRole> = {
  Operador_Aseguradora: 'aseguradora',
  Operador_Taller: 'taller',
  Administrador_Global: 'administrador',
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export interface LoginResult {
  user: User
  token?: string
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  if (MOCK) {
    await delay(800)
    const role: UserRole = credentials.email.toLowerCase().includes('taller') ? 'taller' : 'aseguradora'
    return {
      user: {
        id: String(Date.now()),
        name: credentials.email.split('@')[0] || 'Usuario',
        email: credentials.email,
        role,
      },
    }
  }

  const res = await api.post<LoginResponseDTO>('/auth/login', credentials)
  localStorage.setItem('claimvision_token', res.token)
  return {
    user: {
      id: res.usuario_id,
      name: res.email,
      email: res.email,
      role: ROLE_MAP[res.rol] ?? 'aseguradora',
    },
    token: res.token,
  }
}

export async function logout(): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  localStorage.removeItem('claimvision_token')
}

export async function getCurrentUser(): Promise<User | null> {
  if (MOCK) return null
  try {
    const res = await api.get<LoginResponseDTO>('/auth/me')
    return {
      id: res.usuario_id,
      name: res.email,
      email: res.email,
      role: ROLE_MAP[res.rol] ?? 'aseguradora',
    }
  } catch {
    localStorage.removeItem('claimvision_token')
    return null
  }
}
