import { Logo } from '../../atoms/Logo'

export interface BrandPanelProps {
  title: string
  description: string
  footer: string
}

export function BrandPanel({ title, description, footer }: BrandPanelProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-8">
        <Logo size="lg" variant="full" className="[&_span]:text-white [&_span>span]:text-primary-300" />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-white leading-tight whitespace-pre-line">
            {title}
          </h1>
          <p className="text-base text-primary-200 leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      <p className="text-sm text-primary-400/60">
        {footer}
      </p>
    </div>
  )
}
