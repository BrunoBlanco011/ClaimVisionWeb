import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, StatusBadge, type Column } from '../../components/organisms/DataTable'
import { SearchInput } from '../../components/molecules/SearchInput'
import { getAll as getExpedientes } from '../../api/taller/ordenes/ordenes.routes'
import type { Expediente } from '../../api/taller/ordenes/ordenes.schemas'

const PAGE_SIZE = 5

const columns: Column<Expediente>[] = [
  { key: 'numero', header: 'N° Expediente', className: 'font-medium text-neutral-900', sortable: true },
  { key: 'vehiculo', header: 'Vehículo', sortable: true },
  { key: 'placa', header: 'Placa', sortable: true },
  { key: 'fechaIngreso', header: 'Fecha', sortable: true },
  {
    key: 'estado',
    header: 'Estado',
    sortable: true,
    render: (item) => <StatusBadge variant={item.estado} size="sm" />,
  },
]

export function HistoricoTrabajosPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Expediente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    getExpedientes()
      .then((result) => {
        // Trabajos concluidos = expedientes que llegaron a Trabajo_Concluido/Listo_Para_Entrega/Entregado
        // (todos mapean a StatusVariant 'completado' — ver STATUS_TALLER_MAP en services/mappers.ts).
        setData(result.filter((e) => e.estado === 'completado'))
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
        if (!item.numero.toLowerCase().includes(q) && !item.vehiculo.toLowerCase().includes(q) && !item.placa.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [search, data])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Histórico de Trabajos</h1>
        <p className="text-sm text-neutral-500 mt-1">Consulta el historial de trabajos concluidos.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por expediente, vehículo o placa…"
          />
        </div>
        {search && (
          <button type="button" onClick={() => { setSearch(''); setPage(1) }} className="text-sm text-primary-700 hover:text-primary-600 underline">
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
          emptyMessage="No hay trabajos concluidos"
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
