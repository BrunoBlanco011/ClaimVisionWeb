import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'

export function GuestGuard() {
  const { user, isAuthenticated } = useAuth()

  if (isAuthenticated && user) {
    const redirect = user.role === 'taller' ? '/taller/bandeja' : '/aseguradora/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
