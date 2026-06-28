import { useState, useCallback, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { User } from './types'

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem('claimvision_user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)

  const login = useCallback((u: User) => {
    setUser(u)
    localStorage.setItem('claimvision_user', JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('claimvision_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
