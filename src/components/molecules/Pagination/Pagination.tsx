export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
  const from = (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalItems)

  if (totalPages <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, currentPage - 1)
  const end = Math.min(totalPages, currentPage + 1)

  if (start > 1) pages.push(1)
  if (start > 2) pages.push(-1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (end < totalPages - 1) pages.push(-1)
  if (end < totalPages) pages.push(totalPages)

  return (
    <nav className="flex items-center justify-between gap-4 py-3" aria-label="Paginación">
      <p className="text-sm text-neutral-500">
        {from}–{to} de {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2.5 py-1.5 text-sm rounded-md text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {pages.map((p, i) =>
          p === -1 ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-neutral-400">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={p === currentPage}
              className={[
                'min-w-[2rem] px-2 py-1.5 text-sm rounded-md transition-colors',
                p === currentPage
                  ? 'bg-primary-800 text-white font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100',
              ].join(' ')}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1.5 text-sm rounded-md text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página siguiente"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
