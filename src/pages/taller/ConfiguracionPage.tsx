import { useState, useEffect } from 'react'
import { Input } from '../../components/atoms/Input'
import { Label } from '../../components/atoms/Label'
import { useToast } from '../../contexts/Toast'
import { getPerfil, updatePerfil } from '../../api/taller/perfil/perfil.routes'
import type { TallerPerfil } from '../../api/taller/perfil/perfil.schemas'

interface TallerConfig {
  workshopName: string
  address: string
  contact: string
  phone: string
  capacity: number
  openingTime: string
  closingTime: string
  services: string[]
}

const STORAGE_KEY = 'taller_config'
const defaultConfig: TallerConfig = {
  workshopName: '',
  address: '',
  contact: '',
  phone: '',
  capacity: 10,
  openingTime: '08:00',
  closingTime: '18:00',
  services: [],
}

const serviceOptions = [
  'Hojalatería',
  'Pintura',
  'Mecánica general',
  'Transmisión',
  'Suspensión',
  'Frenos',
  'Eléctrico',
  'Aire acondicionado',
]

function loadConfig(perfil: TallerPerfil): TallerConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultConfig, ...JSON.parse(raw) }
  } catch {
    // ignora config local corrupta y usa los valores del backend
  }
  return {
    ...defaultConfig,
    workshopName: perfil.nombreComercial,
    address: perfil.direccion,
    contact: perfil.operadorNombre,
    phone: perfil.telefonoContacto,
  }
}

export function ConfiguracionPage() {
  const { addToast } = useToast()
  const [perfil, setPerfil] = useState<TallerPerfil | null>(null)
  const [config, setConfig] = useState<TallerConfig>(defaultConfig)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getPerfil().then((p) => {
      setPerfil(p)
      setConfig(loadConfig(p))
    })
  }, [])

  const set = (field: keyof TallerConfig) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = field === 'capacity' ? Number(e.target.value) : e.target.value
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const toggleService = (service: string) => {
    setConfig((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const nuevoPerfil = await updatePerfil({
        nombreComercial: config.workshopName,
        direccion: config.address,
        telefonoContacto: config.phone,
        operadorNombre: config.contact,
        operadorTelefono: config.phone,
      })
      setPerfil(nuevoPerfil)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      addToast('success', 'Configuración guardada correctamente')
    } catch {
      addToast('error', 'Error al guardar la configuración')
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
        <p className="text-sm text-neutral-500 mt-1">Administra la configuración de tu taller.</p>
      </div>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Perfil de Usuario</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input value={perfil?.operadorNombre ?? ''} disabled />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Correo electrónico</Label>
            <Input value={perfil?.operadorEmail ?? ''} disabled />
          </div>
        </div>
        <p className="text-xs text-neutral-400 mt-3">Los datos del perfil se gestionan desde la cuenta de acceso.</p>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Datos del Taller</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="tw-name">Nombre del taller</Label>
            <Input id="tw-name" value={config.workshopName} onChange={set('workshopName')} placeholder="Ej: Taller Central" />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="tw-address">Dirección</Label>
            <Input id="tw-address" value={config.address} onChange={set('address')} placeholder="Av. Principal 123" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="tw-contact">Persona de contacto</Label>
              <Input id="tw-contact" value={config.contact} onChange={set('contact')} placeholder="Ej: Pedro Gómez" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="tw-phone">Teléfono</Label>
              <Input id="tw-phone" value={config.phone} onChange={set('phone')} placeholder="555-0200" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="tw-capacity">Capacidad (vehículos)</Label>
              <Input id="tw-capacity" type="number" value={String(config.capacity)} onChange={set('capacity')} placeholder="10" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="tw-opening">Hora de apertura</Label>
              <Input id="tw-opening" type="time" value={config.openingTime} onChange={set('openingTime')} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="tw-closing">Hora de cierre</Label>
              <Input id="tw-closing" type="time" value={config.closingTime} onChange={set('closingTime')} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Servicios Ofrecidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-center gap-3 cursor-pointer py-1.5">
              <input
                type="checkbox"
                checked={config.services.includes(service)}
                onChange={() => toggleService(service)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-600"
              />
              <span className="text-sm text-neutral-700">{service}</span>
            </label>
          ))}
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
