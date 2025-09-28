'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

/**
 * Headless Separator component
 * Implements ARIA separator pattern without external dependencies
 * Uses semantic tokens for consistent theming
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        {...(decorative ? { 'aria-hidden': 'true' } : {})}
        className={cn(
          'shrink-0 bg-[var(--border)]',
          orientation === 'horizontal'
            ? 'h-px w-full'
            : 'w-px h-full',
          className
        )}
        {...props}
      />
    )
  }
)

Separator.displayName = 'Separator'

export { Separator }
export type { SeparatorProps }