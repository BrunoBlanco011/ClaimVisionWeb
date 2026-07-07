import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

export interface TallerFormData {
  nombre: string
  rfc: string
  direccion: string
  telefono: string
}

export interface TallerFormProps {
  data: TallerFormData
  onChange: (data: TallerFormData) => void
}

export function TallerForm({ data, onChange }: TallerFormProps) {
  const set = (field: keyof TallerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value })
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="t-nombre" required>Nombre del taller</Label>
        <Input id="t-nombre" value={data.nombre} onChange={set('nombre')} placeholder="Ej: Taller Central" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="t-rfc" required>RFC</Label>
        <Input id="t-rfc" value={data.rfc} onChange={set('rfc')} placeholder="TCE010101AB1" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="t-direccion" required>Dirección</Label>
        <Input id="t-direccion" value={data.direccion} onChange={set('direccion')} placeholder="Av. Principal 123" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="t-telefono" required>Teléfono</Label>
        <Input id="t-telefono" value={data.telefono} onChange={set('telefono')} placeholder="555-0200" />
      </div>
    </>
  )
}
