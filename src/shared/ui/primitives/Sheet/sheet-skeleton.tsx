"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/shared/ui/primitives/Skeleton'

export interface SheetSkeletonProps {
  sections?: number
  className?: string
  showHeader?: boolean
  showFooter?: boolean
}

const SheetSkeletonComponent = ({
  sections = 3,
  className,
  showHeader = true,
  showFooter = true
}: SheetSkeletonProps) => {
  // Memoize sections array to avoid recreation on each render
  const sectionIndices = React.useMemo(
    () => Array.from({ length: sections }, (_, i) => i),
    [sections]
  )

  return (
    <div 
      className={cn("space-y-6 animate-pulse", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading sheet content...</span>
      
      {/* Header Skeleton */}
      {showHeader && (
        <div className="bg-muted border-b border-border px-6 py-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" aria-label="Loading title" />
            <Skeleton className="h-4 w-64" aria-label="Loading description" />
          </div>
        </div>
      )}

      {/* Content Sections Skeleton */}
      <div className="px-6 space-y-6">
        {sectionIndices.map((index) => (
          <div key={index} className="space-y-4">
            {/* Section Title */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" aria-label="Loading icon" />
              <Skeleton className="h-5 w-32" aria-label="Loading section title" />
            </div>
            
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" aria-label="Loading label" />
                <Skeleton className="h-10 w-full" aria-label="Loading input field" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" aria-label="Loading label" />
                <Skeleton className="h-10 w-full" aria-label="Loading input field" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" aria-label="Loading label" />
                <Skeleton className="h-10 w-full" aria-label="Loading input field" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" aria-label="Loading label" />
                <Skeleton className="h-10 w-full" aria-label="Loading input field" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      {showFooter && (
        <div className="bg-muted border-t border-border px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="h-10 w-24" aria-label="Loading cancel button" />
            <Skeleton className="h-10 w-32" aria-label="Loading submit button" />
          </div>
        </div>
      )}
    </div>
  )
}

SheetSkeletonComponent.displayName = 'SheetSkeleton'

export const SheetSkeleton = React.memo(SheetSkeletonComponent)