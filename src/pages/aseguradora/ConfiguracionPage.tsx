import { useState, useEffect } from 'react'
import { Input } from '../../components/atoms/Input'
import { Label } from '../../components/atoms/Label'
import { useAuth } from '../../contexts/useAuth'
import { useToast } from '../../contexts/Toast'
import { getErrorMessage } from '../../api/errors'
import { getPerfil, updatePerfil } from '../../api/aseguradora/perfil/perfil.routes'
import { ChangePasswordForm } from '../../components/molecules/ChangePasswordForm'
import type { PerfilAseguradora } from '../../api/aseguradora/perfil/perfil.schemas'

interface NotificacionesConfig {
  emailNotifications: boolean
  smsNotifications: boolean
}

const STORAGE_KEY = 'aseguradora_config'
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
  const { addToast } = useToast()
  const [perfil, setPerfil] = useState<PerfilAseguradora | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [rfc, setRfc] = useState('')
  const [dominioCorreo, setDominioCorreo] = useState('')
  const [contactoLegalEmail, setContactoLegalEmail] = useState('')
  const [operadorNombre, setOperadorNombre] = useState('')
  const [operadorEmail, setOperadorEmail] = useState('')
  const [operadorTelefono, setOperadorTelefono] = useState('')
  const [notificaciones, setNotificaciones] = useState<NotificacionesConfig>(defaultNotificaciones)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getPerfil().then((p) => {
      setPerfil(p)
      setCompanyName(p.nombre)
      setRfc(p.rfc)
      setDominioCorreo(p.dominioCorreo)
      setContactoLegalEmail(p.contactoLegalEmail)
      setOperadorNombre(user?.name ?? '')
      setOperadorEmail(user?.email ?? '')
      setNotificaciones(loadNotificaciones())
    })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      const nuevoPerfil = await updatePerfil({
        nombre: companyName,
        rfc,
        dominioCorreo,
        contactoLegalEmail,
        operadorNombre,
        operadorEmail,
        operadorTelefono,
      })
      setPerfil(nuevoPerfil)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notificaciones))
      addToast('success', 'Configuración guardada correctamente')
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al guardar la configuración'))
    } finally {
      setSaving(false)
    }
  }

  if (!perfil) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Cargando configuración…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-500 mt-1">Administra la configuración general del sistema.</p>
      </div>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Perfil de Usuario</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="op-nombre">Nombre</Label>
            <Input id="op-nombre" value={operadorNombre} onChange={(e) => setOperadorNombre(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="op-email">Correo electrónico</Label>
            <Input id="op-email" type="email" value={operadorEmail} onChange={(e) => setOperadorEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="op-telefono">Teléfono</Label>
            <Input id="op-telefono" value={operadorTelefono} onChange={(e) => setOperadorTelefono(e.target.value)} placeholder="555-0000" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Datos de la Compañía</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="co-name">Nombre de la aseguradora</Label>
            <Input id="co-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ej: Seguros Atlas" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="co-rfc">RFC</Label>
              <Input id="co-rfc" value={rfc} onChange={(e) => setRfc(e.target.value)} placeholder="AAA010101AAA" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="co-dominio">Dominio de correo</Label>
              <Input id="co-dominio" value={dominioCorreo} onChange={(e) => setDominioCorreo(e.target.value)} placeholder="segurosatlas.com" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="co-legal">Correo de contacto legal</Label>
            <Input id="co-legal" type="email" value={contactoLegalEmail} onChange={(e) => setContactoLegalEmail(e.target.value)} placeholder="legal@segurosatlas.com" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notificaciones</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={notificaciones.emailNotifications} onChange={(e) => setNotificaciones((prev) => ({ ...prev, emailNotifications: e.target.checked }))} className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-600" />
            <span className="text-sm text-neutral-700">Recibir notificaciones por correo electrónico</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={notificaciones.smsNotifications} onChange={(e) => setNotificaciones((prev) => ({ ...prev, smsNotifications: e.target.checked }))} className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-600" />
            <span className="text-sm text-neutral-700">Recibir notificaciones por SMS</span>
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-500 text-amber-dark text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Guardar Configuración'}
        </button>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
