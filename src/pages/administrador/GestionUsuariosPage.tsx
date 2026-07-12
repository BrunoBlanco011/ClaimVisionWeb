import { useState, useEffect, useMemo } from 'react'
import { SearchInput } from '../../components/molecules/SearchInput'
import { RoleBadge, type RoleVariant } from '../../components/atoms/RoleBadge'
import { CrudModal } from '../../components/organisms/CrudModal'
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog'
import { UsuarioForm, type UsuarioFormData } from '../../components/molecules/UsuarioForm'
import { getAll as getUsuarios, create as createUsuario, update as updateUsuario, remove as removeUsuario, bloqueoArco } from '../../api/admin/usuarios/usuarios.routes'
import { getAll as getAseguradoras, crearOperador as crearOperadorAseguradora } from '../../api/admin/aseguradoras/aseguradoras.routes'
import { useToast } from '../../contexts/Toast'
import type { Usuario } from '../../api/admin/usuarios/usuarios.schemas'

const ROLES = ['Todos los roles', 'Administrador_Global', 'Operador_Aseguradora', 'Ajustador', 'Operador_Taller', 'Cliente'] as const
const ESTATUS = ['Activo', 'Bloqueado'] as const

const INITIAL_FORM: UsuarioFormData = {
  email: '',
  nombreCompleto: '',
  telefono: '',
  rol: '',
  aseguradora: '',
  contrasenaTemporal: '',
  enviarInvitacion: true,
  huellaVinculada: false,
}

