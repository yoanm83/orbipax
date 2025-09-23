import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

/**
 * Button - OrbiPax Health Philosophy Compliant
 *
 * ACCESSIBILITY (WCAG 2.1 AA):
 * - Minimum 44×44px touch targets for healthcare devices
 * - High contrast color ratios for visibility
 * - Keyboard navigation support with focus indicators
 * - Loading states with proper ARIA announcements
 * - Icon-only buttons require aria-label
 *
 * HEALTH DESIGN TOKENS:
 * - Semantic color system for medical contexts
 * - Consistent spacing and typography scales
 * - Professional appearance for clinical settings
 *
 * CONTAINER QUERIES:
 * - Responsive sizing for different device contexts
 * - Adaptable to medical device viewports
 */

// Button variant configurations based on Health Philosophy
interface ButtonVariants {
  variant: "solid" | "outline" | "ghost" | "link";
  size: "xs" | "sm" | "md" | "lg" | "xl";
  intent: "primary" | "secondary" | "success" | "warning" | "error";
}

// Modern Button props interface extending HTML button attributes
interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  intent?: ButtonVariants["intent"];
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  fullWidth?: boolean;
  children: React.ReactNode;
}

// Semantic class configurations using Health Philosophy tokens
const buttonVariants = {
  base: "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed @container/button:max-width[320px]:text-xs @container/button:min-width[768px]:gap-3",

  variants: {
    solid: {
      primary: "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80",
      secondary: "bg-muted text-on-muted hover:bg-muted/90 active:bg-muted/80",
      success: "bg-success text-on-primary hover:bg-success/90 active:bg-success/80",
      warning: "bg-warning text-on-primary hover:bg-warning/90 active:bg-warning/80",
      error: "bg-error text-on-primary hover:bg-error/90 active:bg-error/80"
    },
    outline: {
      primary: "border border-primary text-primary hover:bg-primary/10 active:bg-primary/20",
      secondary: "border border-border text-on-muted hover:bg-muted/50 active:bg-muted/70",
      success: "border border-success text-success hover:bg-success/10 active:bg-success/20",
      warning: "border border-warning text-warning hover:bg-warning/10 active:bg-warning/20",
      error: "border border-error text-error hover:bg-error/10 active:bg-error/20"
    },
    ghost: {
      primary: "text-primary hover:bg-primary/10 active:bg-primary/20",
      secondary: "text-on-muted hover:bg-muted/50 active:bg-muted/70",
      success: "text-success hover:bg-success/10 active:bg-success/20",
      warning: "text-warning hover:bg-warning/10 active:bg-warning/20",
      error: "text-error hover:bg-error/10 active:bg-error/20"
    },
    link: {
      primary: "text-primary underline-offset-4 hover:underline",
      secondary: "text-on-muted underline-offset-4 hover:underline",
      success: "text-success underline-offset-4 hover:underline",
      warning: "text-warning underline-offset-4 hover:underline",
      error: "text-error underline-offset-4 hover:underline"
    }
  },

  sizes: {
    xs: "min-h-[32px] h-8 px-2 text-xs", // Compact for dense interfaces
    sm: "min-h-[36px] h-9 px-3 text-sm", // Small but accessible
    md: "min-h-[44px] h-11 px-4 text-sm", // Healthcare standard 44×44px
    lg: "min-h-[48px] h-12 px-6 text-base", // Large touch targets
    xl: "min-h-[56px] h-14 px-8 text-lg" // Extra large for medical devices
  }
};

// Modern Button component with forwardRef for better DOM access
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "md",
      intent = "primary",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      children,
      type = "button",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    // Note: buttonId removed as it was unused

    // Combine all CSS classes based on variant, size, and intent
    const baseClasses = buttonVariants.base;
    const variantClasses = buttonVariants.variants[variant][intent];
    const sizeClasses = buttonVariants.sizes[size];
    const widthClasses = fullWidth ? "w-full" : "";

    const buttonClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      className
    ].filter(Boolean).join(" ");

    // Handle loading and disabled states
    const isDisabled = disabled ?? isLoading;
    const content = isLoading ? (loadingText ?? "Loading...") : children;

    // Icon-only button requires aria-label
    const iconOnly = !children && (leftIcon ?? rightIcon);
    if (iconOnly && !ariaLabel) {
      // Icon-only buttons must have an aria-label for accessibility
      throw new Error("Button: Icon-only buttons must have an aria-label");
    }

    // Loading spinner component (minimal implementation)
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
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

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        aria-label={iconOnly ? ariaLabel : undefined}
        data-state={isLoading ? "loading" : "idle"}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? <LoadingSpinner /> : leftIcon}
        {content}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

// Export types for external use
export type { ButtonProps, ButtonVariants };