import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Shadow variant configurations based on modern 2025 patterns
interface ShadowVariants {
  elevation: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  variant: "subtle" | "moderate" | "strong" | "none";
  color: "neutral" | "primary" | "success" | "warning" | "error";
  inset: boolean;
}

// Shadow props interface
interface ShadowProps extends ComponentPropsWithoutRef<"div"> {
  elevation?: ShadowVariants["elevation"];
  variant?: ShadowVariants["variant"];
  color?: ShadowVariants["color"];
  inset?: boolean;
  animated?: boolean;
  hover?: boolean;
  focus?: boolean;
  children: ReactNode;
}

// Semantic class configurations using Tailwind CSS v4 shadow utilities
const shadowVariants = {
  elevation: {
    0: "shadow-none",
    1: "shadow-2xs",
    2: "shadow-xs",
    3: "shadow-sm",
    4: "shadow-md",
    5: "shadow-lg",
    6: "shadow-xl"
  },

  elevationInset: {
    0: "shadow-none",
    1: "inset-shadow-2xs",
    2: "inset-shadow-xs",
    3: "inset-shadow-sm",
    4: "inset-shadow-md",
    5: "inset-shadow-lg",
    6: "inset-shadow-xl"
  },

  variant: {
    none: "shadow-none",
    subtle: "shadow-xs",
    moderate: "shadow-md",
    strong: "shadow-xl"
  },

  variantInset: {
    none: "shadow-none",
    subtle: "inset-shadow-xs",
    moderate: "inset-shadow-md",
    strong: "inset-shadow-xl"
  },

  color: {
    neutral: "shadow-neutral-500/25",
    primary: "shadow-primary/25",
    success: "shadow-success/25",
    warning: "shadow-warning/25",
    error: "shadow-error/25"
  },

  hover: {
    elevation: {
      0: "hover:shadow-none",
      1: "hover:shadow-xs",
      2: "hover:shadow-sm",
      3: "hover:shadow-md",
      4: "hover:shadow-lg",
      5: "hover:shadow-xl",
      6: "hover:shadow-2xl"
    },
    variant: {
      none: "hover:shadow-none",
      subtle: "hover:shadow-sm",
      moderate: "hover:shadow-lg",
      strong: "hover:shadow-2xl"
    }
  },

  focus: {
    elevation: {
      0: "focus:shadow-none",
      1: "focus:shadow-xs",
      2: "focus:shadow-sm",
      3: "focus:shadow-md",
      4: "focus:shadow-lg",
      5: "focus:shadow-xl",
      6: "focus:shadow-2xl"
    },
    variant: {
      none: "focus:shadow-none",
      subtle: "focus:shadow-sm",
      moderate: "focus:shadow-lg",
      strong: "focus:shadow-2xl"
    }
  },

  animation: "transition-shadow duration-200 ease-out",

  animationReducedMotion: "motion-reduce:transition-none"
};

