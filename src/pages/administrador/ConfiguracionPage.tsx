export function ConfiguracionPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-500 mt-1">Administra tu perfil y preferencias del sistema</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-neutral-900 pb-2 border-b border-neutral-100">Perfil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
            <input type="text" value="Administrador Global" disabled className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Correo</label>
            <input type="email" value="admin@claimvision.com" disabled className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-neutral-900 pb-2 border-b border-neutral-100">Notificaciones</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-neutral-300 text-admin-500" />
            <span className="text-sm text-neutral-700">Notificaciones por correo electrónico</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-admin-500" />
            <span className="text-sm text-neutral-700">Notificaciones SMS</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="px-6 py-2 text-sm font-medium text-white bg-admin-500 rounded-lg hover:bg-admin-600 transition-colors">
          Guardar Configuración
        </button>
      </div>
    </div>
  )
}
