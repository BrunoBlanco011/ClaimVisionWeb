import { useState, useEffect, useMemo } from 'react'
import { DataTable, StatusBadge, type Column } from '../../components/organisms/DataTable'
import { CrudModal } from '../../components/organisms/CrudModal'
import { AjustadorForm, type AjustadorFormData } from '../../components/molecules/AjustadorForm'
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog'
import { SearchInput } from '../../components/molecules/SearchInput'
import { getAjustadores, createAjustador, updateAjustador, removeAjustador } from '../../services'
import { useToast } from '../../contexts/Toast'
import type { Ajustador } from '../../types'

const PAGE_SIZE = 5
const emptyForm: AjustadorFormData = { nombre: '', email: '', telefono: '', especialidad: '' }

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completado', label: 'Completado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'cancelado', label: 'Cancelado' },
]

export function GestionAjustadoresPage() {
  const { addToast } = useToast()
  const [data, setData] = useState<Ajustador[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AjustadorFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    getAjustadores().then((result) => {
      setData(result)
      setIsLoading(false)
    })
  }, [])

  const loadData = async () => {
    const result = await getAjustadores()
    setData(result)
  }

  const openNew = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (item: Ajustador) => {
    setEditingId(item.id)
    setFormData({ nombre: item.nombre, email: item.email, telefono: item.telefono, especialidad: item.especialidad })
    setModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await removeAjustador(deleteId)
      await loadData()
      addToast('success', 'Ajustador eliminado correctamente')
      setDeleteId(null)
    } catch {
      addToast('error', 'Error al eliminar el ajustador')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateAjustador(editingId, formData)
        addToast('success', 'Ajustador actualizado correctamente')
      } else {
        await createAjustador(formData)
        addToast('success', 'Ajustador creado correctamente')
      }
      await loadData()
      setModalOpen(false)
      setFormData(emptyForm)
      setEditingId(null)
    } catch {
      addToast('error', 'Error al guardar el ajustador')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (search) {
        const q = search.toLowerCase()
        if (!item.nombre.toLowerCase().includes(q) && !item.email.toLowerCase().includes(q) && !item.especialidad.toLowerCase().includes(q)) return false
      }
      if (statusFilter && item.estado !== statusFilter) return false
      return true
    })
  }, [search, statusFilter, data])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = search || statusFilter

  const columns: Column<Ajustador>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'especialidad', header: 'Especialidad', sortable: true },
    { key: 'incidentesAsignados', header: 'Incidentes', sortable: true },
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
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Ajustadores</h1>
          <p className="text-sm text-neutral-500 mt-1">Administra los ajustadores registrados en el sistema.</p>
        </div>
        <button type="button" onClick={openNew} className="px-4 py-2.5 bg-primary-800 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Nuevo Ajustador
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar por nombre, email o especialidad…" />
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
        title="Eliminar Ajustador"
        message="¿Estás seguro de que deseas eliminar este ajustador? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isConfirming={isDeleting}
      />

      <CrudModal
        open={modalOpen}
        title={editingId ? 'Editar Ajustador' : 'Nuevo Ajustador'}
        onClose={() => { setModalOpen(false); setFormData(emptyForm); setEditingId(null) }}
        onSubmit={handleSubmit}
        submitLabel={editingId ? 'Guardar Cambios' : 'Crear Ajustador'}
        isSubmitting={isSubmitting}
      >
        <AjustadorForm data={formData} onChange={setFormData} />
      </CrudModal>
    </div>
  )
}
