import * as React from "react"
// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Label - OrbiPax Health Philosophy Compliant
 *
 * ACCESSIBILITY (WCAG 2.1 AA):
 * - Required association with form controls via htmlFor
 * - Semantic label element for screen readers
 * - High contrast text colors for visibility
 * - Proper disabled state handling
 *
 * HEALTH DESIGN TOKENS:
 * - Uses semantic color tokens (text-fg)
 * - Consistent typography scale
 * - Healthcare-appropriate spacing
 *
 * CONTAINER QUERIES:
 * - Responsive text sizing for medical devices
 * - Adaptable to different viewport contexts
 */

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Required indicator for form validation */
  required?: boolean
  /** Error state for accessibility feedback */
  error?: boolean
  /** Helper text context for screen readers */
  helperText?: string
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, error, helperText, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        // Base styles with semantic tokens
        "text-sm font-medium leading-none",
        // Semantic color tokens (Health Philosophy)
        "text-fg",
        // Error state
        error && "text-destructive",
        // Disabled state with proper contrast
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Focus-within for enhanced accessibility
        "focus-within:text-primary",
        // Container query responsive sizing
        "@container/form:(max-width: 320px):text-xs",
        "@container/form:(min-width: 768px):text-base",
        className
      )}
      aria-describedby={helperText ? `${props.id}-helper` : undefined}
      {...props}
    >
      {children}
      {required && (
        <span
          className="text-destructive ml-1 text-sm"
          aria-label="required field"
          role="img"
        >
          *
        </span>
      )}
    </label>
  )
)

Label.displayName = "Label"

export { Label }
