import { forwardRef, createContext, useContext, useState, useCallback, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Checkbox variant configurations based on modern 2025 patterns
interface CheckboxVariants {
  size: "sm" | "md" | "lg";
  variant: "default" | "outline" | "soft";
  state: "default" | "error" | "success" | "warning";
}

// Checkbox props interface
interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "size" | "type"> {
  size?: CheckboxVariants["size"];
  variant?: CheckboxVariants["variant"];
  state?: CheckboxVariants["state"];
  label?: ReactNode;
  description?: string;
  errorMessage?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// Checkbox group props
interface CheckboxGroupProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  children: ReactNode;
}

// Checkbox group item props
interface CheckboxGroupItemProps extends Omit<CheckboxProps, "onCheckedChange"> {
  value: string;
}

// Checkbox group context value
interface CheckboxGroupContextValue {
  value: string[];
  onValueChange: (value: string) => void;
  disabled: boolean;
  size: CheckboxVariants["size"];
  variant: CheckboxVariants["variant"];
  state: CheckboxVariants["state"];
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

// Hook to access checkbox group context
export const useCheckboxGroupContext = () => {
  const context = useContext(CheckboxGroupContext);
  return context; // Can be null for standalone checkboxes
};

// Semantic class configurations using design tokens
const checkboxVariants = {
  container: {
    base: "relative flex items-start gap-2",
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col"
    }
  },

  wrapper: {
    base: "relative flex items-center justify-center shrink-0 border rounded transition-all duration-150 ease-out",

    sizes: {
      sm: "h-4 w-4 text-xs",
      md: "h-5 w-5 text-sm",
      lg: "h-6 w-6 text-base"
    },

    variants: {
      default: {
        default: "border-border bg-bg hover:border-border-hover focus:border-ring focus:ring-2 focus:ring-ring/20",
        error: "border-error bg-bg hover:border-error focus:border-error focus:ring-2 focus:ring-error/20",
        success: "border-success bg-bg hover:border-success focus:border-success focus:ring-2 focus:ring-success/20",
        warning: "border-warning bg-bg hover:border-warning focus:border-warning focus:ring-2 focus:ring-warning/20"
      },
      outline: {
        default: "border-2 border-border bg-transparent hover:border-border-hover focus:border-ring focus:ring-2 focus:ring-ring/20",
        error: "border-2 border-error bg-transparent hover:border-error focus:border-error focus:ring-2 focus:ring-error/20",
        success: "border-2 border-success bg-transparent hover:border-success focus:border-success focus:ring-2 focus:ring-success/20",
        warning: "border-2 border-warning bg-transparent hover:border-warning focus:border-warning focus:ring-2 focus:ring-warning/20"
      },
      soft: {
        default: "border-border bg-muted hover:bg-muted-hover focus:border-ring focus:ring-2 focus:ring-ring/20",
        error: "border-error bg-error/10 hover:bg-error/20 focus:border-error focus:ring-2 focus:ring-error/20",
        success: "border-success bg-success/10 hover:bg-success/20 focus:border-success focus:ring-2 focus:ring-success/20",
        warning: "border-warning bg-warning/10 hover:bg-warning/20 focus:border-warning focus:ring-2 focus:ring-warning/20"
      }
    },

    checked: {
      default: {
        default: "border-primary bg-primary text-primary-foreground",
        error: "border-error bg-error text-error-foreground",
        success: "border-success bg-success text-success-foreground",
        warning: "border-warning bg-warning text-warning-foreground"
      },
      outline: {
        default: "border-primary bg-primary text-primary-foreground",
        error: "border-error bg-error text-error-foreground",
        success: "border-success bg-success text-success-foreground",
        warning: "border-warning bg-warning text-warning-foreground"
      },
      soft: {
        default: "border-primary bg-primary text-primary-foreground",
        error: "border-error bg-error text-error-foreground",
        success: "border-success bg-success text-success-foreground",
        warning: "border-warning bg-warning text-warning-foreground"
      }
    },

    disabled: "opacity-50 cursor-not-allowed pointer-events-none"
  },

  input: "sr-only",

  icon: {
    base: "absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-150",
    hidden: "opacity-0 scale-50",
    visible: "opacity-100 scale-100"
  },

  label: {
    base: "text-sm font-medium select-none cursor-pointer",
    states: {
      default: "text-fg",
      error: "text-error",
      success: "text-success",
      warning: "text-warning"
    },
    disabled: "opacity-50 cursor-not-allowed"
  },

  description: "mt-1 text-xs text-on-muted",
  error: "mt-1 text-xs text-error",

  group: {
    base: "space-y-3",
    orientation: {
      horizontal: "flex flex-wrap gap-4",
      vertical: "space-y-3"
    },
    label: "block text-sm font-medium mb-2 text-fg",
    description: "text-xs text-on-muted mb-3",
    error: "text-xs text-error mt-2"
  }
};

// Check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Indeterminate icon component
const IndeterminateIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="6" y="11" width="12" height="2" rx="1" />
  </svg>
);

