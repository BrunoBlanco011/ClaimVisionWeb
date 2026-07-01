import { useState } from 'react'
import { SearchInput } from '../../components/molecules/SearchInput'
import { StatusBadge } from '../../components/atoms/StatusBadge'
import type { StatusVariant } from '../../components/atoms/StatusBadge'
import { CrudModal } from '../../components/organisms/CrudModal'
import { TallerAdminForm, type TallerAdminFormData } from '../../components/molecules/TallerAdminForm'

interface TallerRow {
  id: string
  nombre: string
  ciudad: string
  aseguradora?: string
  capacidadOcupada: number
  ordenesActivas: number
  calificacion: number | null
  estatus: StatusVariant
}

const MOCK_TALLERES: TallerRow[] = [
  { id: '1', nombre: 'Taller Centro', ciudad: 'Tuxtla Gutiérrez', aseguradora: 'Seguros ABC', capacidadOcupada: 75, ordenesActivas: 12, calificacion: 4.5, estatus: 'aprobado' },
  { id: '2', nombre: 'Carrocería Express', ciudad: 'San Cristóbal', aseguradora: 'Seguros ABC', capacidadOcupada: 45, ordenesActivas: 6, calificacion: 3.8, estatus: 'aprobado' },
  { id: '3', nombre: 'Taller San Juan', ciudad: 'Comitán', capacidadOcupada: 90, ordenesActivas: 18, calificacion: null, estatus: 'pendiente' },
  { id: '4', nombre: 'Mecánica Rápida', ciudad: 'Tuxtla Gutiérrez', aseguradora: 'Aseguradora XYZ', capacidadOcupada: 30, ordenesActivas: 4, calificacion: 5.0, estatus: 'aprobado' },
  { id: '5', nombre: 'Taller del Valle', ciudad: 'Berriozábal', capacidadOcupada: 60, ordenesActivas: 9, calificacion: 4.2, estatus: 'pendiente' },
]

const INITIAL_FORM: TallerAdminFormData = {
  nombreComercial: '',
  rfc: '',
  telefonoContacto: '',
  direccionTecnica: '',
  aseguradora: '',
  fechaConvenio: '',
}

function capacityColor(pct: number): string {
  if (pct >= 80) return 'bg-error-500'
  if (pct >= 50) return 'bg-warning-500'
  return 'bg-success-500'
}

export function GestionTalleresAdminPage() {
  const [search] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<TallerAdminFormData>(INITIAL_FORM)

  const pendientes = MOCK_TALLERES.filter((t) => t.estatus === 'pendiente').length

  const filtered = MOCK_TALLERES.filter((t) => {
    if (search && !t.nombre.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSubmit = () => {
    setModalOpen(false)
    setFormData(INITIAL_FORM)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Talleres</h1>
          <p className="text-sm text-neutral-500 mt-1">{MOCK_TALLERES.length} talleres · {pendientes} pendientes de verificación</p>
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
            + Registrar taller
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <SearchInput />
        </div>
        <select className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          <option>Todos los estatus</option>
          <option>Verificado</option>
          <option>Pendiente</option>
        </select>
        <select className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          <option>Todas las aseguradoras</option>
          <option>Seguros ABC</option>
          <option>Aseguradora XYZ</option>
        </select>
        <select className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
          <option>Todas las ciudades</option>
          <option>Tuxtla Gutiérrez</option>
          <option>San Cristóbal</option>
          <option>Comitán</option>
          <option>Berriozábal</option>
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
                <th className="px-5 py-3 font-medium">Aseguradora</th>
                <th className="px-5 py-3 font-medium">Capacidad ocupada</th>
                <th className="px-5 py-3 font-medium">Órdenes activas</th>
                <th className="px-5 py-3 font-medium">Calificación</th>
                <th className="px-5 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-900">{t.nombre}</p>
                    <p className="text-xs text-neutral-400">{t.ciudad}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{t.aseguradora ?? '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-700">{t.capacidadOcupada}%</span>
                      <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${capacityColor(t.capacidadOcupada)}`} style={{ width: `${t.capacidadOcupada}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-700 font-medium">{t.ordenesActivas}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {t.calificacion ? (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        {t.calificacion}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge variant={t.estatus === 'pendiente' ? 'pendiente' : 'aprobado'} size="sm" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-400">No se encontraron talleres</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CrudModal
        open={modalOpen}
        title="Registrar taller"
        onClose={() => { setModalOpen(false); setFormData(INITIAL_FORM) }}
        onSubmit={handleSubmit}
        submitLabel="Registrar taller"
      >
        <TallerAdminForm data={formData} onChange={setFormData} />
      </CrudModal>
    </div>
  )
}
