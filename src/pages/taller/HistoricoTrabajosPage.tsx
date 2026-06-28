import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, StatusBadge, type Column } from '../../components/organisms/DataTable'
import { SearchInput } from '../../components/molecules/SearchInput'
import { getTrabajos } from '../../services'
import type { Trabajo, StatusVariant } from '../../types'

const PAGE_SIZE = 5

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const columns: Column<Trabajo>[] = [
  { key: 'numero', header: 'N° Expediente', className: 'font-medium text-neutral-900', sortable: true },
  { key: 'vehiculo', header: 'Vehículo', sortable: true },
  { key: 'taller', header: 'Taller', sortable: true },
  { key: 'fechaInicio', header: 'Fecha Inicio', sortable: true },
  { key: 'fechaFin', header: 'Fecha Fin', sortable: true },
  { key: 'monto', header: 'Monto', className: 'font-medium', sortable: true },
  {
    key: 'estado',
    header: 'Estado',
    sortable: true,
    render: (item) => <StatusBadge variant={item.estado as StatusVariant} size="sm" />,
  },
]

export function HistoricoTrabajosPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Trabajo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    getTrabajos()
      .then((result) => {
        setData(result)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Error al cargar el historial de trabajos. Intenta de nuevo más tarde.')
        setIsLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (search) {
        const q = search.toLowerCase()
        if (!item.numero.toLowerCase().includes(q) && !item.vehiculo.toLowerCase().includes(q) && !item.taller.toLowerCase().includes(q)) return false
      }
      if (statusFilter && item.estado !== statusFilter) return false
      return true
    })
  }, [search, statusFilter, data])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = search || statusFilter

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Histórico de Trabajos</h1>
        <p className="text-sm text-neutral-500 mt-1">Consulta el historial completo de trabajos realizados.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por expediente, vehículo o taller…"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
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

      {error ? (
        <div className="flex items-center gap-3 bg-error-50 border border-error-200 rounded-lg p-4 text-sm text-error-700">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No hay trabajos registrados"
          currentPage={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onRowClick={(item) => navigate(`/taller/historico/${item.id}`)}
        />
      )}
    </div>
  )
}
