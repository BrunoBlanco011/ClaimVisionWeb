import type { ReactNode } from 'react'

export interface AuthSplitLayoutProps {
  brandPanel: ReactNode
  children: ReactNode
}

export function AuthSplitLayout({ brandPanel, children }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-[620px] shrink-0 bg-[#000616] p-8 sm:p-12 lg:p-16 flex flex-col">
        {brandPanel}
      </aside>

      <main className="flex-1 bg-[#F7FAFD] flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-lg p-8 sm:p-9">
          {children}
        </div>
      </main>
    </div>
  )
}
