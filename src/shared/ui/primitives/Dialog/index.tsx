import { forwardRef, createContext, useContext, useState, useCallback, useId, useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode, KeyboardEvent, MouseEvent } from "react";
import { createPortal } from "react-dom";

// Dialog variant configurations based on modern 2025 patterns
interface DialogVariants {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  variant: "default" | "destructive" | "success" | "warning";
}

// Dialog props interface
interface DialogProps extends Omit<ComponentPropsWithoutRef<"div">, "onClose"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children: ReactNode;
}

// Dialog trigger props
interface DialogTriggerProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children: ReactNode;
}

// Dialog content props
interface DialogContentProps extends ComponentPropsWithoutRef<"div"> {
  size?: DialogVariants["size"];
  variant?: DialogVariants["variant"];
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  children: ReactNode;
}

// Dialog overlay props
interface DialogOverlayProps extends ComponentPropsWithoutRef<"div"> {}

// Dialog header props
interface DialogHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Dialog title props
interface DialogTitleProps extends ComponentPropsWithoutRef<"h2"> {
  children: ReactNode;
}

// Dialog description props
interface DialogDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
}

// Dialog footer props
interface DialogFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Dialog close props
interface DialogCloseProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children?: ReactNode;
}

// Dialog context value
interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  titleId: string;
  descriptionId: string;
  modal: boolean;
}

const DialogContext = createContext<DialogContextValue | null>(null);

// Hook to access dialog context
export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a Dialog component");
  }
  return context;
};

// Focus trap utilities
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ];

  return Array.from(container.querySelectorAll(selectors.join(', ')));
};

const useFocusTrap = (enabled: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!enabled || !containerRef.current) { return; }

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);

    if (focusableElements.length === 0) { return; }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstElement.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') { return; }

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey as any);

    return () => {
      container.removeEventListener('keydown', handleTabKey as any);
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
const dialogVariants = {
  overlay: {
    base: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
  },

  content: {
    base: "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] border border-border bg-card shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",

    sizes: {
      xs: "max-w-xs w-full max-h-[90vh] overflow-y-auto",
      sm: "max-w-sm w-full max-h-[90vh] overflow-y-auto",
      md: "max-w-md w-full max-h-[90vh] overflow-y-auto",
      lg: "max-w-lg w-full max-h-[90vh] overflow-y-auto",
      xl: "max-w-xl w-full max-h-[90vh] overflow-y-auto",
      full: "w-[95vw] h-[95vh] max-w-none max-h-none overflow-y-auto"
    },

    variants: {
      default: "border-border",
      destructive: "border-error",
      success: "border-success",
      warning: "border-warning"
    }
  },

  header: {
    base: "flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-4"
  },

  title: {
    base: "text-lg font-semibold leading-none tracking-tight text-fg"
  },

  description: {
    base: "text-sm text-on-muted"
  },

  body: {
    base: "p-6 pt-0"
  },

  footer: {
    base: "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4"
  },

  closeButton: {
    base: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-card transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
    icon: "h-4 w-4"
  }
};

// Main Dialog component
const DialogRoot = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      modal = true,
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
    const titleId = useId();
    const descriptionId = useId();

    // Refs for managing focus
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle open state changes
    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    }, [isControlled, onOpenChange]);

    // Body scroll lock effect
    useEffect(() => {
      if (!open || !modal) { return; }

      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, [open, modal]);

    // Escape key handler
    useEffect(() => {
      if (!open) { return; }

      const handleEscape = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, handleOpenChange]);

    const contextValue: DialogContextValue = {
      open,
      setOpen: handleOpenChange,
      triggerRef,
      contentRef,
      titleId,
      descriptionId,
      modal
    };

    return (
      <DialogContext.Provider value={contextValue}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </DialogContext.Provider>
    );
  }
);

DialogRoot.displayName = "Dialog";

