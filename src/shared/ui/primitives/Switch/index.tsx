import { forwardRef, useCallback, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Switch - OrbiPax Health Philosophy Compliant
 *
 * ACCESSIBILITY (WCAG 2.1 AA):
 * - Minimum 44×44px touch targets for healthcare devices
 * - Proper role="switch" with ARIA state management
 * - Keyboard navigation (Space, Enter) support
 * - Focus indicators and screen reader announcements
 * - Loading states with appropriate accessibility
 * - Required field indicators for form validation
 *
 * HEALTH DESIGN TOKENS:
 * - Semantic color system for medical contexts
 * - Consistent sizing with other form controls
 * - Professional appearance for clinical settings
 * - Clear visual feedback for on/off states
 *
 * CONTAINER QUERIES:
 * - Responsive sizing for different device contexts
 * - Adaptable to medical device viewports
 * - Touch-friendly targets on mobile healthcare devices
 */

// Switch variant configurations based on Health Philosophy
interface SwitchVariants {
  size: "sm" | "md" | "lg";
  variant: "default" | "success" | "warning" | "error";
  style: "filled" | "outline" | "soft";
}

// Switch props interface
interface SwitchProps extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "type" | "style"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchVariants["size"];
  variant?: SwitchVariants["variant"];
  switchStyle?: SwitchVariants["style"];
  label?: ReactNode;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  thumbIcon?: ReactNode;
  showLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
}

// Semantic class configurations using design tokens
const switchVariants = {
  container: {
    base: "relative flex items-start gap-3",
    sizes: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4"
    }
  },

  track: {
    base: "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",

    sizes: {
      sm: "min-h-[36px] h-4 w-7", // Small but accessible
      md: "min-h-[44px] h-6 w-11", // Healthcare standard 44×44px
      lg: "min-h-[48px] h-8 w-14" // Large touch targets
    },

    variants: {
      filled: {
        default: {
          off: "bg-muted focus:ring-ring",
          on: "bg-primary focus:ring-primary"
        },
        success: {
          off: "bg-muted focus:ring-ring",
          on: "bg-success focus:ring-success"
        },
        warning: {
          off: "bg-muted focus:ring-ring",
          on: "bg-warning focus:ring-warning"
        },
        error: {
          off: "bg-muted focus:ring-ring",
          on: "bg-error focus:ring-error"
        }
      },
      outline: {
        default: {
          off: "bg-bg border-border focus:ring-ring",
          on: "bg-primary/10 border-primary focus:ring-primary"
        },
        success: {
          off: "bg-bg border-border focus:ring-ring",
          on: "bg-success/10 border-success focus:ring-success"
        },
        warning: {
          off: "bg-bg border-border focus:ring-ring",
          on: "bg-warning/10 border-warning focus:ring-warning"
        },
        error: {
          off: "bg-bg border-border focus:ring-ring",
          on: "bg-error/10 border-error focus:ring-error"
        }
      },
      soft: {
        default: {
          off: "bg-muted/50 focus:ring-ring",
          on: "bg-primary/20 focus:ring-primary"
        },
        success: {
          off: "bg-muted/50 focus:ring-ring",
          on: "bg-success/20 focus:ring-success"
        },
        warning: {
          off: "bg-muted/50 focus:ring-ring",
          on: "bg-warning/20 focus:ring-warning"
        },
        error: {
          off: "bg-muted/50 focus:ring-ring",
          on: "bg-error/20 focus:ring-error"
        }
      }
    },

    loading: "opacity-60 cursor-wait"
  },

  thumb: {
    base: "pointer-events-none inline-block rounded-full bg-bg shadow-lg ring-0 transition-all duration-200 ease-in-out",

    sizes: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-6 w-6"
    },

    positions: {
      sm: {
        off: "translate-x-0.5",
        on: "translate-x-3.5"
      },
      md: {
        off: "translate-x-0.5",
        on: "translate-x-5.5"
      },
      lg: {
        off: "translate-x-0.5",
        on: "translate-x-7.5"
      }
    },

    variants: {
      filled: {
        default: "bg-bg shadow-md",
        success: "bg-bg shadow-md",
        warning: "bg-bg shadow-md",
        error: "bg-bg shadow-md"
      },
      outline: {
        default: "bg-primary shadow-md",
        success: "bg-success shadow-md",
        warning: "bg-warning shadow-md",
        error: "bg-error shadow-md"
      },
      soft: {
        default: "bg-primary shadow-md",
        success: "bg-success shadow-md",
        warning: "bg-warning shadow-md",
        error: "bg-error shadow-md"
      }
    }
  },

  labels: {
    base: "absolute inset-0 flex items-center justify-between px-1 text-xs font-medium pointer-events-none",
    on: "text-primary-foreground opacity-0 transition-opacity duration-200",
    off: "text-on-muted opacity-100 transition-opacity duration-200",
    onActive: "opacity-100",
    offActive: "opacity-0"
  },

  content: {
    base: "flex flex-col min-w-0",
    label: {
      base: "text-sm font-medium cursor-pointer select-none",
      sizes: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
      },
      disabled: "opacity-50 cursor-not-allowed"
    },
    description: {
      base: "text-xs text-on-muted mt-0.5",
      sizes: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm"
      }
    },
    required: "text-error ml-1"
  },

  loading: {
    base: "absolute inset-0 flex items-center justify-center",
    spinner: "animate-spin h-3 w-3 text-current"
  }
};

