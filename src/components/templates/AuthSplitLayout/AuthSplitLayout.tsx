import type { ReactNode } from 'react'

export interface AuthSplitLayoutProps {
  brandPanel: ReactNode
  children: ReactNode
}

export function AuthSplitLayout({ brandPanel, children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary-800 to-primary-900 p-8 sm:p-12 md:w-[46%] md:p-14 lg:w-[560px] lg:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" aria-hidden="true" />

        <div className="relative flex h-full flex-col animate-fade-in">{brandPanel}</div>
      </aside>

      <main className="flex flex-1 items-center justify-center bg-white p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] animate-fade-up">{children}</div>
      </main>
    </div>
  )
}
