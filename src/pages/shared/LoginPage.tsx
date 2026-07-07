import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/templates/AuthLayout'
import { LoginForm } from '../../components/organisms/LoginForm'
import { useAuth } from '../../contexts/useAuth'
import { login } from '../../api/auth/auth.routes'
import type { LoginCredentials } from '../../components/organisms/LoginForm'

const roleRedirect: Record<string, string> = {
  aseguradora: '/aseguradora/dashboard',
  taller: '/taller/bandeja',
  administrador: '/administrador/dashboard',
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | undefined>()

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setAuthError(undefined)

    try {
      const result = await login(credentials)
      authLogin(result.user)
      navigate(roleRedirect[result.user.role], { replace: true })
    } catch {
      setAuthError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout backgroundVariant="gradient">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={authError}
      />
    </AuthLayout>
  )
}