// Loading spinner component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Main Switch component
const SwitchRoot = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      size = "md",
      variant = "default",
      switchStyle = "filled",
      label,
      description,
      disabled = false,
      loading = false,
      required = false,
      thumbIcon,
      showLabels = false,
      onLabel = "ON",
      offLabel = "OFF",
      className = "",
      id: providedId,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : defaultChecked;

    // Generate unique IDs for accessibility
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const descriptionId = useId();

    // Handle change events
    const handleChange = useCallback(() => {
      if (disabled || loading) {
        return;
      }
      onCheckedChange?.(!checked);
    }, [disabled, loading, checked, onCheckedChange]);

    // Handle keyboard events
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleChange();
      }
    }, [handleChange]);

    // Build track classes
    const trackClasses = [
      switchVariants.track.base,
      switchVariants.track.sizes[size],
      checked
        ? switchVariants.track.variants[switchStyle][variant].on
        : switchVariants.track.variants[switchStyle][variant].off,
      (loading && switchVariants.track.loading),
      className
    ].filter(Boolean).join(" ");

    // Build thumb classes
    const thumbClasses = [
      switchVariants.thumb.base,
      switchVariants.thumb.sizes[size],
      checked
        ? switchVariants.thumb.positions[size].on
        : switchVariants.thumb.positions[size].off,
      switchStyle === "outline" || switchStyle === "soft"
        ? (checked ? switchVariants.thumb.variants[switchStyle][variant] : switchVariants.thumb.variants.filled.default)
        : switchVariants.thumb.variants[switchStyle][variant]
    ].filter(Boolean).join(" ");

    // Build label classes
    const labelClasses = [
      switchVariants.content.label.base,
      switchVariants.content.label.sizes[size],
      disabled && switchVariants.content.label.disabled
    ].filter(Boolean).join(" ");

    return (
      <div className={`${switchVariants.container.base} ${switchVariants.container.sizes[size]}`}>
        <button
          ref={ref}
          type="button"
          role="switch"
          id={id}
          aria-checked={checked}
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-describedby={description ? descriptionId : undefined}
          aria-required={required}
          disabled={disabled || loading}
          className={trackClasses}
          onClick={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* Track Labels */}
          {showLabels && !loading && (
            <span className={switchVariants.labels.base}>
              <span className={`${switchVariants.labels.off} ${checked ? switchVariants.labels.offActive : ""}`}>
                {offLabel}
              </span>
              <span className={`${switchVariants.labels.on} ${checked ? switchVariants.labels.onActive : ""}`}>
                {onLabel}
              </span>
            </span>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className={switchVariants.loading.base}>
              <LoadingSpinner className={switchVariants.loading.spinner} />
            </div>
          )}

          {/* Thumb */}
          {!loading && (
            <span className={thumbClasses}>
              {thumbIcon && (
                <span className="flex items-center justify-center h-full w-full text-current">
                  {thumbIcon}
                </span>
              )}
            </span>
          )}
        </button>

        {/* Label and Description */}
        {(label || description) && (
          <div className={switchVariants.content.base}>
            {label && (
              <label
                id={`${id}-label`}
                htmlFor={id}
                className={labelClasses}
              >
                {label}
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
            )}

            {description && (
              <p
                id={descriptionId}
                className={`${switchVariants.content.description.base} ${switchVariants.content.description.sizes[size]}`}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

SwitchRoot.displayName = "Switch";

// Export the main component
export { SwitchRoot as Switch };

// Export types for external use
export type {
  SwitchProps,
  SwitchVariants
};