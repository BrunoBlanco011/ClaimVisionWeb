import { useState, useEffect } from 'react'
import { InsurerCard, type PlanTier } from '../../components/organisms/InsurerCard'
import { CrudModal } from '../../components/organisms/CrudModal'
import { AseguradoraForm, type AseguradoraFormData } from '../../components/molecules/AseguradoraForm'
import { getAdminAseguradoras, createAdminAseguradora } from '../../services'

interface AseguradoraData {
  id: string
  nombre: string
  rfc: string
  estatus: 'Activa' | 'Inactiva'
  operadores: number
  ajustadores: number
  siniestrosActivos: number
  talleres: number
  plan: PlanTier
}

const INITIAL_FORM: AseguradoraFormData = {
  nombre: '',
  rfc: '',
  dominioCorreo: '',
  emailContactoLegal: '',
  plan: '',
  limitePeritajes: '',
  estatusComercial: 'Activo',
}

export function AseguradorasPage() {
  const [aseguradoras, setAseguradoras] = useState<AseguradoraData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<AseguradoraFormData>(INITIAL_FORM)

  const load = async (p: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminAseguradoras(p, 20, false)
      setAseguradoras(res.items)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar aseguradoras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [])

  const handleSubmit = async () => {
    try {
      await createAdminAseguradora({
        nombre: formData.nombre,
        rfc: formData.rfc,
        dominioCorreo: formData.dominioCorreo,
        emailContactoLegal: formData.emailContactoLegal,
        plan: formData.plan,
      })
      setModalOpen(false)
      setFormData(INITIAL_FORM)
      load(1)
    } catch {
      setError('Error al crear aseguradora')
    }
  }

  const activas = aseguradoras.filter((a) => a.estatus === 'Activa').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Aseguradoras</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'Cargando...' : `${aseguradoras.length} aseguradoras · ${activas} activas`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            Exportar
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-admin-500 rounded-lg hover:bg-admin-600 transition-colors"
          >
            + Nueva aseguradora
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-neutral-400 text-sm">Cargando aseguradoras...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aseguradoras.map((a) => (
              <InsurerCard
                key={a.id}
                nombre={a.nombre}
                rfc={a.rfc}
                estatus={a.estatus}
                operadores={a.operadores}
                ajustadores={a.ajustadores}
                siniestrosActivos={a.siniestrosActivos}
                talleres={a.talleres}
                plan={a.plan}
                onAdminClick={() => {}}
              />
            ))}
            {aseguradoras.length === 0 && (
              <div className="col-span-2 text-center py-12 text-neutral-400 text-sm">No hay aseguradoras registradas</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50"
              >
                Anterior
              </button>
              <span className="text-sm text-neutral-500">Página {page} de {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => load(page + 1)}
                className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      <CrudModal
        open={modalOpen}
        title="Nueva aseguradora"
        onClose={() => { setModalOpen(false); setFormData(INITIAL_FORM) }}
        onSubmit={handleSubmit}
        submitLabel="Crear aseguradora"
      >
        <AseguradoraForm data={formData} onChange={setFormData} />
      </CrudModal>
    </div>
  )
}
