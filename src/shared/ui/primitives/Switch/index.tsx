"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Maintain visual size but add invisible padding for 44px touch target
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
      // Add padding for 44px minimum touch target
      "relative py-[10px] before:absolute before:inset-0 before:content-[''] before:min-h-[44px]",
      // Track styling with stronger border for better contrast
      "border-2 border-[color:var(--border)] transition-all duration-200",
      // Focus styling with tokens
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-50",
      // ON/OFF states with better contrast
      "data-[state=checked]:bg-[var(--primary)] data-[state=unchecked]:bg-[var(--muted)]",
      // Hover states for better feedback
      "hover:data-[state=checked]:brightness-95 hover:data-[state=unchecked]:brightness-98",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // Thumb styling with white background and enhanced shadow
        "pointer-events-none block h-4 w-4 rounded-full",
        "bg-white shadow-md ring-1 ring-black/10",
        // Smooth transition for position
        "transition-transform duration-200",
        "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0.5"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }