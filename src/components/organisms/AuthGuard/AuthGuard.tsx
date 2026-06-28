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
    const redirect = user!.role === 'taller' ? '/taller/bandeja' : '/aseguradora/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
