import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/atoms/Logo'
import { Button } from '../../components/atoms/Button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-app-bg p-6 text-center animate-fade-up">
      <Logo size="md" />

      <div>
        <p className="text-7xl font-bold tracking-tight text-primary-800/15 sm:text-8xl">404</p>
        <h1 className="-mt-6 text-xl font-bold text-neutral-900 sm:text-2xl">Página no encontrada</h1>
        <p className="mt-2 text-sm text-neutral-500">
          La página que buscas no existe o fue movida.
        </p>
      </div>

      <div className="w-full max-w-[220px]">
        <Button type="button" variant="primary" onClick={() => navigate('/login')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}