// Main Checkbox component
const CheckboxRoot = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "md",
      variant = "default",
      state = "default",
      label,
      description,
      errorMessage,
      indeterminate = false,
      disabled = false,
      required = false,
      checked: controlledChecked,
      defaultChecked,
      onCheckedChange,
      onChange,
      className = "",
      id: providedId,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    // Generate unique ID for accessibility
    const generatedId = useId();
    const id = providedId || generatedId;

    // Check if we're in a group context
    const groupContext = useCheckboxGroupContext();

    // Handle change events
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;

      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      onCheckedChange?.(newChecked);
      onChange?.(event);

      // Handle group context if present
      if (groupContext && props.value) {
        groupContext.onValueChange(props.value);
      }
    }, [isControlled, onCheckedChange, onChange, groupContext, props.value]);

    // Determine final state (error message takes precedence)
    const finalState = errorMessage ? "error" : state;

    // Use group context values if available
    const finalSize = groupContext?.size || size;
    const finalVariant = groupContext?.variant || variant;
    const finalState2 = groupContext?.state || finalState;
    const finalDisabled = groupContext?.disabled || disabled;

    // Determine if checkbox is checked in group context
    const isCheckedInGroup = groupContext && props.value ?
      groupContext.value.includes(props.value) : checked;

    const finalChecked = groupContext ? isCheckedInGroup : checked;

    // Build wrapper classes
    const wrapperClasses = [
      checkboxVariants.wrapper.base,
      checkboxVariants.wrapper.sizes[finalSize],
      finalChecked
        ? checkboxVariants.wrapper.checked[finalVariant][finalState2]
        : checkboxVariants.wrapper.variants[finalVariant][finalState2],
      finalDisabled && checkboxVariants.wrapper.disabled,
      className
    ].filter(Boolean).join(" ");

    // Build label classes
    const labelClasses = [
      checkboxVariants.label.base,
      checkboxVariants.label.states[finalState2],
      finalDisabled && checkboxVariants.label.disabled
    ].filter(Boolean).join(" ");

    return (
      <div className={checkboxVariants.container.base}>
        <div className="relative flex items-center">
          <div className={wrapperClasses}>
            <input
              ref={ref}
              id={id}
              type="checkbox"
              checked={finalChecked}
              onChange={handleChange}
              disabled={finalDisabled}
              required={required}
              aria-invalid={finalState2 === "error"}
              aria-describedby={
                description || errorMessage
                  ? `${id}-description ${id}-error`
                  : undefined
              }
              className={checkboxVariants.input}
              {...props}
            />

            {/* Check/Indeterminate Icon */}
            <div
              className={[
                checkboxVariants.icon.base,
                (finalChecked || indeterminate)
                  ? checkboxVariants.icon.visible
                  : checkboxVariants.icon.hidden
              ].join(" ")}
            >
              {indeterminate ? (
                <IndeterminateIcon className="h-3 w-3" />
              ) : (
                <CheckIcon className="h-3 w-3" />
              )}
            </div>
          </div>
        </div>

        {/* Label and Description */}
        {(label || description || errorMessage) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label htmlFor={id} className={labelClasses}>
                {label}
                {required && <span className="text-error ml-1">*</span>}
              </label>
            )}

            {description && !errorMessage && (
              <p id={`${id}-description`} className={checkboxVariants.description}>
                {description}
              </p>
            )}

            {errorMessage && (
              <p id={`${id}-error`} className={checkboxVariants.error} aria-live="polite">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

CheckboxRoot.displayName = "Checkbox";

// Checkbox Group component
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      orientation = "vertical",
      disabled = false,
      required = false,
      label,
      description,
      errorMessage,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Handle value changes
    const handleValueChange = useCallback((itemValue: string) => {
      const newValue = value.includes(itemValue)
        ? value.filter(v => v !== itemValue)
        : [...value, itemValue];

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onValueChange?.(newValue);
    }, [value, isControlled, onValueChange]);

    // Generate unique ID
    const groupId = useId();

    const contextValue: CheckboxGroupContextValue = {
      value,
      onValueChange: handleValueChange,
      disabled,
      size: "md", // Default for group
      variant: "default", // Default for group
      state: errorMessage ? "error" : "default"
    };

    // Build group classes
    const groupClasses = [
      checkboxVariants.group.base,
      orientation === "horizontal" && checkboxVariants.group.orientation.horizontal,
      orientation === "vertical" && checkboxVariants.group.orientation.vertical,
      className
    ].filter(Boolean).join(" ");

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          aria-labelledby={label ? `${groupId}-label` : undefined}
          aria-describedby={
            description || errorMessage
              ? `${groupId}-description ${groupId}-error`
              : undefined
          }
          aria-invalid={!!errorMessage}
          aria-required={required}
          {...props}
        >
          {/* Group Label */}
          {label && (
            <div
              id={`${groupId}-label`}
              className={checkboxVariants.group.label}
            >
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </div>
          )}

          {/* Group Description */}
          {description && !errorMessage && (
            <p id={`${groupId}-description`} className={checkboxVariants.group.description}>
              {description}
            </p>
          )}

          {/* Checkbox Items */}
          <div className={groupClasses}>
            {children}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p id={`${groupId}-error`} className={checkboxVariants.group.error} aria-live="polite">
              {errorMessage}
            </p>
          )}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

// Checkbox Group Item component
export const CheckboxGroupItem = forwardRef<HTMLInputElement, CheckboxGroupItemProps>(
  (props, ref) => {
    return <CheckboxRoot ref={ref} {...props} />;
  }
);

CheckboxGroupItem.displayName = "CheckboxGroupItem";

// Compound component interface
interface CheckboxComponent extends React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>> {
  Group: typeof CheckboxGroup;
  GroupItem: typeof CheckboxGroupItem;
}

// Compound component pattern - attach sub-components to main Checkbox
const CheckboxWithSubComponents = CheckboxRoot as CheckboxComponent;
CheckboxWithSubComponents.Group = CheckboxGroup;
CheckboxWithSubComponents.GroupItem = CheckboxGroupItem;

export { CheckboxWithSubComponents as Checkbox };

// Export types for external use
export type {
  CheckboxProps,
  CheckboxGroupProps,
  CheckboxGroupItemProps,
  CheckboxVariants
};