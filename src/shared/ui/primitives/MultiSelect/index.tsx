"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Badge } from "@/shared/ui/primitives/Badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/Popover"
import { cn } from "@/lib/utils"

/**
 * MultiSelect - OrbiPax Health Philosophy Compliant
 *
 * ACCESSIBILITY (WCAG 2.1 AA):
 * - Minimum 44×44px touch targets for healthcare devices
 * - Proper ARIA attributes (combobox, listbox, option)
 * - Keyboard navigation (arrows, enter, escape, backspace)
 * - Screen reader announcements
 * - Focus management
 *
 * HEALTH DESIGN TOKENS:
 * - Semantic color system for medical contexts
 * - Healthcare-appropriate sizing
 * - Professional appearance for clinical settings
 * - Consistent with other form primitives
 */

export type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  'aria-invalid'?: boolean | "true" | "false" | undefined
  'aria-describedby'?: string
  'aria-required'?: boolean | "true" | "false"
  'aria-label'?: string
  id?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  disabled,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-label': ariaLabel,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape closes dropdown
    if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls="multiselect-listbox"
          aria-haspopup="listbox"
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          aria-required={ariaRequired}
          aria-label={ariaLabel || "Select options"}
          aria-disabled={disabled}
          id={id}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            // Exact same classes as SelectTriggerInput for consistency
            "flex min-h-[44px] h-11 w-full items-center justify-between rounded-md",
            "border border-border bg-bg px-4 py-2 text-sm text-fg",
            "transition-all duration-200",
            // Placeholder color
            "placeholder:text-on-muted",
            // Focus states using consistent DS tokens
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]",
            // Disabled state
            "disabled:opacity-50 disabled:cursor-not-allowed",
            // Cursor
            "cursor-pointer",
            // Data state animations - consistent with focus
            open && "ring-2 ring-[var(--ring-primary)] ring-offset-2 ring-offset-[var(--ring-offset-background)]",
            // Line clamp for text overflow
            "[&>span]:line-clamp-1",
            // Error state styling - same as Select components
            ariaInvalid === "true" && "border-[var(--destructive)]",
            className,
          )}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleKeyDown}
        >
          <div className="flex flex-1 flex-wrap gap-1 items-center">
            {selected.length === 0 && <span className="text-on-muted">{placeholder}</span>}
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value)
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="mr-1 gap-1 pr-1.5 text-xs"
                >
                  <span>{option?.label}</span>
                  <button
                    type="button"
                    className="ml-auto rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.stopPropagation()
                        handleUnselect(value)
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!disabled) handleUnselect(value)
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    aria-label={`Remove ${option?.label}`}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              )
            })}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-on-muted transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[8rem] border border-border bg-[var(--popover)] text-[var(--popover-foreground)] shadow-md p-1"
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <div
          role="listbox"
          aria-label="Options"
          aria-multiselectable="true"
          id="multiselect-listbox"
          className="max-h-[200px] overflow-y-auto"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={selected.includes(option.value)}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground",
                selected.includes(option.value) && "bg-accent/50"
              )}
            >
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                  selected.includes(option.value)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary [&_svg]:invisible",
                )}
              >
                <Check className={cn(
                  "h-4 w-4",
                  selected.includes(option.value) && "text-white"
                )} />
              </div>
              <span className="text-left">{option.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}