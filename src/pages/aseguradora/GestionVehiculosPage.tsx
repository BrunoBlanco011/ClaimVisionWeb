import { useState, useEffect } from 'react'
import { CrudModal } from '../../components/organisms/CrudModal'
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog'
import { VehiculoForm, type VehiculoFormData } from '../../components/molecules/VehiculoForm'
import { VehiculoCard } from '../../components/molecules/VehiculoCard'
import { Label } from '../../components/atoms/Label'
import { getAll as getClientes } from '../../api/aseguradora/clientes/clientes.routes'
import { getByCliente, create as createVehiculo, update as updateVehiculo, remove as removeVehiculo } from '../../api/aseguradora/vehiculos/vehiculos.routes'
import { extractPoliza } from '../../api/aseguradora/ocr/ocr.routes'
import { useToast } from '../../contexts/Toast'
import { getErrorMessage } from '../../api/errors'
import { useLiveRefresh } from '../../contexts/EventStream'
import type { Cliente } from '../../api/aseguradora/clientes/clientes.schemas'
import type { Vehiculo } from '../../api/aseguradora/vehiculos/vehiculos.schemas'
import type { PolizaExtractedDTO } from '../../api/aseguradora/ocr/ocr.schemas'

const emptyForm: VehiculoFormData = { marca: '', modelo: '', anio: '', placas: '', vin: '', color: '' }

type CreateMode = 'manual' | 'poliza'

const nombreCollator = new Intl.Collator('es', { sensitivity: 'base' })

function nombresCoinciden(a: string, b: string): boolean {
  return nombreCollator.compare(a.trim(), b.trim()) === 0
}

