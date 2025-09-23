"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================================================
// TYPES
// ============================================================================

export interface ComboboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean
  active?: boolean
  disabled?: boolean
  onSelect?: () => void
  children: React.ReactNode
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  (
    {
      selected = false,
      active = false,
      disabled = false,
      onSelect,
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return

        onClick?.(e)
        onSelect?.()
      },
      [disabled, onClick, onSelect]
    )

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled}
        tabIndex={-1}
        onClick={handleClick}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
          "transition-colors",
          active && "bg-accent text-accent-foreground",
          selected && "bg-accent text-accent-foreground",
          disabled && "pointer-events-none opacity-50",
          !disabled && "hover:bg-accent hover:text-accent-foreground cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Selection Indicator */}
        <Check
          className={cn(
            "mr-2 h-4 w-4 transition-opacity",
            selected ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="flex-1 truncate">
          {children}
        </div>
      </div>
    )
  }
)

ComboboxItem.displayName = "ComboboxItem"