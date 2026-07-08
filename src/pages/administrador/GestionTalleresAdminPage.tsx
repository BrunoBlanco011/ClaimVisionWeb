import { useState, useEffect, useMemo } from 'react'
import { SearchInput } from '../../components/molecules/SearchInput'
import { StatusBadge } from '../../components/atoms/StatusBadge'
import { getAll as getTalleres } from '../../api/admin/talleres/talleres.routes'
import { getAll as getAseguradoras } from '../../api/admin/aseguradoras/aseguradoras.routes'
import type { TallerAdmin } from '../../api/admin/talleres/talleres.schemas'

export function GestionTalleresAdminPage() {
  const [talleres, setTalleres] = useState<TallerAdmin[]>([])
  const [aseguradoras, setAseguradoras] = useState<{ id: string; nombre: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [aseguradoraFilter, setAseguradoraFilter] = useState('')

  useEffect(() => {
    Promise.all([getTalleres(), getAseguradoras()]).then(([t, aseg]) => {
      setTalleres(t)
      setAseguradoras(aseg.items.map((a) => ({ id: a.id, nombre: a.nombre })))
      setIsLoading(false)
    })
  }, [])

  const aseguradoraNombre = (id: string) => aseguradoras.find((a) => a.id === id)?.nombre ?? id

  const pendientes = talleres.filter((t) => t.aseguradorasVinculadas.length === 0).length

  const filtered = useMemo(() => {
    return talleres.filter((t) => {
      if (search && !t.nombre.toLowerCase().includes(search.toLowerCase()) && !t.rfc.toLowerCase().includes(search.toLowerCase())) return false
      if (aseguradoraFilter && !t.aseguradorasVinculadas.includes(aseguradoraFilter)) return false
      return true
    })
  }, [search, aseguradoraFilter, talleres])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Talleres</h1>
          <p className="text-sm text-neutral-500 mt-1">{talleres.length} talleres · {pendientes} sin aseguradora vinculada</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o RFC…" />
        </div>
        <select value={aseguradoraFilter} onChange={(e) => setAseguradoraFilter(e.target.value)} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          <option value="">Todas las aseguradoras</option>
          {aseguradoras.map((a) => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Talleres registrados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">Taller</th>
                <th className="px-5 py-3 font-medium">Dirección</th>
                <th className="px-5 py-3 font-medium">Teléfono</th>
                <th className="px-5 py-3 font-medium">Aseguradoras vinculadas</th>
                <th className="px-5 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-neutral-400">Cargando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-neutral-400">No se encontraron talleres</td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-neutral-900">{t.nombre}</p>
                      <p className="text-xs text-neutral-400">{t.rfc}</p>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{t.direccion}</td>
                    <td className="px-5 py-3 text-neutral-500">{t.telefono}</td>
                    <td className="px-5 py-3 text-neutral-500">
                      {t.aseguradorasVinculadas.length === 0 ? '—' : t.aseguradorasVinculadas.map(aseguradoraNombre).join(', ')}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge variant={t.activo ? 'aprobado' : 'cancelado'} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
