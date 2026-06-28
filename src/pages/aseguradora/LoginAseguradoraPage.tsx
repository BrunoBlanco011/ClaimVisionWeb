import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthSplitLayout } from '../../components/templates/AuthSplitLayout'
import { BrandPanel } from '../../components/molecules/BrandPanel'
import { LoginForm } from '../../components/organisms/LoginForm'
import { useAuth } from '../../contexts/useAuth'
import { login } from '../../services/auth.service'
import type { LoginCredentials } from '../../components/organisms/LoginForm'

export function LoginAseguradoraPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | undefined>()

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setAuthError(undefined)

    try {
      const result = await login(credentials)
      authLogin({ ...result.user, role: 'aseguradora' })
      navigate('/aseguradora/dashboard', { replace: true })
    } catch {
      setAuthError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      brandPanel={
        <BrandPanel
          title="Plataforma de gestión\nde siniestros con IA"
          description="Asigna ajustadores, valida peritajes y coordina talleres desde un solo panel."
          footer="© 2025 ClaimVision – Panel Aseguradora"
        />
      }
    >
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={authError}
      />
    </AuthSplitLayout>
  )
}
