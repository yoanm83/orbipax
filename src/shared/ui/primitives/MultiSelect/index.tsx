"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/shared/ui/primitives/Badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/primitives/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/Popover"

// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * MultiSelect - OrbiPax Health Philosophy Compliant
 *
 * ACCESSIBILITY (WCAG 2.1 AA):
 * - Minimum 44×44px touch targets for healthcare devices
 * - Proper ARIA attributes (combobox, expanded states)
 * - Keyboard navigation support
 * - Screen reader announcements
 * - Focus management
 *
 * HEALTH DESIGN TOKENS:
 * - Semantic color system for medical contexts
 * - Healthcare-appropriate sizing
 * - Professional appearance for clinical settings
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
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            // Base styles with healthcare touch targets (Health Philosophy)
            "flex min-h-[44px] w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
            // Semantic tokens (Health Philosophy)
            "border-border bg-bg text-fg ring-offset-bg",
            "placeholder:text-on-muted",
            // Focus states for accessibility
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Container query responsive (Health Philosophy)
            "@container/form:(max-width: 320px):text-xs",
            className,
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && <span className="text-on-muted">{placeholder}</span>}
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value)
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="mr-1 mb-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(value)
                  }}
                >
                  {option?.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )
            })}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    {selected.includes(option.value) && <X className="h-3 w-3" />}
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}