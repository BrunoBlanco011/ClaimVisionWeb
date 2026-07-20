import type { ReactNode } from 'react'
import { Logo } from '../../atoms/Logo'

interface Feature {
  title: string
  description: string
  icon: ReactNode
}

const iconProps = {
  className: 'h-4 w-4',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  'aria-hidden': true,
} as const

const features: Feature[] = [
  {
    title: 'Trazabilidad completa',
    description: 'Sigue cada expediente desde el reporte hasta el cierre.',
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Coordinación centralizada',
    description: 'Aseguradoras, talleres y ajustadores en un mismo flujo.',
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 00-4-4h-1M9 20H4v-1a4 4 0 014-4h1m3-4a3 3 0 100-6 3 3 0 000 6zm-4 8v-1a4 4 0 014-4h0a4 4 0 014 4v1" />
      </svg>
    ),
  },
  {
    title: 'Datos protegidos',
    description: 'Control de acceso por rol y cumplimiento ARCO.',
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
]

export function AuthBrandPanel() {
  return (
    <div className="flex h-full flex-col">
      <Logo size="lg" tone="light" />

      <div className="flex flex-1 flex-col justify-center gap-10 py-12">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-white lg:text-4xl">
            Gestión de siniestros, sin fricción.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-primary-100/80">
            Coordina aseguradoras, talleres y ajustadores desde un solo lugar, con visibilidad
            completa de cada expediente en tiempo real.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {features.map((feature) => (
            <li key={feature.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-white/15">
                {feature.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="text-sm text-primary-100/70">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-primary-100/50">
        © {new Date().getFullYear()} ClaimVision. Todos los derechos reservados.
      </p>
    </div>
  )
}
