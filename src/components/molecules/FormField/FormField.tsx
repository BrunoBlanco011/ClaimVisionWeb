import { useState, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Label } from '../../atoms/Label'
import { Input } from '../../atoms/Input'
import { ErrorMessage } from '../../atoms/ErrorMessage'

export interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  type?: 'text' | 'email' | 'password'
  icon?: ReactNode
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'aria-describedby' | 'aria-invalid'>
}

export function FormField({
  label,
  required = false,
  error,
  type = 'text',
  icon,
  inputProps = {},
}: FormFieldProps) {
  const generatedId = useId()
  const errorId = `${generatedId}-error`

  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={generatedId} required={required}>
        {label}
      </Label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            {icon}
          </span>
        )}

        <Input
          id={generatedId}
          type={resolvedType}
          hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[icon ? 'pl-10' : '', isPassword ? 'pr-10' : ''].filter(Boolean).join(' ')}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      <ErrorMessage message={error} id={errorId} />
    </div>
  )
}
