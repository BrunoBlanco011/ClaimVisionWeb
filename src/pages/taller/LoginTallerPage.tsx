import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthSplitLayout } from '../../components/templates/AuthSplitLayout'
import { BrandPanel } from '../../components/molecules/BrandPanel'
import { LoginForm } from '../../components/organisms/LoginForm'
import { useAuth } from '../../contexts/useAuth'
import { login } from '../../services/auth.service'
import type { LoginCredentials } from '../../components/organisms/LoginForm'

export function LoginTallerPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | undefined>()

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setAuthError(undefined)

    try {
      const result = await login(credentials)
      authLogin({ ...result.user, role: 'taller' })
      navigate('/taller/bandeja', { replace: true })
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
          title="Portal del Taller"
          description="Recibe expedientes, elabora cotizaciones y gestiona reparaciones."
          footer="© 2025 ClaimVision – Panel Taller"
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
