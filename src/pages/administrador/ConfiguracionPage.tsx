import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { ChangePasswordForm } from '../../components/molecules/ChangePasswordForm'

interface NotificacionesConfig {
  emailNotifications: boolean
  smsNotifications: boolean
}

const STORAGE_KEY = 'administrador_config'
const defaultNotificaciones: NotificacionesConfig = {
  emailNotifications: true,
  smsNotifications: false,
}

function loadNotificaciones(): NotificacionesConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultNotificaciones, ...JSON.parse(raw) } : defaultNotificaciones
  } catch {
    return defaultNotificaciones
  }
}

export function ConfiguracionPage() {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState<NotificacionesConfig>(defaultNotificaciones)

  useEffect(() => {
    setNotificaciones(loadNotificaciones())
  }, [])

  const updateNotificaciones = (next: NotificacionesConfig) => {
    setNotificaciones(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-500 mt-1">Administra tu perfil y preferencias del sistema</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-neutral-900 pb-2 border-b border-neutral-100">Perfil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
            <input type="text" value={user?.name ?? ''} disabled className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Correo</label>
            <input type="email" value={user?.email ?? ''} disabled className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-neutral-900 pb-2 border-b border-neutral-100">Notificaciones</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificaciones.emailNotifications}
              onChange={(e) => updateNotificaciones({ ...notificaciones, emailNotifications: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-admin-500"
            />
            <span className="text-sm text-neutral-700">Notificaciones por correo electrónico</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificaciones.smsNotifications}
              onChange={(e) => updateNotificaciones({ ...notificaciones, smsNotifications: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-admin-500"
            />
            <span className="text-sm text-neutral-700">Notificaciones SMS</span>
          </label>
        </div>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
