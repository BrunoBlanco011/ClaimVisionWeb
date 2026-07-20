export type LogoSize = 'sm' | 'md' | 'lg'
export type LogoVariant = 'full' | 'icon'
export type LogoTone = 'default' | 'light'

export interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
  tone?: LogoTone
  className?: string
}

const iconSizes: Record<LogoSize, { icon: number; text: string }> = {
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 36, text: 'text-2xl' },
  lg: { icon: 48, text: 'text-3xl' },
}

export function Logo({ size = 'md', variant = 'full', tone = 'default', className = '' }: LogoProps) {
  const { icon, text } = iconSizes[size]
  const isLight = tone === 'light'

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Ícono de escudo con silueta de auto */}
      <span
        className={
          isLight
            ? 'inline-flex shrink-0 items-center justify-center rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15'
            : 'inline-flex shrink-0 items-center justify-center'
        }
      >
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M24 4L8 10V26C8 35.3 15.3 44 24 46C32.7 44 40 35.3 40 26V10L24 4Z"
            fill="url(#shield-gradient)"
          />
          {/* Silueta de auto simplificada */}
          <path
            d="M15 28H33M16 28L18 22H30L32 28M19 22L20 19H28L29 22"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="19" cy="29.5" r="1.5" fill="white" />
          <circle cx="29" cy="29.5" r="1.5" fill="white" />
          <defs>
            <linearGradient id="shield-gradient" x1="24" y1="4" x2="24" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      {variant === 'full' && (
        <span className={`font-bold tracking-tight ${text} ${isLight ? 'text-white' : 'text-primary-800'}`}>
          Claim<span className={isLight ? 'text-primary-300' : 'text-primary-500'}>Vision</span>
        </span>
      )}
    </div>
  )
}
