import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

// Input variant configurations based on modern 2025 patterns
interface InputVariants {
  variant: "outlined" | "filled" | "underlined";
  size: "sm" | "md" | "lg";
  state: "default" | "error" | "success" | "warning";
}

// Base input props interface
interface BaseInputProps {
  variant?: InputVariants["variant"];
  size?: InputVariants["size"];
  state?: InputVariants["state"];
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  leftAddon?: string | ReactElement;
  rightAddon?: string | ReactElement;
  isRequired?: boolean;
  isReadOnly?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

// Modern Input props interface extending HTML input/textarea attributes
type InputProps = BaseInputProps & (
  | (ComponentPropsWithoutRef<"input"> & { multiline?: false })
  | (ComponentPropsWithoutRef<"textarea"> & { multiline: true })
);

// Semantic class configurations using design tokens
const inputVariants = {
  base: "w-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-on-muted",

  variants: {
    outlined: {
      default: "border border-border bg-bg text-fg focus:border-ring focus:ring-2 focus:ring-ring/20",
      error: "border border-error bg-bg text-fg focus:border-error focus:ring-2 focus:ring-error/20",
      success: "border border-success bg-bg text-fg focus:border-success focus:ring-2 focus:ring-success/20",
      warning: "border border-warning bg-bg text-fg focus:border-warning focus:ring-2 focus:ring-warning/20"
    },
    filled: {
      default: "border-0 bg-muted text-fg focus:bg-bg focus:ring-2 focus:ring-ring",
      error: "border-0 bg-error/10 text-fg focus:bg-bg focus:ring-2 focus:ring-error",
      success: "border-0 bg-success/10 text-fg focus:bg-bg focus:ring-2 focus:ring-success",
      warning: "border-0 bg-warning/10 text-fg focus:bg-bg focus:ring-2 focus:ring-warning"
    },
    underlined: {
      default: "border-0 border-b-2 border-border bg-transparent px-0 text-fg focus:border-ring focus:ring-0",
      error: "border-0 border-b-2 border-error bg-transparent px-0 text-fg focus:border-error focus:ring-0",
      success: "border-0 border-b-2 border-success bg-transparent px-0 text-fg focus:border-success focus:ring-0",
      warning: "border-0 border-b-2 border-warning bg-transparent px-0 text-fg focus:border-warning focus:ring-0"
    }
  },

  sizes: {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-12 px-4 text-base rounded-lg"
  },

  underlinedSizes: {
    sm: "py-1 text-sm",
    md: "py-2 text-sm",
    lg: "py-3 text-base"
  }
};

// Label styling using semantic tokens
const labelVariants = {
  base: "block text-sm font-medium mb-1.5",
  states: {
    default: "text-fg",
    error: "text-error",
    success: "text-success",
    warning: "text-warning"
  }
};

// Helper text styling using semantic tokens
const helperTextVariants = {
  base: "mt-1.5 text-xs",
  states: {
    default: "text-on-muted",
    error: "text-error",
    success: "text-success",
    warning: "text-warning"
  }
};

// Modern Input component with forwardRef
export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      variant = "outlined",
      size = "md",
      state = "default",
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      isRequired = false,
      isReadOnly = false,
      fullWidth = true,
      multiline = false,
      rows = 3,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID using React 18 useId
    const inputId = id ?? useId();

    // Determine final state (error message takes precedence)
    const finalState = errorMessage ? "error" : state;

    // Build input classes
    const baseClasses = inputVariants.base;
    const variantClasses = inputVariants.variants[variant][finalState];
    const sizeClasses = variant === "underlined"
      ? inputVariants.underlinedSizes[size]
      : inputVariants.sizes[size];
    const widthClasses = fullWidth ? "w-full" : "";
    const readOnlyClasses = isReadOnly ? "cursor-default bg-muted" : "";

    const inputClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      readOnlyClasses,
      className
    ].filter(Boolean).join(" ");

    // Build container classes for icon/addon support
    const hasLeftElement = leftIcon ?? leftAddon;
    const hasRightElement = rightIcon ?? rightAddon;
    const containerClasses = hasLeftElement || hasRightElement ? "relative" : "";

    // Icon/addon positioning classes using semantic tokens
    const leftElementClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-on-muted";
    const rightElementClasses = "absolute right-3 top-1/2 -translate-y-1/2 text-on-muted";
    const leftPaddingClass = hasLeftElement ? "pl-10" : "";
    const rightPaddingClass = hasRightElement ? "pr-10" : "";

    // Final input classes with padding adjustments
    const finalInputClasses = [
      inputClasses,
      leftPaddingClass,
      rightPaddingClass
    ].filter(Boolean).join(" ");

    // Note: InputElement variable removed as we now render conditionally

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`${labelVariants.base} ${labelVariants.states[finalState]}`}
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className={containerClasses}>
          {/* Left Icon/Addon */}
          {leftIcon && (
            <div className={leftElementClasses}>
              {leftIcon}
            </div>
          )}
          {leftAddon && (
            <div className={`${leftElementClasses} text-sm font-medium`}>
              {leftAddon}
            </div>
          )}

          {/* Input/Textarea Element */}
          {multiline ? (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              id={inputId}
              readOnly={isReadOnly}
              required={isRequired}
              rows={rows}
              aria-invalid={finalState === "error"}
              aria-describedby={
                (helperText || errorMessage) ? `${inputId}-description` : undefined
              }
              className={finalInputClasses}
              {...(props as ComponentPropsWithoutRef<"textarea">)}
            />
          ) : (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={inputId}
              readOnly={isReadOnly}
              required={isRequired}
              aria-invalid={finalState === "error"}
              aria-describedby={
                (helperText || errorMessage) ? `${inputId}-description` : undefined
              }
              className={finalInputClasses}
              {...(props as ComponentPropsWithoutRef<"input">)}
            />
          )}

          {/* Right Icon/Addon */}
          {rightIcon && (
            <div className={rightElementClasses}>
              {rightIcon}
            </div>
          )}
          {rightAddon && (
            <div className={`${rightElementClasses} text-sm font-medium`}>
              {rightAddon}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText ?? errorMessage) && (
          <p
            id={`${inputId}-description`}
            className={`${helperTextVariants.base} ${helperTextVariants.states[finalState]}`}
          >
            {errorMessage ?? helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Export types for external use
export type { InputProps, InputVariants };