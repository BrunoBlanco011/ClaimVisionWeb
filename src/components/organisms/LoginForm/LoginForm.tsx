import { useState } from 'react'
import { Button } from '../../atoms/Button'
import { ErrorMessage } from '../../atoms/ErrorMessage'
import { FormField } from '../../molecules/FormField'

const iconProps = {
  className: 'h-4 w-4',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  'aria-hidden': true,
} as const

const MailIcon = () => (
  <svg {...iconProps}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const LockIcon = () => (
  <svg {...iconProps}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Bienvenido de nuevo</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      {/* Campos */}
      <div className="flex flex-col gap-4">
        <FormField
          label="Correo electrónico"
          type="email"
          required
          icon={<MailIcon />}
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
          icon={<LockIcon />}
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
