import { useState, useEffect } from 'react'
import { InsurerCard, type PlanTier } from '../../components/organisms/InsurerCard'
import { CrudModal } from '../../components/organisms/CrudModal'
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog'
import { AseguradoraForm, type AseguradoraFormData } from '../../components/molecules/AseguradoraForm'
import { Input } from '../../components/atoms/Input'
import { Label } from '../../components/atoms/Label'
import {
  getAll as getAdminAseguradoras,
  getDesincorporadas,
  create as createAdminAseguradora,
  cambiarSuscripcion,
  verificar as verificarAseguradora,
  remove as removeAseguradora,
  reactivar as reactivarAseguradora,
  crearOperador as crearOperadorAseguradora,
} from '../../api/admin/aseguradoras/aseguradoras.routes'
import { useToast } from '../../contexts/Toast'
import { getErrorMessage } from '../../api/errors'

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

const PLANES: PlanTier[] = ['Básico', 'Pro', 'Enterprise']

const EMPTY_OPERADOR = { nombre: '', email: '', password: '' }

function toCsv(rows: AseguradoraData[]): string {
  const headers = ['Nombre', 'RFC', 'Estatus', 'Plan', 'Operadores', 'Ajustadores', 'Siniestros activos', 'Talleres']
  const lines = rows.map((r) => [r.nombre, r.rfc, r.estatus, r.plan, r.operadores, r.ajustadores, r.siniestrosActivos, r.talleres]
    .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
  return [headers.join(','), ...lines].join('\n')
}

export function AseguradorasPage() {
  const { addToast } = useToast()
  const [aseguradoras, setAseguradoras] = useState<AseguradoraData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<AseguradoraFormData>(INITIAL_FORM)

  const [adminTarget, setAdminTarget] = useState<AseguradoraData | null>(null)
  const [nuevoPlan, setNuevoPlan] = useState<PlanTier>('Básico')
  const [savingPlan, setSavingPlan] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [operadorForm, setOperadorForm] = useState(EMPTY_OPERADOR)
  const [creatingOperador, setCreatingOperador] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AseguradoraData | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [view, setView] = useState<'activas' | 'desincorporadas'>('activas')
  const [reactivatingId, setReactivatingId] = useState<string | null>(null)

  const load = async (p: number, currentView: typeof view = view) => {
    setLoading(true)
    setError(null)
    try {
      const res = currentView === 'activas' ? await getAdminAseguradoras(p, 20, false) : await getDesincorporadas(p, 20)
      setAseguradoras(res.items)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch (err) {
      setError(getErrorMessage(err, 'Error al cargar aseguradoras'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(1) }, [])

  const handleChangeView = (v: 'activas' | 'desincorporadas') => {
    setView(v)
    load(1, v)
  }

  const handleReactivar = async (a: AseguradoraData) => {
    setReactivatingId(a.id)
    try {
      await reactivarAseguradora(a.id)
      addToast('success', 'Aseguradora reactivada correctamente')
      await load(page)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al reactivar la aseguradora'))
    } finally {
      setReactivatingId(null)
    }
  }

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
      addToast('success', 'Aseguradora creada correctamente')
      load(1)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al crear la aseguradora'))
    }
  }

  const handleExport = () => {
    const csv = toCsv(aseguradoras)
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aseguradoras-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const openAdmin = (a: AseguradoraData) => {
    setAdminTarget(a)
    setNuevoPlan(a.plan)
    setOperadorForm(EMPTY_OPERADOR)
  }

  const closeAdmin = () => setAdminTarget(null)

  const handleGuardarPlan = async () => {
    if (!adminTarget) return
    setSavingPlan(true)
    try {
      await cambiarSuscripcion(adminTarget.id, nuevoPlan)
      addToast('success', 'Plan de suscripción actualizado')
      await load(page)
      setAdminTarget((prev) => (prev ? { ...prev, plan: nuevoPlan } : prev))
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al cambiar el plan de suscripción'))
    } finally {
      setSavingPlan(false)
    }
  }

  const handleVerificar = async () => {
    if (!adminTarget) return
    setVerifying(true)
    try {
      await verificarAseguradora(adminTarget.id)
      addToast('success', 'Aseguradora verificada correctamente')
      await load(page)
      setAdminTarget((prev) => (prev ? { ...prev, estatus: 'Activa' } : prev))
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al verificar la aseguradora'))
    } finally {
      setVerifying(false)
    }
  }

  const handleCrearOperador = async () => {
    if (!adminTarget || !operadorForm.nombre || !operadorForm.email || !operadorForm.password) return
    setCreatingOperador(true)
    try {
      await crearOperadorAseguradora(adminTarget.id, operadorForm)
      addToast('success', 'Operador creado correctamente')
      setOperadorForm(EMPTY_OPERADOR)
      await load(page)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al crear el operador'))
    } finally {
      setCreatingOperador(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeAseguradora(deleteTarget.id)
      addToast('success', 'Aseguradora dada de baja correctamente')
      setDeleteTarget(null)
      setAdminTarget(null)
      await load(page)
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al dar de baja la aseguradora'))
    } finally {
      setDeleting(false)
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
          <button
            type="button"
            onClick={handleExport}
            disabled={aseguradoras.length === 0}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleChangeView('activas')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'activas' ? 'bg-admin-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
        >
          Activas
        </button>
        <button
          type="button"
          onClick={() => handleChangeView('desincorporadas')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'desincorporadas' ? 'bg-admin-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
        >
          Dadas de baja
        </button>
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
                actionLabel={view === 'activas' ? 'Administrar' : reactivatingId === a.id ? 'Reactivando…' : 'Reactivar'}
                onAdminClick={() => (view === 'activas' ? openAdmin(a) : handleReactivar(a))}
              />
            ))}
            {aseguradoras.length === 0 && (
              <div className="col-span-2 text-center py-12 text-neutral-400 text-sm">
                {view === 'activas' ? 'No hay aseguradoras registradas' : 'No hay aseguradoras dadas de baja'}
              </div>
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

      {adminTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeAdmin() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Administrar {adminTarget.nombre}</h2>
                <p className="text-xs text-neutral-500">RFC: {adminTarget.rfc} · Estatus: {adminTarget.estatus}</p>
              </div>
              <button type="button" onClick={closeAdmin} className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" aria-label="Cerrar">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
              {adminTarget.estatus === 'Inactiva' && (
                <section className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900">Verificación</h3>
                  <p className="text-xs text-neutral-500">Esta aseguradora aún no ha sido verificada.</p>
                  <button
                    type="button"
                    disabled={verifying}
                    onClick={handleVerificar}
                    className="self-start px-4 py-2 text-sm font-medium text-white bg-success-600 rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50"
                  >
                    {verifying ? 'Verificando…' : 'Verificar aseguradora'}
                  </button>
                </section>
              )}

              <section className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-neutral-900">Plan de suscripción</h3>
                <div className="flex gap-2">
                  <select
                    value={nuevoPlan}
                    onChange={(e) => setNuevoPlan(e.target.value as PlanTier)}
                    className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    {PLANES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button
                    type="button"
                    disabled={savingPlan || nuevoPlan === adminTarget.plan}
                    onClick={handleGuardarPlan}
                    className="px-4 py-2 text-sm font-medium text-amber-dark bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {savingPlan ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-neutral-900">Crear operador de aseguradora</h3>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="op-nombre">Nombre</Label>
                  <Input id="op-nombre" value={operadorForm.nombre} onChange={(e) => setOperadorForm((p) => ({ ...p, nombre: e.target.value }))} placeholder="Nombre completo" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="op-email">Correo</Label>
                  <Input id="op-email" type="email" value={operadorForm.email} onChange={(e) => setOperadorForm((p) => ({ ...p, email: e.target.value }))} placeholder="operador@empresa.mx" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="op-password">Contraseña temporal</Label>
                  <Input id="op-password" type="password" minLength={8} value={operadorForm.password} onChange={(e) => setOperadorForm((p) => ({ ...p, password: e.target.value }))} placeholder="Mínimo 8 caracteres" />
                </div>
                <button
                  type="button"
                  disabled={creatingOperador || !operadorForm.nombre || !operadorForm.email || !operadorForm.password}
                  onClick={handleCrearOperador}
                  className="self-start px-4 py-2 text-sm font-medium text-amber-dark bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {creatingOperador ? 'Creando…' : 'Crear operador'}
                </button>
              </section>

              <section className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
                <h3 className="text-sm font-semibold text-error-700">Zona de riesgo</h3>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(adminTarget)}
                  className="self-start px-4 py-2 text-sm font-medium text-error-600 border border-error-200 rounded-lg hover:bg-error-50 transition-colors"
                >
                  Dar de baja aseguradora
                </button>
              </section>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Dar de baja aseguradora"
        message={`¿Estás seguro de que deseas dar de baja a "${deleteTarget?.nombre}"? Podrás reactivarla después desde la pestaña "Dadas de baja".`}
        confirmLabel="Dar de baja"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isConfirming={deleting}
      />
    </div>
  )
}
