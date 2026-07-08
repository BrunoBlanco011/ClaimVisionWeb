import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

export interface ClienteFormData {
  nombre: string
  email: string
  telefono: string
  passwordTemporal: string
}

export interface ClienteFormProps {
  data: ClienteFormData
  onChange: (data: ClienteFormData) => void
}

export function ClienteForm({ data, onChange }: ClienteFormProps) {
  const set = (field: keyof ClienteFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value })
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="c-nombre" required>Nombre completo</Label>
        <Input id="c-nombre" value={data.nombre} onChange={set('nombre')} placeholder="Ej: Ana Torres" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="c-email" required>Correo electrónico</Label>
        <Input id="c-email" type="email" value={data.email} onChange={set('email')} placeholder="ana@example.com" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="c-telefono" required>Teléfono</Label>
        <Input id="c-telefono" value={data.telefono} onChange={set('telefono')} placeholder="555-0300" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="c-password" required>Contraseña temporal</Label>
        <Input id="c-password" type="password" value={data.passwordTemporal} onChange={set('passwordTemporal')} placeholder="••••••••" />
      </div>
    </>
  )
}
