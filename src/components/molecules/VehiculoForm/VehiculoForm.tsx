import { useState } from 'react'
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

const MARCAS = [
  'Audi', 'BMW', 'Chevrolet', 'Chrysler', 'Dodge', 'Fiat', 'Ford', 'Honda',
  'Hyundai', 'Jeep', 'Kia', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan',
  'Peugeot', 'Renault', 'SEAT', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo',
]

export function VehiculoForm({ data, onChange }: VehiculoFormProps) {
  const [marcaEsOtra, setMarcaEsOtra] = useState(() => data.marca !== '' && !MARCAS.includes(data.marca))

  const set = (field: keyof VehiculoFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value })
  }

  const handleMarcaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === '__otra__') {
      setMarcaEsOtra(true)
      onChange({ ...data, marca: '' })
    } else {
      setMarcaEsOtra(false)
      onChange({ ...data, marca: value })
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="v-marca" required>Marca</Label>
        {marcaEsOtra ? (
          <div className="flex gap-2">
            <Input id="v-marca" value={data.marca} onChange={set('marca')} placeholder="Escribe la marca" />
            <button
              type="button"
              onClick={() => { setMarcaEsOtra(false); onChange({ ...data, marca: '' }) }}
              className="shrink-0 px-3 text-sm text-neutral-500 hover:text-neutral-700"
            >
              Elegir de la lista
            </button>
          </div>
        ) : (
          <select
            id="v-marca"
            value={data.marca}
            onChange={handleMarcaSelect}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="">Selecciona una marca…</option>
            {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
            <option value="__otra__">Otra…</option>
          </select>
        )}
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
