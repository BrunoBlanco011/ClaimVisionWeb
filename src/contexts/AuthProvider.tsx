import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { getCurrentUser } from '../services/auth.service'
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

  useEffect(() => {
    const token = localStorage.getItem('claimvision_token')
    if (token && !user) {
      getCurrentUser().then((u) => {
        if (u) {
          setUser(u)
          localStorage.setItem('claimvision_user', JSON.stringify(u))
        }
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback((u: User) => {
    setUser(u)
    localStorage.setItem('claimvision_user', JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('claimvision_user')
    localStorage.removeItem('claimvision_token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
