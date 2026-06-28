import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

export interface AjustadorFormData {
  nombre: string
  email: string
  telefono: string
  especialidad: string
}

export interface AjustadorFormProps {
  data: AjustadorFormData
  onChange: (data: AjustadorFormData) => void
}

export function AjustadorForm({ data, onChange }: AjustadorFormProps) {
  const set = (field: keyof AjustadorFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [field]: e.target.value })
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="aj-nombre" required>Nombre completo</Label>
        <Input id="aj-nombre" value={data.nombre} onChange={set('nombre')} placeholder="Ej: Carlos Mendoza" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="aj-email" required>Correo electrónico</Label>
        <Input id="aj-email" type="email" value={data.email} onChange={set('email')} placeholder="carlos@example.com" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="aj-telefono" required>Teléfono</Label>
        <Input id="aj-telefono" value={data.telefono} onChange={set('telefono')} placeholder="555-0100" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="aj-especialidad" required>Especialidad</Label>
        <select
          id="aj-especialidad"
          value={data.especialidad}
          onChange={set('especialidad')}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">Seleccionar…</option>
          <option value="Colisiones">Colisiones</option>
          <option value="Daños múltiples">Daños múltiples</option>
          <option value="Incendios">Incendios</option>
          <option value="Robos">Robos</option>
          <option value="Granizo">Granizo</option>
        </select>
      </div>
    </>
  )
}
