"use client"

import * as React from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================================================
// TYPES
// ============================================================================

export interface ComboboxButtonsProps {
  onClear?: () => void
  onToggle?: () => void
  isOpen?: boolean
  disabled?: boolean
  showClear?: boolean
  showToggle?: boolean
  className?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ComboboxButtons = React.forwardRef<HTMLDivElement, ComboboxButtonsProps>(
  (
    {
      onClear,
      onToggle,
      isOpen = false,
      disabled = false,
      showClear = true,
      showToggle = true,
      className
    },
    ref
  ) => {
    if (!showClear && !showToggle) return null

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 px-2",
          className
        )}
      >
        {/* Clear Button */}
        {showClear && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClear()
            }}
            disabled={disabled}
            className={cn(
              "inline-flex h-4 w-4 items-center justify-center rounded-sm",
              "text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus:outline-none focus:ring-1 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            aria-label="Clear selection"
            tabIndex={-1}
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Toggle Button */}
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggle()
            }}
            disabled={disabled}
            className={cn(
              "inline-flex h-4 w-4 items-center justify-center rounded-sm",
              "text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus:outline-none focus:ring-1 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            aria-label={isOpen ? "Close options" : "Open options"}
            tabIndex={-1}
          >
            {isOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
    )
  }
)

ComboboxButtons.displayName = "ComboboxButtons"