// Dialog Trigger component
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
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
    const { setOpen, triggerRef } = useDialogContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      onClick?.(event);
    };

    if (asChild) {
      // In a real implementation, you would clone the child element
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

DialogTrigger.displayName = "DialogTrigger";

// Dialog Overlay component
export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className = "", ...props }, ref) => {
    const { open } = useDialogContext();

    if (!open) { return null; }

    return (
      <Portal>
        <div
          ref={ref}
          className={`${dialogVariants.overlay.base} ${className}`}
          data-state={open ? "open" : "closed"}
          {...props}
        />
      </Portal>
    );
  }
);

DialogOverlay.displayName = "DialogOverlay";

// Dialog Content component
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      size = "md",
      variant = "default",
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEscapeKey = true,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, contentRef, titleId, descriptionId } = useDialogContext();

    // Focus trap
    useFocusTrap(open, contentRef);

    // Handle backdrop click
    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        setOpen(false);
      }
      onClick?.(event);
    };

    if (!open) { return null; }

    const contentClasses = [
      dialogVariants.content.base,
      dialogVariants.content.sizes[size],
      dialogVariants.content.variants[variant],
      className
    ].filter(Boolean).join(" ");

    return (
      <Portal>
        <div
          className={dialogVariants.overlay.base}
          data-state={open ? "open" : "closed"}
          onClick={handleBackdropClick}
        >
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
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={contentClasses}
            data-state={open ? "open" : "closed"}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {children}

            {showCloseButton && (
              <DialogClose className={dialogVariants.closeButton.base}>
                <svg className={dialogVariants.closeButton.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
          </div>
        </div>
      </Portal>
    );
  }
);

DialogContent.displayName = "DialogContent";

// Dialog Header component
export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${dialogVariants.header.base} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogHeader.displayName = "DialogHeader";

// Dialog Title component
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className = "", children, ...props }, ref) => {
    const { titleId } = useDialogContext();

    return (
      <h2
        ref={ref}
        id={titleId}
        className={`${dialogVariants.title.base} ${className}`}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

DialogTitle.displayName = "DialogTitle";

// Dialog Description component
export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className = "", children, ...props }, ref) => {
    const { descriptionId } = useDialogContext();

    return (
      <p
        ref={ref}
        id={descriptionId}
        className={`${dialogVariants.description.base} ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

DialogDescription.displayName = "DialogDescription";

// Dialog Body component
export const DialogBody = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${dialogVariants.body.base} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogBody.displayName = "DialogBody";

// Dialog Footer component
export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${dialogVariants.footer.base} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogFooter.displayName = "DialogFooter";

// Dialog Close component
export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
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
    const { setOpen, triggerRef } = useDialogContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setOpen(false);

      // Return focus to trigger
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 100);

      onClick?.(event);
    };

    if (asChild) {
      // In a real implementation, you would clone the child element
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

DialogClose.displayName = "DialogClose";

// Compound component interface
interface DialogComponent extends React.ForwardRefExoticComponent<DialogProps & React.RefAttributes<HTMLDivElement>> {
  Trigger: typeof DialogTrigger;
  Overlay: typeof DialogOverlay;
  Content: typeof DialogContent;
  Header: typeof DialogHeader;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
  Close: typeof DialogClose;
}

// Compound component pattern - attach sub-components to main Dialog
const DialogWithSubComponents = DialogRoot as DialogComponent;
DialogWithSubComponents.Trigger = DialogTrigger;
DialogWithSubComponents.Overlay = DialogOverlay;
DialogWithSubComponents.Content = DialogContent;
DialogWithSubComponents.Header = DialogHeader;
DialogWithSubComponents.Title = DialogTitle;
DialogWithSubComponents.Description = DialogDescription;
DialogWithSubComponents.Body = DialogBody;
DialogWithSubComponents.Footer = DialogFooter;
DialogWithSubComponents.Close = DialogClose;

export { DialogWithSubComponents as Dialog };

// Export types for external use
export type {
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogOverlayProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogCloseProps,
  DialogVariants
};