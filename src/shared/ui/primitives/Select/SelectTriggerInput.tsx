"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectTriggerInputProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  placeholder?: string
}

export const SelectTriggerInput = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerInputProps
>(({ className, children, placeholder, disabled, ...props }, ref) => {
  // Find placeholder from SelectValue child if present
  let valuePlaceholder = placeholder
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type === SelectPrimitive.Value) {
      valuePlaceholder = (child.props as any).placeholder || placeholder
    }
  })

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      disabled={disabled}
      aria-haspopup="listbox"
      role="combobox"
      className={cn(
        // Use Input-like DS tokens directly
        "flex min-h-[44px] h-11 w-full items-center justify-between rounded-md",
        "border border-border bg-bg px-4 py-2 text-sm text-fg",
        "transition-all duration-200",
        "placeholder:text-on-muted",
        // Focus states using DS tokens
        "focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20",
        // Disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Cursor
        "cursor-pointer",
        // Data state animations
        "data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring/20",
        // Line clamp for text overflow
        "[&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 text-on-muted transition-transform data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})

SelectTriggerInput.displayName = "SelectTriggerInput"