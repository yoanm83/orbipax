"use client"

import * as React from "react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"
import { Input } from "@/shared/ui/primitives/Input"
import { PopoverTrigger } from "@/shared/ui/primitives/Popover"

interface DatePickerTriggerInputProps {
  date?: Date | undefined
  placeholder?: string
  disabled?: boolean
  required?: boolean
  isOpen?: boolean
  onClear?: () => void
  id?: string
  className?: string
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-required"?: boolean
  "aria-invalid"?: boolean
}

/**
 * DatePicker trigger that renders as a primitive Input component
 * Maintains the same look and behavior as other Input fields in forms
 */
export const DatePickerTriggerInput = React.forwardRef<
  HTMLDivElement,
  DatePickerTriggerInputProps
>(({
  date,
  placeholder = "Select date",
  disabled = false,
  required = false,
  isOpen = false,
  onClear,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-required": ariaRequired,
  "aria-invalid": ariaInvalid,
}, ref) => {
  // Format the date value for display
  const displayValue = date ? format(date, "PPP", { locale: enUS }) : ""

  return (
    <PopoverTrigger asChild>
      <div ref={ref} className="relative w-full">
        <Input
          id={id}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={className}
          // Accessibility props
          aria-label={ariaLabel || "Select date"}
          aria-describedby={ariaDescribedBy}
          aria-required={ariaRequired ?? required}
          aria-invalid={ariaInvalid}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          role="combobox"
          // Left icon - Calendar
          leftIcon={<CalendarIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
          // Right icon - Clear button (if date selected and not disabled)
          rightIcon={
            date && !disabled && onClear ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                className="h-4 w-4 hover:bg-accent rounded-sm inline-flex items-center justify-center transition-colors"
                aria-label="Clear date"
                tabIndex={-1}
              >
                <X className="h-3 w-3" />
              </button>
            ) : undefined
          }
          // Trigger popover on click (handled by PopoverTrigger wrapper)
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        />
      </div>
    </PopoverTrigger>
  )
})

DatePickerTriggerInput.displayName = "DatePickerTriggerInput"