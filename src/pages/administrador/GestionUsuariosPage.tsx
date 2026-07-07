import { useState } from 'react'
import { SearchInput } from '../../components/molecules/SearchInput'
import { RoleBadge, type RoleVariant } from '../../components/atoms/RoleBadge'
import { CrudModal } from '../../components/organisms/CrudModal'
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog'
import { UsuarioForm, type UsuarioFormData } from '../../components/molecules/UsuarioForm'
import { bloqueoArco as adminBloqueoArco } from '../../api/admin/usuarios/usuarios.routes'

type EstatusUsuario = 'Activo' | 'Inactivo'

interface UsuarioRow {
  id: string
  nombre: string
  email: string
  rolUsuario: RoleVariant
  aseguradoraOTaller?: string
  estatus: EstatusUsuario
  ultimoAcceso: string
}

const MOCK_USUARIOS: UsuarioRow[] = [
  { id: '1', nombre: 'Sistema', email: 'admin@claimvision.com', rolUsuario: 'Administrador_Global', estatus: 'Activo', ultimoAcceso: '30/06/2026 14:23' },
  { id: '2', nombre: 'María López', email: 'maria@segurosabc.com', rolUsuario: 'Operador_Aseguradora', aseguradoraOTaller: 'Seguros ABC', estatus: 'Activo', ultimoAcceso: '29/06/2026 09:15' },
  { id: '3', nombre: 'Juan Pérez', email: 'juan@ajustes.com', rolUsuario: 'Ajustador', aseguradoraOTaller: 'Seguros XYZ', estatus: 'Activo', ultimoAcceso: '28/06/2026 16:45' },
  { id: '4', nombre: 'Taller Centro', email: 'info@tallercentro.com', rolUsuario: 'Operador_Taller', aseguradoraOTaller: 'Taller Centro', estatus: 'Inactivo', ultimoAcceso: '15/05/2026 11:30' },
  { id: '5', nombre: 'Carlos Ruiz', email: 'carlos@cliente.com', rolUsuario: 'Cliente', aseguradoraOTaller: 'Seguros ABC', estatus: 'Activo', ultimoAcceso: '30/06/2026 10:00' },
]

const ROLES = ['Todos los roles', 'Administrador_Global', 'Operador_Aseguradora', 'Ajustador', 'Operador_Taller', 'Cliente'] as const
const ESTATUS = ['Activo', 'Inactivo'] as const

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
  const [search] = useState('')
  const [rolFilter, setRolFilter] = useState('Todos los roles')
  const [estatusFilter, setEstatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<UsuarioFormData>(INITIAL_FORM)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UsuarioRow | null>(null)
  const [arcoLoading, setArcoLoading] = useState(false)
  const [arcoError, setArcoError] = useState<string | null>(null)

  const filtered = MOCK_USUARIOS.filter((u) => {
    if (search && !u.nombre.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (rolFilter !== 'Todos los roles' && u.rolUsuario !== rolFilter) return false
    if (estatusFilter && u.estatus !== estatusFilter) return false
    return true
  })

  const handleSubmit = () => {
    setModalOpen(false)
    setFormData(INITIAL_FORM)
  }

  const handleBaja = async () => {
    if (!selectedUser) return
    setArcoLoading(true)
    setArcoError(null)
    try {
      await adminBloqueoArco(selectedUser.id)
      setConfirmOpen(false)
      setSelectedUser(null)
    } catch (err) {
      setArcoError(err instanceof Error ? err.message : 'Error al aplicar bloqueo ARCO')
    } finally {
      setArcoLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Usuarios</h1>
          <p className="text-sm text-neutral-500 mt-1">{MOCK_USUARIOS.length} usuarios · {ROLES.length - 1} roles</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-admin-500 rounded-lg hover:bg-admin-600 transition-colors"
        >
          + Nuevo usuario
        </button>
      </div>

      {arcoError && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
          {arcoError}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <SearchInput />
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
                <th className="px-5 py-3 font-medium">Aseguradora / Taller</th>
                <th className="px-5 py-3 font-medium">Estatus</th>
                <th className="px-5 py-3 font-medium">Último acceso</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
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
                  <td className="px-5 py-3"><RoleBadge variant={u.rolUsuario} /></td>
                  <td className="px-5 py-3 text-neutral-500">{u.aseguradoraOTaller ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-sm ${u.estatus === 'Activo' ? 'text-success-600' : 'text-neutral-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${u.estatus === 'Activo' ? 'bg-success-500' : 'bg-neutral-300'}`} />
                      {u.estatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{u.ultimoAcceso}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => { setSelectedUser(u); setConfirmOpen(true) }}
                      className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                      aria-label="Acciones"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-400">No se encontraron usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CrudModal
        open={modalOpen}
        title="Nuevo usuario"
        onClose={() => { setModalOpen(false); setFormData(INITIAL_FORM) }}
        onSubmit={handleSubmit}
        submitLabel="Crear usuario"
      >
        <UsuarioForm data={formData} onChange={setFormData} />
      </CrudModal>

      {selectedUser && (
        <ConfirmDialog
          open={confirmOpen}
          title="¿Dar de baja a este usuario?"
          message="Se aplicará baja lógica (soft-delete): se establece deleted_at y estatus_arco = Inactivo. El usuario no podrá iniciar sesión, pero su historial y trazabilidad ARCO se conservan."
          confirmLabel={arcoLoading ? 'Procesando...' : 'Dar de baja'}
          variant="danger"
          onConfirm={handleBaja}
          onCancel={() => { setConfirmOpen(false); setSelectedUser(null) }}
          isConfirming={arcoLoading}
        />
      )}
    </div>
  )
}
