import { useState, useEffect, useMemo } from 'react'
import { DataTable, StatusBadge, type Column } from '../../components/organisms/DataTable'
import { CrudModal } from '../../components/organisms/CrudModal'
import { TallerForm, type TallerFormData } from '../../components/molecules/TallerForm'
import { OperadorTallerForm, type OperadorTallerFormData } from '../../components/molecules/OperadorTallerForm'
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog'
import { SearchInput } from '../../components/molecules/SearchInput'
import { getAll as getTalleres, create as createTaller, update as updateTaller, remove as removeTaller, createOperador } from '../../api/aseguradora/talleres/talleres.routes'
import { useToast } from '../../contexts/Toast'
import { getErrorMessage } from '../../api/errors'
import { useLiveRefresh } from '../../contexts/EventStream'
import type { Taller } from '../../api/aseguradora/talleres/talleres.schemas'

const PAGE_SIZE = 5
const emptyForm: TallerFormData = { nombre: '', rfc: '', direccion: '', telefono: '' }
const emptyOperadorForm: OperadorTallerFormData = { nombre: '', email: '', password: '', puesto: '' }

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completado', label: 'Completado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'cancelado', label: 'Cancelado' },
]

export function GestionTalleresPage() {
  const { addToast } = useToast()
  const [data, setData] = useState<Taller[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TallerFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [operadorModalOpen, setOperadorModalOpen] = useState(false)
  const [operadorTallerId, setOperadorTallerId] = useState<string | null>(null)
  const [operadorFormData, setOperadorFormData] = useState<OperadorTallerFormData>(emptyOperadorForm)
  const [isSubmittingOperador, setIsSubmittingOperador] = useState(false)

  const loadData = async () => {
    const result = await getTalleres()
    setData(result)
  }

  useEffect(() => {
    loadData().then(() => setIsLoading(false))
  }, [])

  useLiveRefresh(['taller_created', 'taller_updated'], loadData)

  const openNew = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (item: Taller) => {
    setEditingId(item.id)
    setFormData({ nombre: item.nombre, rfc: item.rfc, direccion: item.direccion, telefono: item.telefono })
    setModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await removeTaller(deleteId)
      await loadData()
      addToast('success', 'Taller eliminado correctamente')
      setDeleteId(null)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al eliminar el taller'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateTaller(editingId, formData)
        addToast('success', 'Taller actualizado correctamente')
      } else {
        await createTaller(formData)
        addToast('success', 'Taller creado correctamente')
      }
      await loadData()
      setModalOpen(false)
      setFormData(emptyForm)
      setEditingId(null)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al guardar el taller'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openOperador = (tallerId: string) => {
    setOperadorTallerId(tallerId)
    setOperadorFormData(emptyOperadorForm)
    setOperadorModalOpen(true)
  }

  const handleSubmitOperador = async () => {
    if (!operadorTallerId) return
    setIsSubmittingOperador(true)
    try {
      await createOperador(operadorTallerId, {
        nombre: operadorFormData.nombre,
        email: operadorFormData.email,
        password: operadorFormData.password,
        puesto: operadorFormData.puesto || undefined,
      })
      addToast('success', 'Operador creado correctamente')
      setOperadorModalOpen(false)
      setOperadorFormData(emptyOperadorForm)
      setOperadorTallerId(null)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al crear el operador'))
    } finally {
      setIsSubmittingOperador(false)
    }
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (search) {
        const q = search.toLowerCase()
        if (!item.nombre.toLowerCase().includes(q) && !item.rfc.toLowerCase().includes(q) && !item.direccion.toLowerCase().includes(q)) return false
      }
      if (statusFilter && item.estado !== statusFilter) return false
      return true
    })
  }, [search, statusFilter, data])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = search || statusFilter

  const columns: Column<Taller>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'rfc', header: 'RFC', sortable: true },
    { key: 'direccion', header: 'Dirección' },
    { key: 'telefono', header: 'Teléfono' },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (item) => <StatusBadge variant={item.estado} size="sm" />,
    },
    {
      key: 'acciones',
      header: '',
      className: 'w-20 text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => openOperador(item.id)} className="p-1.5 text-neutral-400 hover:text-primary-700 transition-colors" aria-label="Agregar operador">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a3 3 0 11-6 0 3 3 0 016 0zM3 20a6 6 0 0112 0v0H3v0z" />
            </svg>
          </button>
          <button type="button" onClick={() => openEdit(item)} className="p-1.5 text-neutral-400 hover:text-primary-700 transition-colors" aria-label="Editar">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button type="button" onClick={() => handleDeleteClick(item.id)} className="p-1.5 text-neutral-400 hover:text-error-600 transition-colors" aria-label="Eliminar">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Talleres</h1>
          <p className="text-sm text-neutral-500 mt-1">Administra los talleres registrados en el sistema.</p>
        </div>
        <button type="button" onClick={openNew} className="px-4 py-2.5 bg-amber-500 text-amber-dark text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
          + Nuevo Taller
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar por nombre, RFC o dirección…" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-600">
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {hasFilters && (
          <button type="button" onClick={() => { setSearch(''); setStatusFilter(''); setPage(1) }} className="text-sm text-primary-700 hover:text-primary-600 underline">
            Limpiar filtros
          </button>
        )}
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
        open={deleteId !== null}
        title="Eliminar Taller"
        message="¿Estás seguro de que deseas eliminar este taller? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isConfirming={isDeleting}
      />

      <CrudModal
        open={modalOpen}
        title={editingId ? 'Editar Taller' : 'Nuevo Taller'}
        onClose={() => { setModalOpen(false); setFormData(emptyForm); setEditingId(null) }}
        onSubmit={handleSubmit}
        submitLabel={editingId ? 'Guardar Cambios' : 'Crear Taller'}
        isSubmitting={isSubmitting}
      >
        <TallerForm data={formData} onChange={setFormData} />
      </CrudModal>

      <CrudModal
        open={operadorModalOpen}
        title="Nuevo Operador"
        onClose={() => { setOperadorModalOpen(false); setOperadorFormData(emptyOperadorForm); setOperadorTallerId(null) }}
        onSubmit={handleSubmitOperador}
        submitLabel="Crear Operador"
        isSubmitting={isSubmittingOperador}
      >
        <OperadorTallerForm data={operadorFormData} onChange={setOperadorFormData} />
      </CrudModal>
    </div>
  )
}
