import { useState, useEffect, useMemo } from 'react'
import { DataTable, type Column } from '../../components/organisms/DataTable'
import { CrudModal } from '../../components/organisms/CrudModal'
import { ClienteForm, type ClienteFormData } from '../../components/molecules/ClienteForm'
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog'
import { SearchInput } from '../../components/molecules/SearchInput'
import { getAll as getClientes, create as createCliente } from '../../api/aseguradora/clientes/clientes.routes'
import { bloqueoArco, desbloqueoArco } from '../../api/aseguradora/usuarios/usuarios.routes'
import { useToast } from '../../contexts/Toast'
import { getErrorMessage } from '../../api/errors'
import { useLiveRefresh } from '../../contexts/EventStream'
import type { Cliente } from '../../api/aseguradora/clientes/clientes.schemas'

const PAGE_SIZE = 5
const emptyForm: ClienteFormData = { nombre: '', email: '', telefono: '', passwordTemporal: '' }

export function GestionClientesPage() {
  const { addToast } = useToast()
  const [data, setData] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<ClienteFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [arcoTarget, setArcoTarget] = useState<{ usuarioId: string; accion: 'bloqueo' | 'desbloqueo' } | null>(null)
  const [isProcessingArco, setIsProcessingArco] = useState(false)

  const loadData = async () => {
    const result = await getClientes()
    setData(result)
  }

  useEffect(() => {
    loadData().then(() => setIsLoading(false))
  }, [])

  useLiveRefresh(['cliente_created', 'cliente_updated'], loadData)

  const openNew = () => {
    setFormData(emptyForm)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await createCliente(formData)
      addToast('success', 'Cliente creado correctamente')
      await loadData()
      setModalOpen(false)
      setFormData(emptyForm)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al crear el cliente'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArcoConfirm = async () => {
    if (!arcoTarget) return
    setIsProcessingArco(true)
    try {
      if (arcoTarget.accion === 'bloqueo') {
        await bloqueoArco(arcoTarget.usuarioId)
        addToast('success', 'Bloqueo ARCO aplicado correctamente')
      } else {
        await desbloqueoArco(arcoTarget.usuarioId)
        addToast('success', 'Desbloqueo ARCO aplicado correctamente')
      }
      setArcoTarget(null)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al procesar la solicitud ARCO'))
    } finally {
      setIsProcessingArco(false)
    }
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (search) {
        const q = search.toLowerCase()
        if (!item.nombre.toLowerCase().includes(q) && !item.email.toLowerCase().includes(q) && !item.numeroPoliza.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [search, data])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: Column<Cliente>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'numeroPoliza', header: 'Número de Póliza', sortable: true },
    { key: 'vigenciaPoliza', header: 'Vigencia de Póliza' },
    {
      key: 'acciones',
      header: '',
      className: 'w-20 text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => setArcoTarget({ usuarioId: item.usuarioId, accion: 'bloqueo' })} className="p-1.5 text-neutral-400 hover:text-warning-600 transition-colors" aria-label="Bloquear ARCO">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
          <button type="button" onClick={() => setArcoTarget({ usuarioId: item.usuarioId, accion: 'desbloqueo' })} className="p-1.5 text-neutral-400 hover:text-success-600 transition-colors" aria-label="Desbloquear ARCO">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm2-10V7a4 4 0 118 0" />
            </svg>
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Clientes</h1>
          <p className="text-sm text-neutral-500 mt-1">Administra los clientes registrados en el sistema.</p>
        </div>
        <button type="button" onClick={openNew} className="px-4 py-2.5 bg-amber-500 text-amber-dark text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
          + Nuevo Cliente
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar por nombre, email o póliza…" />
        </div>
      </div>

      <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg text-sm">
        Los datos del cliente (nombre, correo, teléfono) los administra el propio cliente desde su app — el backend no expone edición desde el panel de la aseguradora. Aquí solo puedes darlo de alta y bloquear/desbloquear su acceso (ARCO).
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={arcoTarget !== null}
        title={arcoTarget?.accion === 'bloqueo' ? 'Bloquear ARCO' : 'Desbloquear ARCO'}
        message={
          arcoTarget?.accion === 'bloqueo'
            ? 'El cliente no podrá iniciar sesión hasta que se desbloquee. ¿Deseas continuar?'
            : 'Se restablecerá el acceso del cliente al sistema. ¿Deseas continuar?'
        }
        confirmLabel={arcoTarget?.accion === 'bloqueo' ? 'Bloquear' : 'Desbloquear'}
        variant={arcoTarget?.accion === 'bloqueo' ? 'danger' : 'default'}
        onConfirm={handleArcoConfirm}
        onCancel={() => setArcoTarget(null)}
        isConfirming={isProcessingArco}
      />

      <CrudModal
        open={modalOpen}
        title="Nuevo Cliente"
        onClose={() => { setModalOpen(false); setFormData(emptyForm) }}
        onSubmit={handleSubmit}
        submitLabel="Crear Cliente"
        isSubmitting={isSubmitting}
      >
        <ClienteForm data={formData} onChange={setFormData} />
      </CrudModal>
    </div>
  )
}
