import { forwardRef, createContext, useContext, useState, useCallback, useId, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ComponentPropsWithoutRef, ReactNode, KeyboardEvent, MouseEvent } from "react";

// Sheet variant configurations based on modern 2025 patterns
interface SheetVariants {
  side: "top" | "right" | "bottom" | "left";
  size: "sm" | "md" | "lg" | "xl" | "full" | "content";
  variant: "default" | "overlay" | "push" | "mini";
}

// Sheet props interface
interface SheetProps extends Omit<ComponentPropsWithoutRef<"div">, "onClose"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: SheetVariants["side"];
  size?: SheetVariants["size"];
  variant?: SheetVariants["variant"];
  modal?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  preventScrollLock?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
  returnFocus?: boolean;
  persistent?: boolean;
  resizable?: boolean;
  children: ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
}

// Sheet trigger props
interface SheetTriggerProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children: ReactNode;
}

// Sheet content props
interface SheetContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  showCloseButton?: boolean;
}

// Sheet header props
interface SheetHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Sheet title props
interface SheetTitleProps extends ComponentPropsWithoutRef<"h2"> {
  children: ReactNode;
}

// Sheet description props
interface SheetDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
}

// Sheet body props
interface SheetBodyProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  scrollable?: boolean;
}

// Sheet footer props
interface SheetFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Sheet close props
interface SheetCloseProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children?: ReactNode;
}

// Sheet context value
interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: SheetVariants["side"];
  size: SheetVariants["size"];
  variant: SheetVariants["variant"];
  modal: boolean;
  sheetId: string;
  titleId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  closeSheet: () => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

// Hook to access sheet context
export const useSheetContext = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheetContext must be used within a Sheet component");
  }
  return context;
};

// Focus management utilities
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    'details',
    'summary'
  ];

  return Array.from(container.querySelectorAll(selectors.join(', '))) as HTMLElement[];
};

const useFocusTrap = (enabled: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!enabled || !containerRef.current) { return; }

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);

    if (focusableElements.length === 0) { return; }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Tab') { return; }

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled, containerRef]);
};

// Portal component for rendering outside the DOM tree
const Portal = ({ children, container }: { children: ReactNode; container?: Element | null }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) { return null; }

  const portalContainer = container || document.body;
  return createPortal(children, portalContainer);
};

// Semantic class configurations using design tokens
const sheetVariants = {
  overlay: {
    base: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out",
    open: "data-[state=open]:animate-in data-[state=open]:fade-in-0",
    closed: "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
  },

  content: {
    base: "fixed z-50 bg-card border border-border shadow-xl transition-all duration-300 ease-out focus:outline-none",

    sides: {
      top: {
        base: "inset-x-0 top-0 border-b rounded-b-lg",
        open: "data-[state=open]:animate-in data-[state=open]:slide-in-from-top",
        closed: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top"
      },
      right: {
        base: "inset-y-0 right-0 border-l rounded-l-lg",
        open: "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
        closed: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
      },
      bottom: {
        base: "inset-x-0 bottom-0 border-t rounded-t-lg",
        open: "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
        closed: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom"
      },
      left: {
        base: "inset-y-0 left-0 border-r rounded-r-lg",
        open: "data-[state=open]:animate-in data-[state=open]:slide-in-from-left",
        closed: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left"
      }
    },

    sizes: {
      top: {
        sm: "h-1/3",
        md: "h-1/2",
        lg: "h-2/3",
        xl: "h-3/4",
        full: "h-full",
        content: "h-auto max-h-[80vh]"
      },
      right: {
        sm: "w-80",
        md: "w-96",
        lg: "w-[32rem]",
        xl: "w-[40rem]",
        full: "w-full",
        content: "w-auto max-w-[80vw]"
      },
      bottom: {
        sm: "h-1/3",
        md: "h-1/2",
        lg: "h-2/3",
        xl: "h-3/4",
        full: "h-full",
        content: "h-auto max-h-[80vh]"
      },
      left: {
        sm: "w-80",
        md: "w-96",
        lg: "w-[32rem]",
        xl: "w-[40rem]",
        full: "w-full",
        content: "w-auto max-w-[80vw]"
      }
    },

    variants: {
      default: "shadow-xl",
      overlay: "shadow-2xl",
      push: "shadow-lg",
      mini: "shadow-md"
    }
  },

  header: {
    base: "flex items-center justify-between p-6 pb-4 border-b border-border"
  },

  title: {
    base: "text-lg font-semibold leading-none tracking-tight text-fg"
  },

  description: {
    base: "text-sm text-on-muted mt-1"
  },

  body: {
    base: "flex-1 p-6 overflow-hidden",
    scrollable: "overflow-y-auto"
  },

  footer: {
    base: "flex items-center justify-end gap-2 p-6 pt-4 border-t border-border"
  },

  closeButton: {
    base: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-card transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
    icon: "h-4 w-4"
  },

  resizeHandle: {
    base: "absolute bg-border hover:bg-border-hover transition-colors",
    top: "bottom-0 left-0 right-0 h-2 cursor-ns-resize",
    right: "top-0 bottom-0 left-0 w-2 cursor-ew-resize",
    bottom: "top-0 left-0 right-0 h-2 cursor-ns-resize",
    left: "top-0 bottom-0 right-0 w-2 cursor-ew-resize"
  }
};

