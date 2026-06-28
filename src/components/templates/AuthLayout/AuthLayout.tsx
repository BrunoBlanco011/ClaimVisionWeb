import type { ReactNode } from 'react'

export interface AuthLayoutProps {
  children: ReactNode
  backgroundVariant?: 'default' | 'gradient'
}

export function AuthLayout({ children, backgroundVariant = 'gradient' }: AuthLayoutProps) {
  const bgClass =
    backgroundVariant === 'gradient'
      ? 'bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500'
      : 'bg-neutral-100'

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${bgClass}`}>
      {/* Patrón decorativo de fondo */}
      {backgroundVariant === 'gradient' && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />
      )}

      {/* Tarjeta de contenido */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}
