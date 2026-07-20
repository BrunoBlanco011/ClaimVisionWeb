import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import { create as createPresupuesto } from '../../api/taller/cotizaciones/cotizaciones.routes'
import { getById as getExpedienteById } from '../../api/taller/ordenes/ordenes.routes'
import { useToast } from '../../contexts/Toast'
import { getErrorMessage } from '../../api/errors'
import type { Part, VehicleData } from '../../api/taller/cotizaciones/cotizaciones.schemas'

const IVA_RATE = 0.16
let nextPartId = 1

function createPart(): Part {
  return { id: String(nextPartId++), code: '', description: '', quantity: 1, unitPrice: 0 }
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function buildPresupuestoPdf(params: {
  vehicle: VehicleData
  parts: Part[]
  hours: number
  hourlyRate: number
  partsTotal: number
  laborTotal: number
  subtotal: number
  iva: number
  total: number
}): jsPDF {
  const { vehicle, parts, hours, hourlyRate, partsTotal, laborTotal, subtotal, iva, total } = params
  const doc = new jsPDF()
  const marginX = 14
  let y = 20

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Desglose de Cotización', marginX, y)
  y += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, marginX, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Datos del Vehículo', marginX, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.text(`Expediente: ${vehicle.expediente || '-'}`, marginX, y)
  y += 5
  doc.text(`Marca / Modelo: ${vehicle.brand || '-'} ${vehicle.model || ''}`, marginX, y)
  y += 5
  doc.text(`Año: ${vehicle.year || '-'}    Placa: ${vehicle.plate || '-'}`, marginX, y)
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.text('Repuestos', marginX, y)
  y += 6
  doc.setFontSize(9)
  doc.text('Código', marginX, y)
  doc.text('Descripción', marginX + 25, y)
  doc.text('Cant.', marginX + 110, y)
  doc.text('P. Unit.', marginX + 130, y)
  doc.text('Total', marginX + 160, y)
  y += 2
  doc.line(marginX, y, 196, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  for (const part of parts) {
    doc.text(part.code || '-', marginX, y)
    doc.text(part.description || '-', marginX + 25, y, { maxWidth: 82 })
    doc.text(String(part.quantity), marginX + 110, y)
    doc.text(formatCurrency(part.unitPrice), marginX + 130, y)
    doc.text(formatCurrency(part.quantity * part.unitPrice), marginX + 160, y)
    y += 6
  }
  y += 4

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Mano de Obra', marginX, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.text(`${hours} hrs x ${formatCurrency(hourlyRate)} = ${formatCurrency(laborTotal)}`, marginX, y)
  y += 10

  doc.line(marginX, y, 196, y)
  y += 8
  doc.text(`Subtotal refacciones: ${formatCurrency(partsTotal)}`, marginX, y)
  y += 6
  doc.text(`Subtotal: ${formatCurrency(subtotal)}`, marginX, y)
  y += 6
  doc.text(`IVA (16%): ${formatCurrency(iva)}`, marginX, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.text(`Total: ${formatCurrency(total)}`, marginX, y)

  return doc
}

export function ElaboracionPresupuestoPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { id } = useParams()
  const [vehicle, setVehicle] = useState<VehicleData>({ brand: '', model: '', year: '', plate: '', expediente: '' })
  const [parts, setParts] = useState<Part[]>([])
  const [hours, setHours] = useState(0)
  const [hourlyRate, setHourlyRate] = useState(0)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isLoadingExpediente, setIsLoadingExpediente] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoadingExpediente(true)
    getExpedienteById(id)
      .then((exp) => {
        const parts = exp.vehiculo.split(' ')
        const year = parts.length > 2 ? parts[parts.length - 1] : ''
        const model = parts.length > 2 ? parts.slice(1, -1).join(' ') : (parts.length === 2 ? parts[1] : '')
        const brand = parts[0] ?? ''
        setVehicle({ brand, model, year, plate: exp.placa, expediente: exp.numero })
      })
      .catch((err) => addToast('error', getErrorMessage(err, 'Error al cargar los datos del expediente')))
      .finally(() => setIsLoadingExpediente(false))
  }, [id, addToast])

  const partsTotal = parts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0)
  const laborTotal = hours * hourlyRate
  const subtotal = partsTotal + laborTotal
  const iva = subtotal * IVA_RATE
  const total = subtotal + iva

  const updatePart = (id: string, field: keyof Part, value: string | number) => {
    setParts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const removePart = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id))
  }

  const addPart = () => {
    setParts((prev) => [...prev, createPart()])
  }

  const setV = (field: keyof VehicleData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const canGeneratePdf = vehicle.brand && vehicle.model && parts.some((p) => p.code && p.description && p.unitPrice > 0) && hours > 0 && hourlyRate > 0
  const canSubmit = Boolean(id) && canGeneratePdf && pdfBlob !== null

  const handleGeneratePdf = () => {
    const doc = buildPresupuestoPdf({ vehicle, parts, hours, hourlyRate, partsTotal, laborTotal, subtotal, iva, total })
    setPdfBlob(doc.output('blob'))
    addToast('success', 'PDF generado. Descárgalo o continúa para enviar el presupuesto.')
  }

  const handleDownloadPdf = () => {
    if (!pdfBlob) return
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cotizacion-${vehicle.expediente || id || 'presupuesto'}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async () => {
    if (!canSubmit || !id || !pdfBlob) return
    setSubmitting(true)
    try {
      const pdfFilename = `cotizacion-${vehicle.expediente || id}.pdf`
      await createPresupuesto({ vehicle, parts, hours, hourlyRate, siniestroId: id, pdfFile: pdfBlob, pdfFilename })
      setVehicle({ brand: '', model: '', year: '', plate: '', expediente: '' })
      setParts([])
      setHours(0)
      setHourlyRate(0)
      setPdfBlob(null)
      addToast('success', 'Presupuesto enviado exitosamente')
      navigate('/taller/bandeja')
    } catch (err) {
      addToast('error', getErrorMessage(err, 'Error al enviar el presupuesto'))
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoadingExpediente) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <p className="text-lg">Cargando datos del expediente…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Elaborar Presupuesto</h1>
        <p className="text-sm text-neutral-500 mt-1">Crea y envía presupuestos para reparaciones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Datos del Vehículo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Marca" value={vehicle.brand} onChange={setV('brand')} placeholder="Ej: Toyota" />
              <InputField label="Modelo" value={vehicle.model} onChange={setV('model')} placeholder="Ej: Corolla" />
              <InputField label="Año" type="number" value={vehicle.year} onChange={setV('year')} placeholder="2020" />
              <InputField label="Placa" value={vehicle.plate} onChange={setV('plate')} placeholder="ABC-1234" />
              <InputField label="N° de Expediente" value={vehicle.expediente} onChange={setV('expediente')} placeholder="EXP-2026-001" className="sm:col-span-2" />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Repuestos</h2>
              <button type="button" onClick={addPart} className="px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors">
                + Agregar
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  <th className="pb-2 pr-2">Código</th>
                  <th className="pb-2 pr-2">Descripción</th>
                  <th className="pb-2 pr-2 text-right w-20">Cant.</th>
                  <th className="pb-2 pr-2 text-right w-32">Precio Unit.</th>
                  <th className="pb-2 pr-2 text-right w-28">Total</th>
                  <th className="pb-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {parts.length === 0 ? (
                  <tr className="text-neutral-500 italic">
                    <td colSpan={6} className="py-8 text-center">
                      No hay repuestos agregados. Haz clic en "Agregar" para añadir uno.
                    </td>
                  </tr>
                ) : (
                  parts.map((part) => (
                    <tr key={part.id} className="border-b border-neutral-100">
                      <td className="py-2 pr-2">
                        <input value={part.code} onChange={(e) => updatePart(part.id, 'code', e.target.value)} className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-600" placeholder="Código" />
                      </td>
                      <td className="py-2 pr-2">
                        <input value={part.description} onChange={(e) => updatePart(part.id, 'description', e.target.value)} className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-600" placeholder="Descripción" />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" min={1} value={part.quantity} onChange={(e) => updatePart(part.id, 'quantity', Math.max(1, Number(e.target.value)))} className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary-600" />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" min={0} step={0.01} value={part.unitPrice} onChange={(e) => updatePart(part.id, 'unitPrice', Math.max(0, Number(e.target.value)))} className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary-600" placeholder="0.00" />
                      </td>
                      <td className="py-2 pr-2 text-right text-neutral-700 font-medium">{formatCurrency(part.quantity * part.unitPrice)}</td>
                      <td className="py-2">
                        <button type="button" onClick={() => removePart(part.id)} className="p-1 text-neutral-400 hover:text-error-600 transition-colors" aria-label="Eliminar">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Mano de Obra</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Horas estimadas" type="number" value={String(hours)} onChange={(e) => setHours(Math.max(0, Number(e.target.value)))} placeholder="0" />
              <InputField label="Costo por hora" type="number" prefix="$" value={String(hourlyRate)} onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))} placeholder="0.00" />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">PDF de la Cotización</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Genera el desglose en PDF con los datos capturados arriba. Al enviar el presupuesto, el PDF se sube a Supabase Storage como parte de la misma solicitud.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!canGeneratePdf}
                onClick={handleGeneratePdf}
                className="px-4 py-2 text-sm font-medium text-amber-dark bg-amber-500 rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generar PDF
              </button>
              <button
                type="button"
                disabled={!pdfBlob}
                onClick={handleDownloadPdf}
                className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Descargar PDF
              </button>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Resumen</h2>
            <div className="flex flex-col gap-3 text-sm">
              <Row label="Subtotal refacciones" value={formatCurrency(partsTotal)} />
              <Row label="Mano de obra" value={formatCurrency(laborTotal)} />
              <div className="border-t border-neutral-200 pt-2">
                <Row label="Subtotal" value={formatCurrency(subtotal)} />
              </div>
              <Row label="IVA (16%)" value={formatCurrency(iva)} />
              <Row label="Total" value={formatCurrency(total)} bold />
            </div>
          </section>

          <button type="button" disabled={!canSubmit || submitting} onClick={handleSubmit} className="w-full py-3 px-6 bg-amber-500 text-amber-dark font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Enviando…' : 'Enviar Presupuesto'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, type = 'text', prefix, value, onChange, placeholder, className = '' }: {
  label: string; type?: string; prefix?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; className?: string
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">{prefix}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 ${prefix ? 'pl-7' : ''}`} />
      </div>
    </div>
  )
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-600">{label}</span>
      <span className={`text-neutral-900 ${bold ? 'font-semibold text-base' : ''}`}>{value}</span>
    </div>
  )
}
