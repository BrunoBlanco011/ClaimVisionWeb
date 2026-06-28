import { useState, useEffect } from 'react'
import { Input } from '../../components/atoms/Input'
import { Label } from '../../components/atoms/Label'
import { useAuth } from '../../contexts/useAuth'
import { useToast } from '../../contexts/Toast'

interface AseguradoraConfig {
  companyName: string
  rfc: string
  companyPhone: string
  companyAddress: string
  emailNotifications: boolean
  smsNotifications: boolean
}

const STORAGE_KEY = 'aseguradora_config'
const defaultConfig: AseguradoraConfig = {
  companyName: '',
  rfc: '',
  companyPhone: '',
  companyAddress: '',
  emailNotifications: true,
  smsNotifications: false,
}

function loadConfig(): AseguradoraConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig
  } catch {
    return defaultConfig
  }
}

export function ConfiguracionPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [config, setConfig] = useState<AseguradoraConfig>(defaultConfig)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setConfig(loadConfig())
  }, [])

  const set = (field: keyof AseguradoraConfig) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setSaving(true)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      addToast('success', 'Configuración guardada correctamente')
    } catch {
      addToast('error', 'Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
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
            <Label>Nombre</Label>
            <Input value={user?.name ?? ''} disabled />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Correo electrónico</Label>
            <Input value={user?.email ?? ''} disabled />
          </div>
        </div>
        <p className="text-xs text-neutral-400 mt-3">Los datos del perfil se gestionan desde la cuenta de acceso.</p>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Datos de la Compañía</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="co-name">Nombre de la aseguradora</Label>
            <Input id="co-name" value={config.companyName} onChange={set('companyName')} placeholder="Ej: Seguros Atlas" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="co-rfc">RFC</Label>
              <Input id="co-rfc" value={config.rfc} onChange={set('rfc')} placeholder="AAA010101AAA" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="co-phone">Teléfono</Label>
              <Input id="co-phone" value={config.companyPhone} onChange={set('companyPhone')} placeholder="555-0000" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="co-address">Dirección</Label>
            <Input id="co-address" value={config.companyAddress} onChange={set('companyAddress')} placeholder="Av. Corporativa 500" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notificaciones</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={config.emailNotifications} onChange={set('emailNotifications')} className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-600" />
            <span className="text-sm text-neutral-700">Recibir notificaciones por correo electrónico</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={config.smsNotifications} onChange={set('smsNotifications')} className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-600" />
            <span className="text-sm text-neutral-700">Recibir notificaciones por SMS</span>
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary-800 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  )
}
