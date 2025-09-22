import { forwardRef, createContext, useContext, useState, useId, useRef, useEffect } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Collapsible variant configurations based on modern 2025 patterns
interface CollapsibleVariants {
  variant: "default" | "outlined" | "filled" | "minimal";
  size: "sm" | "md" | "lg";
  animation: "none" | "fade" | "slide" | "scale";
}

// Modern Collapsible props interface extending HTML div attributes
interface CollapsibleProps extends ComponentPropsWithoutRef<"div"> {
  variant?: CollapsibleVariants["variant"];
  size?: CollapsibleVariants["size"];
  animation?: CollapsibleVariants["animation"];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}

// Collapsible Trigger props
interface CollapsibleTriggerProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
}

// Collapsible Content props
interface CollapsibleContentProps extends ComponentPropsWithoutRef<"div"> {
  forceMount?: boolean;
  children: ReactNode;
}

// Collapsible context for sharing state
interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  variant: CollapsibleVariants["variant"];
  size: CollapsibleVariants["size"];
  animation: CollapsibleVariants["animation"];
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

// Hook to access collapsible context
export const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsibleContext must be used within a Collapsible component");
  }
  return context;
};

// Semantic class configurations using design tokens
const collapsibleVariants = {
  base: "w-full",

  variants: {
    default: "bg-card border border-border rounded-md",
    outlined: "border-2 border-border rounded-md",
    filled: "bg-muted border border-border rounded-md",
    minimal: ""
  },

  sizes: {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }
};

// Trigger styling using semantic tokens
const triggerVariants = {
  base: "flex w-full items-center justify-between text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",

  variants: {
    default: "hover:bg-accent hover:text-accent-foreground",
    outlined: "hover:bg-muted/50",
    filled: "hover:bg-muted/80",
    minimal: "hover:text-fg/80"
  },

  sizes: {
    sm: "h-9 px-3 py-2 text-sm",
    md: "h-10 px-4 py-2.5 text-sm",
    lg: "h-11 px-6 py-3 text-base"
  },

  icon: "h-4 w-4 shrink-0 transition-transform duration-200"
};

// Content styling using semantic tokens
const contentVariants = {
  base: "overflow-hidden text-sm",

  variants: {
    default: "border-t border-border",
    outlined: "border-t-2 border-border",
    filled: "border-t border-border",
    minimal: ""
  },

  sizes: {
    sm: "px-3 pb-3 pt-0 text-xs",
    md: "px-4 pb-4 pt-0 text-sm",
    lg: "px-6 pb-6 pt-0 text-base"
  },

  animations: {
    none: "",
    fade: "transition-opacity duration-200 ease-in-out",
    slide: "transition-[max-height] duration-300 ease-in-out",
    scale: "transition-all duration-200 ease-in-out transform origin-top"
  }
};

// Main Collapsible component
const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      variant = "default",
      size = "md",
      animation = "slide",
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Generate unique IDs for accessibility
    const triggerId = useId();
    const contentId = useId();

    // Handle open state changes
    const handleOpenChange = (newOpen: boolean) => {
      if (disabled) {
        return;
      }

      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    // Build collapsible classes
    const baseClasses = collapsibleVariants.base;
    const variantClasses = collapsibleVariants.variants[variant];
    const sizeClasses = collapsibleVariants.sizes[size];

    const collapsibleClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      className
    ].filter(Boolean).join(" ");

    const contextValue: CollapsibleContextValue = {
      open,
      onOpenChange: handleOpenChange,
      disabled,
      variant,
      size,
      animation,
      triggerId,
      contentId
    };

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={collapsibleClasses}
          data-state={open ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);

CollapsibleRoot.displayName = "Collapsible";

// Collapsible Trigger component
export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange, disabled, variant, size, triggerId, contentId } = useCollapsibleContext();

    // Build trigger classes
    const baseClasses = triggerVariants.base;
    const variantClasses = triggerVariants.variants[variant];
    const sizeClasses = triggerVariants.sizes[size];

    const triggerClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      className
    ].filter(Boolean).join(" ");

    // Chevron icon component
    const ChevronIcon = () => (
      <svg
        className={`${triggerVariants.icon} ${open ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );

    const handleClick = () => {
      onOpenChange(!open);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={triggerClasses}
        onClick={handleClick}
        disabled={disabled}
        aria-expanded={open}
        aria-controls={contentId}
        id={triggerId}
        data-state={open ? "open" : "closed"}
        {...props}
      >
        <span className="flex-1 text-left">{children}</span>
        <ChevronIcon />
      </button>
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

// Collapsible Content component
export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  (
    {
      forceMount = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const { open, variant, size, animation, triggerId, contentId } = useCollapsibleContext();
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);

    // Calculate height for smooth animations
    useEffect(() => {
      if (animation === "slide" && contentRef.current) {
        if (open) {
          const scrollHeight = contentRef.current.scrollHeight;
          setHeight(scrollHeight);
        } else {
          setHeight(0);
        }
      }
    }, [open, animation, children]);

    // Don't render if closed and not forced to mount
    if (!open && !forceMount) {
      return null;
    }

    // Build content classes
    const baseClasses = contentVariants.base;
    const variantClasses = contentVariants.variants[variant];
    const sizeClasses = contentVariants.sizes[size];
    const animationClasses = contentVariants.animations[animation];

    const contentClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      animationClasses,
      className
    ].filter(Boolean).join(" ");

    // Apply different styles based on animation type
    const getAnimationStyles = () => {
      switch (animation) {
        case "fade":
          return {
            opacity: open ? 1 : 0,
            visibility: open ? "visible" : "hidden"
          } as const;
        case "slide":
          return {
            maxHeight: height !== undefined ? `${height}px` : open ? "none" : "0px",
            opacity: open ? 1 : 0
          } as const;
        case "scale":
          return {
            transform: open ? "scaleY(1)" : "scaleY(0)",
            opacity: open ? 1 : 0
          } as const;
        default:
          return {};
      }
    };

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          if (contentRef) {
            contentRef.current = node;
          }
        }}
        className={contentClasses}
        style={getAnimationStyles()}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        data-state={open ? "open" : "closed"}
        {...props}
      >
        <div className="pb-4 pt-0">
          {children}
        </div>
      </div>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";

// Compound component interface
interface CollapsibleComponent extends React.ForwardRefExoticComponent<CollapsibleProps & React.RefAttributes<HTMLDivElement>> {
  Trigger: typeof CollapsibleTrigger;
  Content: typeof CollapsibleContent;
}

// Compound component pattern - attach sub-components to main Collapsible
const CollapsibleWithSubComponents = CollapsibleRoot as CollapsibleComponent;
CollapsibleWithSubComponents.Trigger = CollapsibleTrigger;
CollapsibleWithSubComponents.Content = CollapsibleContent;

export { CollapsibleWithSubComponents as Collapsible };

// Export types for external use
export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
  CollapsibleVariants
};