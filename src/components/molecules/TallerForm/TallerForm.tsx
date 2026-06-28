import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

export interface TallerFormData {
  nombre: string
  direccion: string
  contacto: string
  telefono: string
  capacidad: number
}

export interface TallerFormProps {
  data: TallerFormData
  onChange: (data: TallerFormData) => void
}

export function TallerForm({ data, onChange }: TallerFormProps) {
  const set = (field: keyof TallerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'capacidad' ? Number(e.target.value) : e.target.value
    onChange({ ...data, [field]: value })
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="t-nombre" required>Nombre del taller</Label>
        <Input id="t-nombre" value={data.nombre} onChange={set('nombre')} placeholder="Ej: Taller Central" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="t-direccion" required>Dirección</Label>
        <Input id="t-direccion" value={data.direccion} onChange={set('direccion')} placeholder="Av. Principal 123" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="t-contacto" required>Nombre de contacto</Label>
        <Input id="t-contacto" value={data.contacto} onChange={set('contacto')} placeholder="Ej: Pedro Gómez" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="t-telefono" required>Teléfono</Label>
        <Input id="t-telefono" value={data.telefono} onChange={set('telefono')} placeholder="555-0200" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="t-capacidad" required>Capacidad (vehículos)</Label>
        <Input id="t-capacidad" type="number" value={String(data.capacidad)} onChange={set('capacidad')} placeholder="20" />
      </div>
    </>
  )
}