// Main Sheet component
const SheetRoot = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      side = "right",
      size = "md",
      variant = "default",
      modal = true,
      closeOnBackdropClick = true,
      closeOnEscapeKey = true,
      preventScrollLock = false,
      trapFocus = true,
      autoFocus = true,
      returnFocus = true,
      persistent = false,
      resizable = false,
      className = "",
      children,
      onClose,
      onOpen,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [previousActiveElement, setPreviousActiveElement] = useState<HTMLElement | null>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Generate unique IDs for accessibility
    const sheetId = useId();
    const titleId = useId();
    const descriptionId = useId();

    // Refs for managing focus
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle open state changes
    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (persistent && !newOpen) { return; }

      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);

      if (newOpen) {
        onOpen?.();
        if (returnFocus && document.activeElement instanceof HTMLElement) {
          setPreviousActiveElement(document.activeElement);
        }
      } else {
        onClose?.();
        // Return focus when closing
        if (returnFocus && previousActiveElement) {
          setTimeout(() => {
            previousActiveElement.focus();
          }, 100);
        }
      }
    }, [isControlled, onOpenChange, onOpen, onClose, persistent, returnFocus, previousActiveElement]);

    // Close sheet function
    const closeSheet = useCallback(() => {
      handleOpenChange(false);
    }, [handleOpenChange]);

    // Focus trap
    useFocusTrap(open && trapFocus, contentRef);

    // Body scroll lock effect
    useEffect(() => {
      if (!open || !modal || preventScrollLock) { return; }

      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, [open, modal, preventScrollLock]);

    // Escape key handler
    useEffect(() => {
      if (!open || !closeOnEscapeKey) { return; }

      const handleEscape = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeSheet();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscapeKey, closeSheet]);

    // Auto focus effect
    useEffect(() => {
      if (!open || !autoFocus) { return; }

      setTimeout(() => {
        if (contentRef.current) {
          const focusableElements = getFocusableElements(contentRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            contentRef.current.focus();
          }
        }
      }, 100);
    }, [open, autoFocus]);

    const contextValue: SheetContextValue = {
      open,
      setOpen: handleOpenChange,
      side,
      size,
      variant,
      modal,
      sheetId,
      titleId,
      descriptionId,
      triggerRef,
      contentRef,
      closeSheet
    };

    return (
      <SheetContext.Provider value={contextValue}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </SheetContext.Provider>
    );
  }
);

SheetRoot.displayName = "Sheet";

