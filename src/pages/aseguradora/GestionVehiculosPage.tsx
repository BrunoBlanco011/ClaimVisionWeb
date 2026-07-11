import { useState, useEffect } from 'react'
import { CrudModal } from '../../components/organisms/CrudModal'
import { VehiculoForm, type VehiculoFormData } from '../../components/molecules/VehiculoForm'
import { VehiculoCard } from '../../components/molecules/VehiculoCard'
import { getAll as getClientes } from '../../api/aseguradora/clientes/clientes.routes'
import { getByCliente, create as createVehiculo } from '../../api/aseguradora/vehiculos/vehiculos.routes'
import { useToast } from '../../contexts/Toast'
import type { Cliente } from '../../api/aseguradora/clientes/clientes.schemas'
import type { Vehiculo } from '../../api/aseguradora/vehiculos/vehiculos.schemas'

const emptyForm: VehiculoFormData = { marca: '', modelo: '', anio: '', placas: '', vin: '', color: '' }

export function GestionVehiculosPage() {
  const { addToast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoadingClientes, setIsLoadingClientes] = useState(true)
  const [selectedClienteId, setSelectedClienteId] = useState('')
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [isLoadingVehiculos, setIsLoadingVehiculos] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<VehiculoFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getClientes().then((result) => {
      setClientes(result)
      setIsLoadingClientes(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedClienteId) {
      setVehiculos([])
      return
    }
    setIsLoadingVehiculos(true)
    getByCliente(selectedClienteId).then((result) => {
      setVehiculos(result)
      setIsLoadingVehiculos(false)
    })
  }, [selectedClienteId])

  const openNew = () => {
    setFormData(emptyForm)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const nuevo = await createVehiculo(selectedClienteId, {
        marca: formData.marca,
        modelo: formData.modelo,
        anio: Number(formData.anio),
        placas: formData.placas,
        vin: formData.vin,
        color: formData.color,
      })
      setVehiculos((prev) => [...prev, nuevo])
      addToast('success', 'Vehículo agregado correctamente')
      setModalOpen(false)
      setFormData(emptyForm)
    } catch {
      addToast('error', 'Error al agregar el vehículo')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCliente = clientes.find((c) => c.id === selectedClienteId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Vehículos de Clientes</h1>
        <p className="text-sm text-neutral-500 mt-1">Selecciona un cliente para ver y agregar sus vehículos asegurados.</p>
      </div>

      <div className="w-full sm:w-96">
        <select
          value={selectedClienteId}
          onChange={(e) => setSelectedClienteId(e.target.value)}
          disabled={isLoadingClientes}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:bg-neutral-100"
        >
          <option value="">{isLoadingClientes ? 'Cargando clientes…' : 'Selecciona un cliente…'}</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} · Póliza {cliente.numeroPoliza}
            </option>
          ))}
        </select>
      </div>

      {!selectedClienteId && (
        <p className="text-sm text-neutral-500">Elige un cliente del listado para ver sus vehículos.</p>
      )}

      {selectedClienteId && isLoadingVehiculos && (
        <p className="text-sm text-neutral-500">Cargando vehículos…</p>
      )}

      {selectedClienteId && !isLoadingVehiculos && (
        <div className="flex flex-col gap-3 max-w-xl">
          {vehiculos.map((vehiculo) => (
            <VehiculoCard key={vehiculo.id} vehiculo={vehiculo} />
          ))}

          <button
            type="button"
            onClick={openNew}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 p-4 text-sm font-medium text-neutral-500 hover:border-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar vehículo
          </button>
        </div>
      )}

      <CrudModal
        open={modalOpen}
        title={`Nuevo vehículo${selectedCliente ? ` · ${selectedCliente.nombre}` : ''}`}
        onClose={() => { setModalOpen(false); setFormData(emptyForm) }}
        onSubmit={handleSubmit}
        submitLabel="Guardar"
        isSubmitting={isSubmitting}
      >
        <VehiculoForm data={formData} onChange={setFormData} />
      </CrudModal>
    </div>
  )
}
