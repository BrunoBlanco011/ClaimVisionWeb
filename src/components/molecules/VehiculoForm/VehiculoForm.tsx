import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

export interface VehiculoFormData {
  marca: string
  modelo: string
  anio: string
  placas: string
  vin: string
  color: string
}

export interface VehiculoFormProps {
  data: VehiculoFormData
  onChange: (data: VehiculoFormData) => void
}

export function VehiculoForm({ data, onChange }: VehiculoFormProps) {
  const set = (field: keyof VehiculoFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value })
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="v-marca" required>Marca</Label>
        <Input id="v-marca" value={data.marca} onChange={set('marca')} placeholder="Ej: Nissan" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="v-modelo" required>Modelo</Label>
        <Input id="v-modelo" value={data.modelo} onChange={set('modelo')} placeholder="Ej: Sentra" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="v-anio" required>Año</Label>
        <Input id="v-anio" type="number" value={data.anio} onChange={set('anio')} placeholder="Ej: 2022" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="v-placas" required>Placas</Label>
        <Input id="v-placas" value={data.placas} onChange={set('placas')} placeholder="Ej: ABC-1234" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="v-vin">VIN</Label>
        <Input id="v-vin" value={data.vin} onChange={set('vin')} placeholder="Número de serie del vehículo" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="v-color">Color</Label>
        <Input id="v-color" value={data.color} onChange={set('color')} placeholder="Ej: Blanco" />
      </div>
    </>
  )
}
