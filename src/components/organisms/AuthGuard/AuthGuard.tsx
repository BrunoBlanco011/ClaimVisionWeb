import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'
import type { UserRole } from '../../../contexts/types'

export interface AuthGuardProps {
  requiredRole: UserRole
}

export function AuthGuard({ requiredRole }: AuthGuardProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user!.role !== requiredRole) {
    const redirectMap: Record<string, string> = {
      taller: '/taller/bandeja',
      aseguradora: '/aseguradora/dashboard',
      administrador: '/administrador/dashboard',
    }
    return <Navigate to={redirectMap[user!.role] ?? '/login'} replace />
  }

  return <Outlet />
}
