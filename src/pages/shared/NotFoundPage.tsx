import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-50">
      <h1 className="text-6xl font-bold text-neutral-300">404</h1>
      <p className="text-lg text-neutral-500">Página no encontrada</p>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-sm text-primary-700 hover:text-primary-600 underline"
      >
        Volver al inicio
      </button>
    </div>
  )
}
