"use client"

import * as React from "react"
import { Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/primitives/Button"

export interface TimePickerTriggerProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
  placeholder?: string
  onClear?: () => void
}

const TimePickerTrigger = React.forwardRef<HTMLButtonElement, TimePickerTriggerProps>(
  ({ value, placeholder, className, disabled, onClear, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          className
        )}
        disabled={disabled}
        role="combobox"
        {...props}
      >
        <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
        <span className="flex-1">{value || placeholder}</span>
        {value && !disabled && onClear && (
          <span
            className="ml-2 h-4 w-4 hover:bg-muted rounded-sm inline-flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            aria-label="Clear time"
            role="button"
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </Button>
    )
  }
)

TimePickerTrigger.displayName = "TimePickerTrigger"

export { TimePickerTrigger }