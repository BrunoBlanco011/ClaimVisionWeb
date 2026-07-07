import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, StatusBadge, type Column } from '../../components/organisms/DataTable'
import { SearchInput } from '../../components/molecules/SearchInput'
import { getAll as getIncidentes } from '../../api/aseguradora/siniestros/siniestros.routes'
import type { Incidente } from '../../api/aseguradora/siniestros/siniestros.schemas'

const PAGE_SIZE = 5

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'completado', label: 'Completado' },
  { value: 'rechazado', label: 'Rechazado' },
]

const priorityOptions = [
  { value: '', label: 'Todas las prioridades' },
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' },
]

const columns: Column<Incidente>[] = [
  { key: 'numero', header: 'N° Incidente', className: 'font-medium text-neutral-900', sortable: true },
  { key: 'tipo', header: 'Tipo', sortable: true },
  { key: 'asegurado', header: 'Asegurado', sortable: true },
  { key: 'fecha', header: 'Fecha', sortable: true },
  {
    key: 'prioridad',
    header: 'Prioridad',
    sortable: true,
    render: (item) => {
      const colors: Record<string, string> = { Alta: 'text-error-600', Media: 'text-warning-600', Baja: 'text-neutral-500' }
      return <span className={`text-sm font-medium ${colors[item.prioridad] ?? ''}`}>{item.prioridad}</span>
    },
  },
  {
    key: 'estado',
    header: 'Estado',
    sortable: true,
    render: (item) => <StatusBadge variant={item.estado} size="sm" />,
  },
]

export function BandejaIncidentesPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Incidente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  useEffect(() => {
    getIncidentes().then((result) => {
      setData(result)
      setIsLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (search) {
        const q = search.toLowerCase()
        if (!item.numero.toLowerCase().includes(q) && !item.asegurado.toLowerCase().includes(q) && !item.tipo.toLowerCase().includes(q)) return false
      }
      if (filters.estado && item.estado !== filters.estado) return false
      if (filters.prioridad && item.prioridad !== filters.prioridad) return false
      return true
    })
  }, [search, filters, data])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = search || filters.estado || filters.prioridad

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Bandeja de Incidentes</h1>
        <p className="text-sm text-neutral-500 mt-1">Visualiza y gestiona todos los incidentes reportados.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por N°, asegurado o tipo…"
          />
        </div>
        <select
          value={filters.estado ?? ''}
          onChange={(e) => { setFilters((prev) => ({ ...prev, estado: e.target.value })); setPage(1) }}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filters.prioridad ?? ''}
          onChange={(e) => { setFilters((prev) => ({ ...prev, prioridad: e.target.value })); setPage(1) }}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {hasFilters && (
          <button type="button" onClick={() => { setSearch(''); setFilters({}); setPage(1) }} className="text-sm text-primary-700 hover:text-primary-600 underline">
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
        onRowClick={(item) => navigate(`/aseguradora/incidentes/detalle?id=${item.id}`)}
      />
    </div>
  )
}
