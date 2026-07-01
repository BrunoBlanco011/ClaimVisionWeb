export interface UsuarioFormData {
  email: string
  nombreCompleto: string
  telefono: string
  rol: string
  aseguradora: string
  contrasenaTemporal: string
  enviarInvitacion: boolean
  huellaVinculada: boolean
}

export interface UsuarioFormProps {
  data: UsuarioFormData
  onChange: (data: UsuarioFormData) => void
}

const ROLES: string[] = [
  'Administrador_Global',
  'Operador_Aseguradora',
  'Ajustador',
  'Operador_Taller',
  'Cliente',
]

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let pass = ''
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pass
}

export function UsuarioForm({ data, onChange }: UsuarioFormProps) {
  const set = (field: keyof UsuarioFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value })
  }

  const needsAseguradora = data.rol === 'Operador_Aseguradora' || data.rol === 'Ajustador'

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Correo electrónico*</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="usuario@empresa.mx"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre completo*</label>
        <input
          type="text"
          value={data.nombreCompleto}
          onChange={(e) => set('nombreCompleto', e.target.value)}
          placeholder="Nombre completo"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
        <p className="text-xs text-neutral-400 mt-1">Se almacena cifrado (AES-256)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
        <input
          type="tel"
          value={data.telefono}
          onChange={(e) => set('telefono', e.target.value)}
          placeholder="+52 ..."
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
        <p className="text-xs text-neutral-400 mt-1">Se almacena cifrado (AES-256)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Rol*</label>
        <select
          value={data.rol}
          onChange={(e) => set('rol', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
        >
          <option value="">Seleccionar rol...</option>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {needsAseguradora && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Aseguradora</label>
          <select
            value={data.aseguradora}
            onChange={(e) => set('aseguradora', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
          >
            <option value="">Seleccionar aseguradora...</option>
            <option>Seguros ABC</option>
            <option>Aseguradora XYZ</option>
            <option>Seguros del Valle</option>
          </select>
          <p className="text-xs text-neutral-400 mt-1">Obligatorio para Operador Aseguradora y Ajustador</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Contraseña temporal</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={data.contrasenaTemporal}
              readOnly
              placeholder="Presiona 'Generar'"
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 placeholder-neutral-400"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const pwd = generatePassword()
              set('contrasenaTemporal', pwd)
            }}
            className="px-3 py-2 text-sm font-medium text-admin-500 border border-admin-500 rounded-lg hover:bg-admin-50 transition-colors"
          >
            Generar
          </button>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.enviarInvitacion}
          onChange={(e) => set('enviarInvitacion', e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-admin-500"
        />
        <div>
          <span className="text-sm text-neutral-700">Enviar invitación por correo</span>
          <p className="text-xs text-neutral-400">El usuario define su contraseña en el primer acceso</p>
        </div>
      </label>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.huellaVinculada}
          onChange={(e) => set('huellaVinculada', e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-admin-500"
        />
        <div>
          <span className="text-sm text-neutral-700">huella_vinculada</span>
          <p className="text-xs text-neutral-400">Se vincula desde el dispositivo del usuario</p>
        </div>
      </label>
    </div>
  )
}
