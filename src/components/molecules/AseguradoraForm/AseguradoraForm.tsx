export interface AseguradoraFormData {
  nombre: string
  rfc: string
  dominioCorreo: string
  emailContactoLegal: string
  plan: string
  limitePeritajes: string
  estatusComercial: string
}

export interface AseguradoraFormProps {
  data: AseguradoraFormData
  onChange: (data: AseguradoraFormData) => void
}

const PLANES: string[] = ['Básico', 'Pro', 'Enterprise']
const ESTATUS = ['Activo', 'Inactivo']

export function AseguradoraForm({ data, onChange }: AseguradoraFormProps) {
  const set = (field: keyof AseguradoraFormData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre*</label>
        <input
          type="text"
          value={data.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          placeholder="Nombre de la aseguradora"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">RFC*</label>
        <input
          type="text"
          value={data.rfc}
          onChange={(e) => set('rfc', e.target.value)}
          placeholder="SBA980412H21"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Dominio de correo*</label>
        <input
          type="text"
          value={data.dominioCorreo}
          onChange={(e) => set('dominioCorreo', e.target.value)}
          placeholder="@empresa.mx"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Email de contacto legal*</label>
        <input
          type="email"
          value={data.emailContactoLegal}
          onChange={(e) => set('emailContactoLegal', e.target.value)}
          placeholder="legal@empresa.mx"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Plan de suscripción*</label>
        <select
          value={data.plan}
          onChange={(e) => set('plan', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
        >
          <option value="">Seleccionar plan...</option>
          {PLANES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Límite de peritajes/mes*</label>
        <input
          type="number"
          value={data.limitePeritajes}
          onChange={(e) => set('limitePeritajes', e.target.value)}
          placeholder="500"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Estatus comercial</label>
        <select
          value={data.estatusComercial}
          onChange={(e) => set('estatusComercial', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
        >
          {ESTATUS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>
    </div>
  )
}