export function GestionUsuariosPage() {
  const { addToast } = useToast()
  const [data, setData] = useState<Usuario[]>([])
  const [aseguradoras, setAseguradoras] = useState<{ id: string; nombre: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [rolFilter, setRolFilter] = useState('Todos los roles')
  const [estatusFilter, setEstatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<UsuarioFormData>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [arcoTarget, setArcoTarget] = useState<string | null>(null)
  const [isProcessingArco, setIsProcessingArco] = useState(false)

  useEffect(() => {
    Promise.all([getUsuarios(), getAseguradoras()]).then(([usuarios, aseg]) => {
      setData(usuarios)
      setAseguradoras(aseg.items.map((a) => ({ id: a.id, nombre: a.nombre })))
      setIsLoading(false)
    })
  }, [])

  const loadData = async () => {
    const usuarios = await getUsuarios()
    setData(usuarios)
  }

  const aseguradoraNombre = (id: string | null) => aseguradoras.find((a) => a.id === id)?.nombre ?? '—'

  const openNew = () => {
    setEditingId(null)
    setFormData(INITIAL_FORM)
    setModalOpen(true)
  }

  const openEdit = (item: Usuario) => {
    setEditingId(item.id)
    setFormData({
      email: item.email,
      nombreCompleto: item.nombre,
      telefono: item.telefono,
      rol: item.rol,
      aseguradora: item.aseguradoraId ?? '',
      contrasenaTemporal: '',
      enviarInvitacion: true,
      huellaVinculada: false,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateUsuario(editingId, {
          nombre: formData.nombreCompleto,
          email: formData.email,
          telefono: formData.telefono,
          rol: formData.rol,
          aseguradoraId: formData.aseguradora || undefined,
          password: formData.contrasenaTemporal || undefined,
        })
        addToast('success', 'Usuario actualizado correctamente')
      } else if (formData.rol === 'Operador_Aseguradora') {
        await crearOperadorAseguradora(formData.aseguradora, {
          nombre: formData.nombreCompleto,
          email: formData.email,
          password: formData.contrasenaTemporal,
        })
        addToast('success', 'Operador de aseguradora creado correctamente')
      } else {
        await createUsuario({
          nombre: formData.nombreCompleto,
          email: formData.email,
          telefono: formData.telefono,
          rol: formData.rol,
          aseguradoraId: formData.aseguradora || undefined,
          password: formData.contrasenaTemporal,
        })
        addToast('success', 'Usuario creado correctamente')
      }
      await loadData()
      setModalOpen(false)
      setFormData(INITIAL_FORM)
      setEditingId(null)
    } catch {
      addToast('error', 'Error al guardar el usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await removeUsuario(deleteId)
      await loadData()
      addToast('success', 'Usuario eliminado correctamente')
      setDeleteId(null)
    } catch {
      addToast('error', 'Error al eliminar el usuario')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleArcoConfirm = async () => {
    if (!arcoTarget) return
    setIsProcessingArco(true)
    try {
      await bloqueoArco(arcoTarget)
      await loadData()
      addToast('success', 'Bloqueo ARCO aplicado correctamente')
      setArcoTarget(null)
    } catch {
      addToast('error', 'Error al aplicar bloqueo ARCO')
    } finally {
      setIsProcessingArco(false)
    }
  }

  const filtered = useMemo(() => {
    return data.filter((u) => {
      if (search && !u.nombre.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
      if (rolFilter !== 'Todos los roles' && u.rol !== rolFilter) return false
      if (estatusFilter === 'Activo' && u.bloqueado) return false
      if (estatusFilter === 'Bloqueado' && !u.bloqueado) return false
      return true
    })
  }, [search, rolFilter, estatusFilter, data])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Usuarios</h1>
          <p className="text-sm text-neutral-500 mt-1">{data.length} usuarios · {ROLES.length - 1} roles</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="px-4 py-2 text-sm font-medium text-white bg-admin-500 rounded-lg hover:bg-admin-600 transition-colors"
        >
          + Nuevo usuario
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o correo…" />
        </div>
        <select value={rolFilter} onChange={(e) => setRolFilter(e.target.value)} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={estatusFilter} onChange={(e) => setEstatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          <option value="">Todos los estatus</option>
          {ESTATUS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Usuarios del sistema</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">rol_usuario</th>
                <th className="px-5 py-3 font-medium">Aseguradora</th>
                <th className="px-5 py-3 font-medium">Estatus</th>
                <th className="px-5 py-3 font-medium">Creado</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-400">Cargando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-400">No se encontraron usuarios</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-800 text-white flex items-center justify-center text-xs font-medium">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{u.nombre}</p>
                          <p className="text-xs text-neutral-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><RoleBadge variant={u.rol as RoleVariant} /></td>
                    <td className="px-5 py-3 text-neutral-500">{aseguradoraNombre(u.aseguradoraId)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-sm ${!u.bloqueado ? 'text-success-600' : 'text-neutral-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${!u.bloqueado ? 'bg-success-500' : 'bg-neutral-300'}`} />
                        {u.estatusArco}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{new Date(u.createdAt).toLocaleDateString('es-MX')}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setArcoTarget(u.id)} className="p-1.5 text-neutral-400 hover:text-warning-600 transition-colors" aria-label="Bloquear ARCO">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </button>
                        <button type="button" onClick={() => openEdit(u)} className="p-1.5 text-neutral-400 hover:text-primary-700 transition-colors" aria-label="Editar">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button type="button" onClick={() => setDeleteId(u.id)} className="p-1.5 text-neutral-400 hover:text-error-600 transition-colors" aria-label="Eliminar">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer si tiene siniestros activos, la baja será rechazada por el backend."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isConfirming={isDeleting}
      />

      <ConfirmDialog
        open={arcoTarget !== null}
        title="¿Dar de baja a este usuario?"
        message="Se aplicará baja lógica (soft-delete): se establece deleted_at y estatus_arco = Inactivo. El usuario no podrá iniciar sesión, pero su historial y trazabilidad ARCO se conservan."
        confirmLabel={isProcessingArco ? 'Procesando...' : 'Dar de baja'}
        variant="danger"
        onConfirm={handleArcoConfirm}
        onCancel={() => setArcoTarget(null)}
        isConfirming={isProcessingArco}
      />

      <CrudModal
        open={modalOpen}
        title={editingId ? 'Editar usuario' : 'Nuevo usuario'}
        onClose={() => { setModalOpen(false); setFormData(INITIAL_FORM); setEditingId(null) }}
        onSubmit={handleSubmit}
        submitLabel={editingId ? 'Guardar Cambios' : 'Crear usuario'}
        isSubmitting={isSubmitting}
      >
        <UsuarioForm data={formData} onChange={setFormData} aseguradoras={aseguradoras} isEditing={editingId !== null} />
      </CrudModal>
    </div>
  )
}
