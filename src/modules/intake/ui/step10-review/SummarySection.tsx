'use client'

import { ChevronDown, ChevronUp, PenLine } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/ui/primitives/Button'
import { Card, CardBody } from '@/shared/ui/primitives/Card'

interface SummarySectionProps {
  id: string
  icon: React.ReactNode
  title: string
  stepNumber: number
  description?: string
  children: React.ReactNode
  onEdit?: (stepKey: string) => void
  defaultExpanded?: boolean
}

/**
 * Collapsible summary section component with edit action
 * Matches the standard wizard section pattern
 */
export function SummarySection({
  id,
  icon,
  title,
  stepNumber,
  description,
  children,
  onEdit,
  defaultExpanded = true
}: SummarySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id)
    }
  }

  return (
    <Card className="w-full rounded-3xl shadow-md">
      {/* Collapsible Header - matches wizard pattern */}
      <div
        id={`${id}-header`}
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
      >
        <div className="flex items-center gap-2">
          <div className="text-[var(--primary)]">{icon}</div>
          <h3 className="text-lg font-medium text-[var(--foreground)]">
            Step {stepNumber}: {title}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <CardBody id={`${id}-content`} className="p-6 space-y-4">
          {description && (
            <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
          )}

          {onEdit && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                aria-label={`Edit ${title}`}
                className="hover:bg-[var(--muted)]/50"
              >
                <PenLine className="h-5 w-5" />
              </Button>
            </div>
          )}

          {children}
        </CardBody>
      )}
    </Card>
  )
}