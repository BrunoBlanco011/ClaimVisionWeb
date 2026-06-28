export type LogoSize = 'sm' | 'md' | 'lg'
export type LogoVariant = 'full' | 'icon'

export interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
  className?: string
}

const iconSizes: Record<LogoSize, { icon: number; text: string }> = {
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 36, text: 'text-2xl' },
  lg: { icon: 48, text: 'text-3xl' },
}

export function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const { icon, text } = iconSizes[size]

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Ícono de escudo con silueta de auto */}
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
          fill="#1E3A8A"
        />
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

      {variant === 'full' && (
        <span className={`font-bold tracking-tight text-primary-800 ${text}`}>
          Claim<span className="text-primary-500">Vision</span>
        </span>
      )}
    </div>
  )
}
