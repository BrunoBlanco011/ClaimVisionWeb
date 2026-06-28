import { api } from './api'
import type { UserRole } from '../contexts/types'
import type { LoginCredentials } from '../components/organisms/LoginForm'
import type { User } from '../contexts/types'

const MOCK = true

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
    const role: UserRole = credentials.email.toLowerCase().includes('taller')
      ? 'taller'
      : 'aseguradora'
    return {
      user: {
        id: String(Date.now()),
        name: credentials.email.split('@')[0] || 'Usuario',
        email: credentials.email,
        role,
      },
    }
  }
  return api.post<LoginResult>('/auth/login', credentials)
}

export async function logout(): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  await api.post('/auth/logout', {})
}
