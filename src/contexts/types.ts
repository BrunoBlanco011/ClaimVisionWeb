export type UserRole = 'aseguradora' | 'taller'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}
