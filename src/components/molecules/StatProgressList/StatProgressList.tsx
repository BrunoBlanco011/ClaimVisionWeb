export interface StatProgressItem {
  label: string
  count: number
  color: string
}

export interface StatProgressListProps {
  items: StatProgressItem[]
  className?: string
}

export function StatProgressList({ items, className = '' }: StatProgressListProps) {
  const total = items.reduce((acc, item) => acc + item.count, 0) || 1

  return (
    <div className={['space-y-4', className].join(' ')}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-neutral-700">{item.label}</span>
            <span className="text-sm font-semibold text-neutral-900">{item.count}</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(item.count / total) * 100}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
