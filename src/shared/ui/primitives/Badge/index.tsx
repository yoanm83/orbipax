"use client";

import { forwardRef, createContext, useContext } from "react";

// Badge Variants Type
export interface BadgeVariants {
  variant: "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline" | "soft" | "dot";
  size: "xs" | "sm" | "md" | "lg";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "inline";
}

// Badge Context
interface BadgeContextValue {
  variant: BadgeVariants["variant"];
  size: BadgeVariants["size"];
  position?: BadgeVariants["position"];
}

const BadgeContext = createContext<BadgeContextValue | undefined>(undefined);

export const useBadgeContext = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error("Badge compound components must be used within Badge component");
  }
  return context;
};

// Badge Props
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariants {
  children?: React.ReactNode;
  count?: number;
  max?: number;
  showZero?: boolean;
  dot?: boolean;
  pulse?: boolean;
  positioned?: boolean;
}

// Badge Root Component
const BadgeRoot = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      position = "inline",
      children,
      count,
      max = 99,
      showZero = false,
      dot = false,
      pulse = false,
      positioned = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const contextValue: BadgeContextValue = {
      variant,
      size,
      position
    };

    // Determine if we should show the badge
    const shouldShow = dot ||
                      (count !== undefined && (count > 0 || showZero)) ||
                      children;

    if (!shouldShow) {
      return null;
    }

    // Format count display
    const displayCount = count !== undefined ? (count > max ? `${max}+` : count.toString()) : null;
    const displayContent = dot ? null : (displayCount || children);

    // Base badge styles
    const baseStyles = [
      // Base styles
      "inline-flex items-center justify-center font-medium leading-none",
      "rounded-full border transition-colors duration-200",

      // Size variants
      size === "xs" && [
        dot ? "w-1.5 h-1.5" : "min-w-4 h-4 px-1.5 text-[10px]"
      ],
      size === "sm" && [
        dot ? "w-2 h-2" : "min-w-5 h-5 px-2 text-xs"
      ],
      size === "md" && [
        dot ? "w-2.5 h-2.5" : "min-w-6 h-6 px-2.5 text-sm"
      ],
      size === "lg" && [
        dot ? "w-3 h-3" : "min-w-7 h-7 px-3 text-base"
      ],

      // Variant styles
      variant === "default" && [
        "bg-primary text-primary-fg border-primary"
      ],
      variant === "secondary" && [
        "bg-secondary text-secondary-fg border-secondary"
      ],
      variant === "success" && [
        "bg-success text-success-fg border-success"
      ],
      variant === "warning" && [
        "bg-warning text-warning-fg border-warning"
      ],
      variant === "error" && [
        "bg-error text-error-fg border-error"
      ],
      variant === "info" && [
        "bg-info text-info-fg border-info"
      ],
      variant === "outline" && [
        "bg-transparent text-fg border-border hover:bg-muted"
      ],
      variant === "soft" && [
        "bg-muted text-on-muted border-transparent"
      ],
      variant === "dot" && [
        "bg-primary border-primary"
      ],

      // Position styles (when positioned)
      positioned && [
        "absolute z-10",
        position === "top-right" && "-top-1 -right-1",
        position === "top-left" && "-top-1 -left-1",
        position === "bottom-right" && "-bottom-1 -right-1",
        position === "bottom-left" && "-bottom-1 -left-1"
      ],

      // Pulse animation
      pulse && "animate-pulse",

      className
    ].filter(Boolean).flat().join(" ");

    return (
      <BadgeContext.Provider value={contextValue}>
        <span
          ref={ref}
          className={baseStyles}
          role={count !== undefined ? "status" : undefined}
          aria-label={count !== undefined ? `${count} notifications` : undefined}
          {...props}
        >
          {displayContent}
        </span>
      </BadgeContext.Provider>
    );
  }
);

BadgeRoot.displayName = "Badge";

// Badge Container Component (for positioned badges)
export interface BadgeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const BadgeContainer = forwardRef<HTMLDivElement, BadgeContainerProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative inline-block ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BadgeContainer.displayName = "Badge.Container";

// Badge Content Component
export interface BadgeContentProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const BadgeContent = forwardRef<HTMLSpanElement, BadgeContentProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BadgeContent.displayName = "Badge.Content";

// Badge Icon Component
export interface BadgeIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const BadgeIcon = forwardRef<HTMLSpanElement, BadgeIconProps>(
  ({ children, className = "", ...props }, ref) => {
    const { size } = useBadgeContext();

    const iconSizes = {
      xs: "w-2.5 h-2.5",
      sm: "w-3 h-3",
      md: "w-3.5 h-3.5",
      lg: "w-4 h-4"
    };

    return (
      <span
        ref={ref}
        className={`inline-flex ${iconSizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BadgeIcon.displayName = "Badge.Icon";

// Export compound component
export const Badge = Object.assign(BadgeRoot, {
  Container: BadgeContainer,
  Content: BadgeContent,
  Icon: BadgeIcon
});

// Export types
export type {
  BadgeContainerProps,
  BadgeContentProps,
  BadgeIconProps
};