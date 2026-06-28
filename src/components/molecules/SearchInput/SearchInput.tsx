import { useId, type InputHTMLAttributes } from 'react'

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  placeholder?: string
}

export function SearchInput({ placeholder = 'Buscar…', className = '', ...props }: SearchInputProps) {
  const id = useId()

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        className={[
          'w-full rounded-md border border-neutral-300 bg-white py-2 pl-10 pr-3 text-sm',
          'text-neutral-900 placeholder-neutral-400',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600',
          'disabled:bg-neutral-100 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  )
}
