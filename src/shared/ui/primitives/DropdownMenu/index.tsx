import { forwardRef, createContext, useContext, useState, useCallback, useId, useRef, useEffect } from "react";
import type { ComponentPropsWithoutRef, ReactNode, KeyboardEvent } from "react";

// DropdownMenu variant configurations based on modern 2025 patterns
interface DropdownMenuVariants {
  size: "sm" | "md" | "lg";
  position: "top" | "bottom" | "left" | "right";
}

// DropdownMenu props interface
interface DropdownMenuProps extends ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

// DropdownMenu trigger props
interface DropdownMenuTriggerProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children: ReactNode;
}

// DropdownMenu content props
interface DropdownMenuContentProps extends ComponentPropsWithoutRef<"div"> {
  size?: DropdownMenuVariants["size"];
  position?: DropdownMenuVariants["position"];
  align?: "start" | "center" | "end";
  sideOffset?: number;
  children: ReactNode;
}

// DropdownMenu item props
interface DropdownMenuItemProps extends ComponentPropsWithoutRef<"div"> {
  disabled?: boolean;
  destructive?: boolean;
  children: ReactNode;
  onSelect?: (event: Event) => void;
}

// DropdownMenu separator props
interface DropdownMenuSeparatorProps extends ComponentPropsWithoutRef<"div"> {}

// DropdownMenu context value
interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemCount: number;
  setItemCount: (count: number) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

// Hook to access dropdown menu context
export const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenuContext must be used within a DropdownMenu component");
  }
  return context;
};

// Semantic class configurations using design tokens
const dropdownMenuVariants = {
  content: {
    base: "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-card p-1 text-fg shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",

    sizes: {
      sm: "min-w-24 text-xs",
      md: "min-w-32 text-sm",
      lg: "min-w-40 text-base"
    },

    positions: {
      top: "bottom-full mb-1",
      bottom: "top-full mt-1",
      left: "right-full mr-1",
      right: "left-full ml-1"
    },

    aligns: {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0"
    }
  },

  item: {
    base: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    destructive: "text-error focus:bg-error/10 focus:text-error"
  },

  separator: "my-1 h-px bg-border"
};

// Main DropdownMenu component
const DropdownMenuRoot = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [itemCount, setItemCount] = useState(0);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Generate unique IDs for accessibility
    const triggerId = useId();
    const contentId = useId();

    // Refs for managing focus and positioning
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle open state changes
    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);

      if (!newOpen) {
        setActiveIndex(-1);
        // Return focus to trigger when closing
        triggerRef.current?.focus();
      }
    }, [isControlled, onOpenChange]);

    // Close dropdown when clicking outside
    useEffect(() => {
      if (!open) {return;}

      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          contentRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !contentRef.current.contains(event.target as Node)
        ) {
          handleOpenChange(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, handleOpenChange]);

    // Handle escape key
    useEffect(() => {
      if (!open) {return;}

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleOpenChange(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown as any);
      return () => document.removeEventListener("keydown", handleKeyDown as any);
    }, [open, handleOpenChange]);

    const contextValue: DropdownMenuContextValue = {
      open,
      setOpen: handleOpenChange,
      triggerId,
      contentId,
      triggerRef,
      contentRef,
      activeIndex,
      setActiveIndex,
      itemCount,
      setItemCount,
    };

    return (
      <DropdownMenuContext.Provider value={contextValue}>
        <div ref={ref} className={`relative inline-block ${className}`} {...props}>
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

DropdownMenuRoot.displayName = "DropdownMenu";

// DropdownMenu Trigger component
export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  (
    {
      asChild = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, triggerId, contentId, triggerRef } = useDropdownMenuContext();

    const handleClick = () => {
      setOpen(!open);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
          event.preventDefault();
          setOpen(true);
          break;
        case "ArrowUp":
          event.preventDefault();
          setOpen(true);
          break;
      }
    };

    if (asChild) {
      // In a real implementation, you would clone the child element
      // and add the necessary props. For simplicity, we'll render as button.
      console.warn("asChild prop not fully implemented in this example");
    }

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          if (triggerRef) {
            triggerRef.current = node;
          }
        }}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        className={className}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// DropdownMenu Content component
export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    {
      size = "md",
      position = "bottom",
      align = "start",
      sideOffset = 4,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const { open, contentId, contentRef, activeIndex, setActiveIndex, setItemCount } = useDropdownMenuContext();

    // Count items for keyboard navigation
    useEffect(() => {
      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll('[role="menuitem"]:not([data-disabled])');
        setItemCount(items.length);
      }
    }, [children, setItemCount]);

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const items = contentRef.current?.querySelectorAll('[role="menuitem"]:not([data-disabled])');
      if (!items) {return;}

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex(prev => (prev + 1) % items.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex(prev => (prev - 1 + items.length) % items.length);
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(items.length - 1);
          break;
      }
    };

    // Focus management
    useEffect(() => {
      if (open && activeIndex >= 0) {
        const items = contentRef.current?.querySelectorAll('[role="menuitem"]:not([data-disabled])');
        const activeItem = items?.[activeIndex] as HTMLElement;
        activeItem?.focus();
      }
    }, [activeIndex, open]);

    if (!open) {return null;}

    const contentClasses = [
      dropdownMenuVariants.content.base,
      dropdownMenuVariants.content.sizes[size],
      dropdownMenuVariants.content.positions[position],
      dropdownMenuVariants.content.aligns[align],
      "absolute",
      className
    ].filter(Boolean).join(" ");

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
        id={contentId}
        role="menu"
        aria-orientation="vertical"
        className={contentClasses}
        style={{
          marginTop: position === "bottom" ? sideOffset : undefined,
          marginBottom: position === "top" ? sideOffset : undefined,
          marginLeft: position === "right" ? sideOffset : undefined,
          marginRight: position === "left" ? sideOffset : undefined,
        }}
        data-state={open ? "open" : "closed"}
        data-side={position}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

// DropdownMenu Item component
export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (
    {
      disabled = false,
      destructive = false,
      className = "",
      children,
      onSelect,
      ...props
    },
    ref
  ) => {
    const { setOpen } = useDropdownMenuContext();

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {return;}

      onSelect?.(event.nativeEvent);
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {return;}

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(event.nativeEvent);
        setOpen(false);
      }
    };

    const itemClasses = [
      dropdownMenuVariants.item.base,
      destructive ? dropdownMenuVariants.item.destructive : "",
      className
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        data-disabled={disabled ? "" : undefined}
        className={itemClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

// DropdownMenu Separator component
export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  (
    {
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={`${dropdownMenuVariants.separator} ${className}`}
        {...props}
      />
    );
  }
);

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// Compound component interface
interface DropdownMenuComponent extends React.ForwardRefExoticComponent<DropdownMenuProps & React.RefAttributes<HTMLDivElement>> {
  Trigger: typeof DropdownMenuTrigger;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
  Separator: typeof DropdownMenuSeparator;
}

// Compound component pattern - attach sub-components to main DropdownMenu
const DropdownMenuWithSubComponents = DropdownMenuRoot as DropdownMenuComponent;
DropdownMenuWithSubComponents.Trigger = DropdownMenuTrigger;
DropdownMenuWithSubComponents.Content = DropdownMenuContent;
DropdownMenuWithSubComponents.Item = DropdownMenuItem;
DropdownMenuWithSubComponents.Separator = DropdownMenuSeparator;

export { DropdownMenuWithSubComponents as DropdownMenu };

// Export types for external use
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuVariants
};