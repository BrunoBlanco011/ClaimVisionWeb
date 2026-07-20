import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Sidebar, type UserRole } from '../../organisms/Sidebar'
import { TopBar } from '../../organisms/TopBar'
import { useAuth } from '../../../contexts/useAuth'
import { EventStreamProvider } from '../../../contexts/EventStream'
import { logout as serviceLogout } from '../../../api/auth/auth.routes'

export interface AppLayoutProps {
  role: UserRole
}

export function AppLayout({ role }: AppLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    logout()
    await serviceLogout().catch(() => {})
    navigate('/login', { replace: true })
  }

  return (
    <EventStreamProvider>
      <div className="min-h-screen flex bg-app-bg">
        <Sidebar role={role} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            userName={user?.name ?? 'Usuario'}
            userRole={role === 'taller' ? 'Taller' : role === 'administrador' ? 'Administrador Global' : 'Aseguradora'}
            onLogout={handleLogout}
            showNotifications={role !== 'administrador'}
          />

          <main className="flex-1 p-6 overflow-auto">
            <div key={location.pathname} className="animate-fade-up">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </EventStreamProvider>
  )
}
