import logoImage from '../../../assets/logo.jpeg'

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
      <span
        className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%]"
        style={{ width: icon, height: icon }}
      >
        <img src={logoImage} alt="ClaimVision" width={icon} height={icon} className="h-full w-full object-cover" />
      </span>

      {variant === 'full' && (
        <span className={`font-bold tracking-tight ${text} ${isLight ? 'text-white' : 'text-primary-800'}`}>
          Claim<span className={isLight ? 'text-primary-300' : 'text-primary-500'}>Vision</span>
        </span>
      )}
    </div>
  )
}