// Sheet Trigger component
export const SheetTrigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(
  (
    {
      asChild = false,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { setOpen, triggerRef } = useSheetContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      onClick?.(event);
    };

    if (asChild) {
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
        type="button"
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SheetTrigger.displayName = "SheetTrigger";

// Sheet Content component
export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  (
    {
      showCloseButton = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const {
      open,
      side,
      size,
      variant,
      modal,
      sheetId,
      titleId,
      descriptionId,
      contentRef,
      closeSheet
    } = useSheetContext();

    // Handle backdrop click
    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closeSheet();
      }
    };

    if (!open) { return null; }

    const contentClasses = [
      sheetVariants.content.base,
      sheetVariants.content.sides[side].base,
      sheetVariants.content.sizes[side][size],
      sheetVariants.content.variants[variant],
      sheetVariants.content.sides[side].open,
      sheetVariants.content.sides[side].closed,
      className
    ].filter(Boolean).join(" ");

    const overlayClasses = [
      sheetVariants.overlay.base,
      sheetVariants.overlay.open,
      sheetVariants.overlay.closed
    ].join(" ");

    return (
      <Portal>
        {modal && (
          <div
            className={overlayClasses}
            data-state={open ? "open" : "closed"}
            onClick={closeSheet}
          />
        )}

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
          id={sheetId}
          role={modal ? "dialog" : "complementary"}
          aria-modal={modal}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={contentClasses}
          data-state={open ? "open" : "closed"}
          data-side={side}
          tabIndex={-1}
          {...props}
        >
          <div className="flex h-full flex-col">
            {children}
          </div>

          {showCloseButton && (
            <SheetClose className={sheetVariants.closeButton.base}>
              <svg className={sheetVariants.closeButton.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </SheetClose>
          )}
        </div>
      </Portal>
    );
  }
);

SheetContent.displayName = "SheetContent";

// Sheet Header component
export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${sheetVariants.header.base} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SheetHeader.displayName = "SheetHeader";

// Sheet Title component
export const SheetTitle = forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className = "", children, ...props }, ref) => {
    const { titleId } = useSheetContext();

    return (
      <h2
        ref={ref}
        id={titleId}
        className={`${sheetVariants.title.base} ${className}`}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

SheetTitle.displayName = "SheetTitle";

// Sheet Description component
export const SheetDescription = forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  ({ className = "", children, ...props }, ref) => {
    const { descriptionId } = useSheetContext();

    return (
      <p
        ref={ref}
        id={descriptionId}
        className={`${sheetVariants.description.base} ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

SheetDescription.displayName = "SheetDescription";

// Sheet Body component
export const SheetBody = forwardRef<HTMLDivElement, SheetBodyProps>(
  ({ scrollable = true, className = "", children, ...props }, ref) => {
    const bodyClasses = [
      sheetVariants.body.base,
      scrollable && sheetVariants.body.scrollable,
      className
    ].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={bodyClasses} {...props}>
        {children}
      </div>
    );
  }
);

SheetBody.displayName = "SheetBody";

// Sheet Footer component
export const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${sheetVariants.footer.base} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SheetFooter.displayName = "SheetFooter";

// Sheet Close component
export const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(
  (
    {
      asChild = false,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { closeSheet } = useSheetContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      closeSheet();
      onClick?.(event);
    };

    if (asChild) {
      console.warn("asChild prop not fully implemented in this example");
    }

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SheetClose.displayName = "SheetClose";

// Compound component interface
interface SheetComponent extends React.ForwardRefExoticComponent<SheetProps & React.RefAttributes<HTMLDivElement>> {
  Trigger: typeof SheetTrigger;
  Content: typeof SheetContent;
  Header: typeof SheetHeader;
  Title: typeof SheetTitle;
  Description: typeof SheetDescription;
  Body: typeof SheetBody;
  Footer: typeof SheetFooter;
  Close: typeof SheetClose;
}

// Compound component pattern - attach sub-components to main Sheet
const SheetWithSubComponents = SheetRoot as SheetComponent;
SheetWithSubComponents.Trigger = SheetTrigger;
SheetWithSubComponents.Content = SheetContent;
SheetWithSubComponents.Header = SheetHeader;
SheetWithSubComponents.Title = SheetTitle;
SheetWithSubComponents.Description = SheetDescription;
SheetWithSubComponents.Body = SheetBody;
SheetWithSubComponents.Footer = SheetFooter;
SheetWithSubComponents.Close = SheetClose;

export { SheetWithSubComponents as Sheet };

// Export types for external use
export type {
  SheetProps,
  SheetTriggerProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetTitleProps,
  SheetDescriptionProps,
  SheetBodyProps,
  SheetFooterProps,
  SheetCloseProps,
  SheetVariants
};