function vigenciaEstado(vigenciaFin: string): { label: string; className: string } {
  const fin = new Date(vigenciaFin)
  if (Number.isNaN(fin.getTime())) return { label: 'Vigencia no reconocida', className: 'bg-neutral-100 text-neutral-600' }
  const diffDias = (fin.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  if (diffDias < 0) return { label: 'Vencida', className: 'bg-error-50 text-error-600' }
  if (diffDias <= 30) return { label: 'Por vencer', className: 'bg-warning-50 text-warning-600' }
  return { label: 'Vigente', className: 'bg-success-50 text-success-600' }
}

function PolizaConfirmacion({ extracted, clienteNombre }: { extracted: PolizaExtractedDTO; clienteNombre: string }) {
  const vigencia = vigenciaEstado(extracted.vigencia_fin)
  const coincideNombre = clienteNombre ? nombresCoinciden(extracted.nombre_asegurado, clienteNombre) : null

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Datos extraídos de la póliza</h3>
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${vigencia.className}`}>
          {vigencia.label}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Aseguradora</dt>
          <dd className="text-neutral-900">{extracted.aseguradora || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wider">N° de póliza</dt>
          <dd className="text-neutral-900">{extracted.numero_poliza || '—'}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Nombre del asegurado</dt>
          <dd className="text-neutral-900 flex flex-wrap items-center gap-2">
            {extracted.nombre_asegurado || '—'}
            {coincideNombre !== null && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${coincideNombre ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                {coincideNombre ? 'Coincide con el cliente seleccionado' : 'No coincide con el cliente seleccionado'}
              </span>
            )}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Vigencia</dt>
          <dd className="text-neutral-900">{extracted.vigencia_inicio} — {extracted.vigencia_fin}</dd>
        </div>
      </dl>
    </div>
  )
}

export function GestionVehiculosPage() {
  const { addToast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoadingClientes, setIsLoadingClientes] = useState(true)
  const [selectedClienteId, setSelectedClienteId] = useState('')
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [isLoadingVehiculos, setIsLoadingVehiculos] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<VehiculoFormData>(emptyForm)
  const [createMode, setCreateMode] = useState<CreateMode>('manual')
  const [polizaFile, setPolizaFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extracted, setExtracted] = useState<PolizaExtractedDTO | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    getClientes().then((result) => {
      setClientes(result)
      setIsLoadingClientes(false)
    })
  }, [])

  const loadVehiculos = (silent = false) => {
    if (!selectedClienteId) {
      setVehiculos([])
      return
    }
    if (!silent) setIsLoadingVehiculos(true)
    getByCliente(selectedClienteId).then((result) => {
      setVehiculos(result)
      setIsLoadingVehiculos(false)
    })
  }

  useEffect(loadVehiculos, [selectedClienteId])

  useLiveRefresh(['vehiculo_created', 'vehiculo_updated'], () => loadVehiculos(true))

  const resetPolizaState = () => {
    setPolizaFile(null)
    setExtracted(null)
    setIsExtracting(false)
  }

  const openNew = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setCreateMode('manual')
    resetPolizaState()
    setModalOpen(true)
  }

  const openEdit = (vehiculo: Vehiculo) => {
    setEditingId(vehiculo.id)
    setFormData({
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: String(vehiculo.anio),
      placas: vehiculo.placas,
      vin: vehiculo.vin,
      color: vehiculo.color,
    })
    setCreateMode('manual')
    resetPolizaState()
    setModalOpen(true)
  }

  const handleExtractPoliza = async () => {
    if (!polizaFile) return
    setIsExtracting(true)
    try {
      const result = await extractPoliza(polizaFile)
      setExtracted(result)
      setFormData({
        marca: result.vehiculo_marca,
        modelo: result.vehiculo_modelo,
        anio: String(result.vehiculo_anio),
        placas: result.vehiculo_placas,
        vin: result.vehiculo_vin ?? '',
        color: result.vehiculo_color ?? '',
      })
      addToast('success', 'Datos extraídos. Revisa la información antes de confirmar.')
    } catch (err) {
      addToast('error', getErrorMessage(err, 'No se pudieron extraer los datos de la póliza'))
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSubmit = async () => {
    if (!editingId && createMode === 'poliza' && !extracted) {
      addToast('error', 'Extrae y confirma los datos de la póliza antes de guardar')
      return
    }
    setIsSubmitting(true)
    try {
      if (editingId) {
        const actualizado = await updateVehiculo(editingId, {
          marca: formData.marca,
          modelo: formData.modelo,
          anio: Number(formData.anio),
          placas: formData.placas,
          vin: formData.vin,
          color: formData.color,
        })
        setVehiculos((prev) => prev.map((v) => (v.id === editingId ? actualizado : v)))
        addToast('success', 'Vehículo actualizado correctamente')
      } else {
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
      }
      setModalOpen(false)
      setFormData(emptyForm)
      resetPolizaState()
      setEditingId(null)
    } catch (err) {
      addToast('error', getErrorMessage(err, editingId ? 'Error al actualizar el vehículo' : 'Error al agregar el vehículo'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await removeVehiculo(deleteTarget.id)
      setVehiculos((prev) => prev.filter((v) => v.id !== deleteTarget.id))
      addToast('success', 'Vehículo eliminado correctamente')
      setDeleteTarget(null)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al eliminar el vehículo'))
    } finally {
      setIsDeleting(false)
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
            <VehiculoCard
              key={vehiculo.id}
              vehiculo={vehiculo}
              onEdit={() => openEdit(vehiculo)}
              onDelete={() => setDeleteTarget(vehiculo)}
            />
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
        title={editingId ? 'Editar vehículo' : `Nuevo vehículo${selectedCliente ? ` · ${selectedCliente.nombre}` : ''}`}
        onClose={() => { setModalOpen(false); setFormData(emptyForm); resetPolizaState(); setEditingId(null) }}
        onSubmit={handleSubmit}
        submitLabel={editingId ? 'Guardar' : createMode === 'poliza' ? 'Validar y Agregar Vehículo' : 'Agregar Vehículo'}
        isSubmitting={isSubmitting}
      >
        {!editingId && (
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => { setCreateMode('manual'); resetPolizaState(); setFormData(emptyForm) }}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${createMode === 'manual' ? 'bg-primary-800 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              Manual
            </button>
            <button
              type="button"
              onClick={() => { setCreateMode('poliza'); resetPolizaState(); setFormData(emptyForm) }}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${createMode === 'poliza' ? 'bg-primary-800 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              Desde póliza (PDF)
            </button>
          </div>
        )}

        {editingId || createMode === 'manual' ? (
          <VehiculoForm data={formData} onChange={setFormData} />
        ) : !extracted ? (
          <div className="flex flex-col gap-1">
            <Label htmlFor="v-poliza-file" required>Póliza (PDF)</Label>
            <input
              id="v-poliza-file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPolizaFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Se extraen marca, modelo, año, placas, VIN, color y los datos de la póliza (aseguradora, número, asegurado, vigencia) automáticamente del documento.
            </p>
            <button
              type="button"
              disabled={!polizaFile || isExtracting}
              onClick={handleExtractPoliza}
              className="self-start mt-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExtracting ? 'Extrayendo…' : 'Extraer datos de la póliza'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <PolizaConfirmacion extracted={extracted} clienteNombre={selectedCliente?.nombre ?? ''} />
            <div className="flex items-center justify-between">
              <Label>Datos del vehículo — verifica y corrige si es necesario</Label>
              <button
                type="button"
                onClick={() => { resetPolizaState(); setFormData(emptyForm) }}
                className="text-xs text-neutral-500 hover:text-neutral-700 underline shrink-0"
              >
                Volver a subir
              </button>
            </div>
            <VehiculoForm data={formData} onChange={setFormData} />
          </div>
        )}
      </CrudModal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar vehículo"
        message={`¿Estás seguro de que deseas eliminar el vehículo ${deleteTarget?.marca} ${deleteTarget?.modelo} (${deleteTarget?.placas})? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isConfirming={isDeleting}
      />
    </div>
  )
}
