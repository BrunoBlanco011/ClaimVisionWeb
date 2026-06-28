import { useState } from 'react'
import { Logo } from '../../atoms/Logo'
import { Button } from '../../atoms/Button'
import { ErrorMessage } from '../../atoms/ErrorMessage'
import { FormField } from '../../molecules/FormField'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void
  isLoading?: boolean
  error?: string
}

interface FormErrors {
  email?: string
  password?: string
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'El correo es obligatorio'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return 'Ingresa un correo válido'
  return undefined
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'La contraseña es obligatoria'
  if (value.length < 6) return 'Mínimo 6 caracteres'
  return undefined
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === 'email' ? email : password
    const validator = field === 'email' ? validateEmail : validatePassword
    setErrors((prev) => ({ ...prev, [field]: validator(value) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setTouched({ email: true, password: true })
    setErrors({ email: emailError, password: passwordError })

    if (emailError || passwordError) return
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-col items-center gap-3">
        <Logo size="lg" variant="full" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Iniciar sesión</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Ingresa tus credenciales para continuar
          </p>
        </div>
      </div>

      {/* Campos */}
      <div className="flex flex-col gap-4">
        <FormField
          label="Correo electrónico"
          type="email"
          required
          error={touched.email ? errors.email : undefined}
          inputProps={{
            value: email,
            onChange: (e) => setEmail(e.target.value),
            onBlur: () => handleBlur('email'),
            placeholder: 'nombre@empresa.com',
            autoComplete: 'email',
            disabled: isLoading,
          }}
        />

        <FormField
          label="Contraseña"
          type="password"
          required
          error={touched.password ? errors.password : undefined}
          inputProps={{
            value: password,
            onChange: (e) => setPassword(e.target.value),
            onBlur: () => handleBlur('password'),
            placeholder: '••••••••',
            autoComplete: 'current-password',
            disabled: isLoading,
          }}
        />
      </div>

      {/* Error global de autenticación */}
      {error && <ErrorMessage message={error} />}

      {/* Botón de envío */}
      <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
        {isLoading ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  )
}
