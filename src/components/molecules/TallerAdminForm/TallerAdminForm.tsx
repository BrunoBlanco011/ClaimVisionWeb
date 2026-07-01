export interface TallerAdminFormData {
  nombreComercial: string
  rfc: string
  telefonoContacto: string
  direccionTecnica: string
  aseguradora: string
  fechaConvenio: string
}

export interface TallerAdminFormProps {
  data: TallerAdminFormData
  onChange: (data: TallerAdminFormData) => void
}

export function TallerAdminForm({ data, onChange }: TallerAdminFormProps) {
  const set = (field: keyof TallerAdminFormData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre comercial*</label>
        <input
          type="text"
          value={data.nombreComercial}
          onChange={(e) => set('nombreComercial', e.target.value)}
          placeholder="Nombre del taller"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">RFC*</label>
        <input
          type="text"
          value={data.rfc}
          onChange={(e) => set('rfc', e.target.value)}
          placeholder="PRE050617RT8"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono de contacto*</label>
        <input
          type="tel"
          value={data.telefonoContacto}
          onChange={(e) => set('telefonoContacto', e.target.value)}
          placeholder="+52 ..."
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Dirección técnica*</label>
        <textarea
          value={data.direccionTecnica}
          onChange={(e) => set('direccionTecnica', e.target.value)}
          placeholder="Calle, número, colonia, ciudad"
          rows={2}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 placeholder-neutral-400 resize-none"
        />
      </div>

      <div className="pt-3 border-t border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-700 mb-3">VINCULAR A ASEGURADORA · convenio_aseguradora_taller</h3>
        <p className="text-xs text-neutral-400 mb-3">Opcional</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Aseguradora</label>
            <select
              value={data.aseguradora}
              onChange={(e) => set('aseguradora', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
            >
              <option value="">Seleccionar...</option>
              <option>Seguros ABC</option>
              <option>Aseguradora XYZ</option>
              <option>Seguros del Valle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Fecha de convenio</label>
            <input
              type="date"
              value={data.fechaConvenio}
              onChange={(e) => set('fechaConvenio', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
