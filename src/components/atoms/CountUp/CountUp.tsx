import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

export interface CountUpProps {
  value: number
  duration?: number
  className?: string
}

// Inspirado en el componente "Count Up" de React Bits (reactbits.dev), adaptado
// a un valor controlado (re-anima cada vez que `value` cambia, no solo al entrar en viewport).
export function CountUp({ value, duration = 0.7, className = '' }: CountUpProps) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  })
  const display = useTransform(springValue, (v) => Math.round(v).toLocaleString('es-MX'))

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  return <motion.span className={className}>{display}</motion.span>
}
