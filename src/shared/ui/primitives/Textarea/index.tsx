"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2",
          "text-base md:text-sm placeholder:text-muted-foreground",
          "shadow-sm transition-[color,box-shadow] outline-none",
          "focus-visible:ring-1 focus-visible:ring-[var(--primary)]/30 focus-visible:ring-offset-0",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }