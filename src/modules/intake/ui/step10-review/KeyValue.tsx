'use client'

interface KeyValueProps {
  label: string
  value: string | React.ReactNode
  className?: string
}

/**
 * Accessible key-value display component
 * Uses description list semantics for proper screen reader support
 */
export function KeyValue({ label, value, className = '' }: KeyValueProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <dt className="text-sm text-[var(--muted-foreground)]">{label}</dt>
      <dd className="font-medium text-[var(--foreground)]">{value || 'Not provided'}</dd>
    </div>
  )
}

interface KeyValueListProps {
  items: Array<{ label: string; value: string | React.ReactNode }>
  columns?: 1 | 2
  className?: string
}

/**
 * List of key-value pairs with responsive grid layout
 */
export function KeyValueList({ items, columns = 2, className = '' }: KeyValueListProps) {
  const gridClass = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'

  return (
    <dl className={`grid ${gridClass} gap-4 ${className}`}>
      {items.map((item, index) => (
        <KeyValue
          key={`${item.label}-${index}`}
          label={item.label}
          value={item.value}
        />
      ))}
    </dl>
  )
}