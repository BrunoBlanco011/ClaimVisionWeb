import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

export interface OperadorTallerFormData {
  nombre: string
  email: string
  password: string
  puesto: string
}

export interface OperadorTallerFormProps {
  data: OperadorTallerFormData
  onChange: (data: OperadorTallerFormData) => void
}

export function OperadorTallerForm({ data, onChange }: OperadorTallerFormProps) {
  const set = (field: keyof OperadorTallerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value })
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="op-nombre" required>Nombre completo</Label>
        <Input id="op-nombre" value={data.nombre} onChange={set('nombre')} placeholder="Ej: Luis Ramírez" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="op-email" required>Correo electrónico</Label>
        <Input id="op-email" type="email" value={data.email} onChange={set('email')} placeholder="luis@taller.com" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="op-password" required>Contraseña</Label>
        <Input id="op-password" type="password" value={data.password} onChange={set('password')} placeholder="••••••••" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="op-puesto">Puesto</Label>
        <Input id="op-puesto" value={data.puesto} onChange={set('puesto')} placeholder="Operador" />
      </div>
    </>
  )
}