// Main Shadow component
const ShadowRoot = forwardRef<HTMLDivElement, ShadowProps>(
  (
    {
      elevation,
      variant = "moderate",
      color = "neutral",
      inset = false,
      animated = true,
      hover = false,
      focus = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // Determine which shadow system to use
    const useElevation = elevation !== undefined;

    // Build shadow classes
    const shadowClasses = [];

    // Base shadow
    if (useElevation) {
      const elevationMap = inset ? shadowVariants.elevationInset : shadowVariants.elevation;
      shadowClasses.push(elevationMap[elevation]);
    } else {
      const variantMap = inset ? shadowVariants.variantInset : shadowVariants.variant;
      shadowClasses.push(variantMap[variant]);
    }

    // Color (only for non-inset shadows)
    if (!inset && variant !== "none" && (elevation === undefined || elevation > 0)) {
      shadowClasses.push(shadowVariants.color[color]);
    }

    // Hover effects
    if (hover) {
      if (useElevation) {
        const hoverElevation = Math.min((elevation as number) + 1, 6) as ShadowVariants["elevation"];
        shadowClasses.push(shadowVariants.hover.elevation[hoverElevation]);
      } else {
        const hoverVariant = variant === "subtle" ? "moderate" : variant === "moderate" ? "strong" : "strong";
        shadowClasses.push(shadowVariants.hover.variant[hoverVariant]);
      }
    }

    // Focus effects
    if (focus) {
      if (useElevation) {
        const focusElevation = Math.min((elevation as number) + 1, 6) as ShadowVariants["elevation"];
        shadowClasses.push(shadowVariants.focus.elevation[focusElevation]);
      } else {
        const focusVariant = variant === "subtle" ? "moderate" : variant === "moderate" ? "strong" : "strong";
        shadowClasses.push(shadowVariants.focus.variant[focusVariant]);
      }
    }

    // Animation
    if (animated) {
      shadowClasses.push(shadowVariants.animation);
      shadowClasses.push(shadowVariants.animationReducedMotion);
    }

    // Combine all classes
    const finalClasses = [
      ...shadowClasses,
      className
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={finalClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ShadowRoot.displayName = "Shadow";

// Shadow utility components for common use cases
export const Card = forwardRef<HTMLDivElement, Omit<ShadowProps, "variant"> & { variant?: "flat" | "elevated" | "outlined" }>(
  ({ variant = "elevated", elevation = 2, ...props }, ref) => {
    if (variant === "flat") {
      return <ShadowRoot ref={ref} elevation={0} {...props} />;
    }
    if (variant === "outlined") {
      return <ShadowRoot ref={ref} elevation={0} className="border border-border" {...props} />;
    }
    return <ShadowRoot ref={ref} elevation={elevation} hover animated {...props} />;
  }
);

Card.displayName = "ShadowCard";

export const Modal = forwardRef<HTMLDivElement, Omit<ShadowProps, "elevation" | "variant">>(
  (props, ref) => (
    <ShadowRoot
      ref={ref}
      elevation={6}
      animated
      className="bg-card border border-border rounded-lg"
      {...props}
    />
  )
);

Modal.displayName = "ShadowModal";

export const Dropdown = forwardRef<HTMLDivElement, Omit<ShadowProps, "elevation" | "variant">>(
  (props, ref) => (
    <ShadowRoot
      ref={ref}
      elevation={4}
      animated
      className="bg-card border border-border rounded-md"
      {...props}
    />
  )
);

Dropdown.displayName = "ShadowDropdown";

export const Tooltip = forwardRef<HTMLDivElement, Omit<ShadowProps, "elevation" | "variant">>(
  (props, ref) => (
    <ShadowRoot
      ref={ref}
      elevation={2}
      animated
      className="bg-fg text-bg rounded px-2 py-1 text-xs"
      {...props}
    />
  )
);

Tooltip.displayName = "ShadowTooltip";

export const FloatingPanel = forwardRef<HTMLDivElement, Omit<ShadowProps, "elevation" | "variant">>(
  (props, ref) => (
    <ShadowRoot
      ref={ref}
      elevation={5}
      hover
      animated
      className="bg-card border border-border rounded-lg"
      {...props}
    />
  )
);

FloatingPanel.displayName = "ShadowFloatingPanel";

// Compound component interface
interface ShadowComponent extends React.ForwardRefExoticComponent<ShadowProps & React.RefAttributes<HTMLDivElement>> {
  Card: typeof Card;
  Modal: typeof Modal;
  Dropdown: typeof Dropdown;
  Tooltip: typeof Tooltip;
  FloatingPanel: typeof FloatingPanel;
}

// Compound component pattern - attach utility components to main Shadow
const ShadowWithSubComponents = ShadowRoot as ShadowComponent;
ShadowWithSubComponents.Card = Card;
ShadowWithSubComponents.Modal = Modal;
ShadowWithSubComponents.Dropdown = Dropdown;
ShadowWithSubComponents.Tooltip = Tooltip;
ShadowWithSubComponents.FloatingPanel = FloatingPanel;

export { ShadowWithSubComponents as Shadow };

// Export types for external use
export type {
  ShadowProps,
  ShadowVariants
};