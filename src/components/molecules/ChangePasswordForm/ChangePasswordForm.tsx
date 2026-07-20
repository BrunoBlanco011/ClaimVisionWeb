import { useState } from 'react'
import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'
import { changePassword } from '../../../api/auth/auth.routes'
import { getErrorMessage } from '../../../api/errors'
import { useToast } from '../../../contexts/Toast'

export function ChangePasswordForm() {
  const { addToast } = useToast()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const canSubmit = oldPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (newPassword !== confirmPassword) addToast('error', 'Las contraseñas nuevas no coinciden')
      return
    }
    setSaving(true)
    try {
      await changePassword(oldPassword, newPassword)
      addToast('success', 'Contraseña actualizada correctamente')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      addToast('error', getErrorMessage(err, 'No se pudo actualizar la contraseña'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-white rounded-xl border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cambiar contraseña</h2>
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex flex-col gap-1">
          <Label htmlFor="cp-old">Contraseña actual</Label>
          <Input id="cp-old" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cp-new">Nueva contraseña</Label>
          <Input id="cp-new" type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cp-confirm">Confirmar nueva contraseña</Label>
          <Input id="cp-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite la nueva contraseña" />
        </div>
        <button
          type="button"
          disabled={!canSubmit || saving}
          onClick={handleSubmit}
          className="self-start px-4 py-2 text-sm font-medium text-amber-dark bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Actualizar contraseña'}
        </button>
      </div>
    </section>
  )
}
