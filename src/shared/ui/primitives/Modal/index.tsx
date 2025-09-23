import { forwardRef, createContext, useContext, useState, useCallback, useId, useEffect, useRef, useImperativeHandle } from "react";
import type { ComponentPropsWithoutRef, ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";

// Modal variant configurations based on modern 2025 patterns
interface ModalVariants {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "full" | "auto";
  variant: "default" | "centered" | "drawer" | "fullscreen" | "popup";
  backdrop: "blur" | "dark" | "light" | "transparent" | "none";
  animation: "fade" | "scale" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "none";
}

// Modal imperative API interface
interface ModalHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

// Modal props interface
interface ModalProps extends Omit<ComponentPropsWithoutRef<"div">, "onClose"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalVariants["size"];
  variant?: ModalVariants["variant"];
  backdrop?: ModalVariants["backdrop"];
  animation?: ModalVariants["animation"];
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  preventScrollLock?: boolean;
  returnFocus?: boolean;
  initialFocus?: string | HTMLElement | null;
  restoreFocus?: string | HTMLElement | null;
  trapFocus?: boolean;
  autoFocus?: boolean;
  persistent?: boolean;
  zIndex?: number;
  children: ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  onAnimationComplete?: (state: "open" | "closed") => void;
}

// Modal content props
interface ModalContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Modal header props
interface ModalHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  showCloseButton?: boolean;
}

// Modal body props
interface ModalBodyProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  scrollable?: boolean;
}

// Modal footer props
interface ModalFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  sticky?: boolean;
}

// Modal context value
interface ModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  size: ModalVariants["size"];
  variant: ModalVariants["variant"];
  backdrop: ModalVariants["backdrop"];
  animation: ModalVariants["animation"];
  modalId: string;
  closeModal: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

// Hook to access modal context
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a Modal component");
  }
  return context;
};

// Imperative Modal API hook
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<ModalHandle>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    modalRef.current?.open();
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    modalRef.current?.close();
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    modalRef
  };
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
const modalVariants = {
  backdrop: {
    base: "fixed inset-0 transition-all duration-300 ease-out",

    variants: {
      blur: "bg-black/50 backdrop-blur-sm",
      dark: "bg-black/75",
      light: "bg-white/75",
      transparent: "bg-transparent",
      none: "pointer-events-none"
    }
  },

  container: {
    base: "fixed inset-0 z-50 flex transition-all duration-300 ease-out",

    variants: {
      default: "items-center justify-center p-4",
      centered: "items-center justify-center p-4",
      drawer: "items-end justify-center",
      fullscreen: "items-stretch justify-stretch",
      popup: "items-start justify-center pt-16 p-4"
    }
  },

  content: {
    base: "relative w-full bg-card border border-border shadow-xl transition-all duration-300 ease-out",

    sizes: {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-full min-h-full",
      auto: "max-w-fit"
    },

    variants: {
      default: "rounded-lg max-h-[90vh] overflow-hidden",
      centered: "rounded-lg max-h-[90vh] overflow-hidden",
      drawer: "rounded-t-xl max-h-[80vh] overflow-hidden",
      fullscreen: "rounded-none h-full overflow-hidden",
      popup: "rounded-lg max-h-[70vh] overflow-hidden shadow-2xl"
    },

    animations: {
      fade: {
        enter: "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        exit: "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      },
      scale: {
        enter: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        exit: "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
      },
      "slide-up": {
        enter: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4",
        exit: "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-4"
      },
      "slide-down": {
        enter: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4",
        exit: "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4"
      },
      "slide-left": {
        enter: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-4",
        exit: "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-4"
      },
      "slide-right": {
        enter: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-4",
        exit: "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-4"
      },
      none: {
        enter: "",
        exit: ""
      }
    }
  },

  header: {
    base: "flex items-center justify-between p-6 pb-4 border-b border-border"
  },

  body: {
    base: "p-6",
    scrollable: "overflow-y-auto"
  },

  footer: {
    base: "flex items-center justify-end gap-2 p-6 pt-4 border-t border-border",
    sticky: "sticky bottom-0 bg-card"
  },

  closeButton: {
    base: "absolute top-4 right-4 z-10 inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-fg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
    icon: "h-4 w-4"
  }
};

// Main Modal component
const ModalRoot = forwardRef<ModalHandle, ModalProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      size = "md",
      variant = "default",
      backdrop = "blur",
      animation = "scale",
      closeOnBackdropClick = true,
      closeOnEscapeKey = true,
      preventScrollLock = false,
      returnFocus = true,
      initialFocus,
      restoreFocus,
      trapFocus = true,
      autoFocus = true,
      persistent = false,
      zIndex = 50,
      className = "",
      children,
      onClose,
      onOpen,
      onAnimationComplete,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [isAnimating, setIsAnimating] = useState(false);
    const [previousActiveElement, setPreviousActiveElement] = useState<HTMLElement | null>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Generate unique ID for accessibility
    const modalId = useId();

    // Refs for managing focus and content
    const contentRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

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
      }
    }, [isControlled, onOpenChange, onOpen, onClose, persistent, returnFocus]);

    // Close modal function
    const closeModal = useCallback(() => {
      handleOpenChange(false);
    }, [handleOpenChange]);

    // Imperative API
    useImperativeHandle(ref, () => ({
      open: () => handleOpenChange(true),
      close: () => handleOpenChange(false),
      toggle: () => handleOpenChange(!open),
      isOpen: () => open
    }), [handleOpenChange, open]);

    // Focus trap
    useFocusTrap(open && trapFocus, contentRef);

    // Body scroll lock effect
    useEffect(() => {
      if (!open || preventScrollLock) { return; }

      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, [open, preventScrollLock]);

    // Escape key handler
    useEffect(() => {
      if (!open || !closeOnEscapeKey) { return; }

      const handleEscape = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscapeKey, closeModal]);

    // Focus management
    useEffect(() => {
      if (!open) {
        // Restore focus when closing
        if (returnFocus && previousActiveElement) {
          setTimeout(() => {
            previousActiveElement.focus();
          }, 100);
        }
        return;
      }

      if (!autoFocus) { return; }

      setTimeout(() => {
        if (initialFocus) {
          if (typeof initialFocus === 'string') {
            const element = document.querySelector(initialFocus) as HTMLElement;
            element?.focus();
          } else {
            initialFocus.focus();
          }
        } else if (contentRef.current) {
          const focusableElements = getFocusableElements(contentRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            contentRef.current.focus();
          }
        }
      }, 100);
    }, [open, autoFocus, initialFocus]);

    // Animation complete handler
    useEffect(() => {
      if (isAnimating) {
        const timer = setTimeout(() => {
          setIsAnimating(false);
          onAnimationComplete?.(open ? "open" : "closed");
        }, 300); // Match animation duration

        return () => clearTimeout(timer);
      }
    }, [isAnimating, open, onAnimationComplete]);

    // Handle backdrop click
    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && event.target === event.currentTarget && !persistent) {
        closeModal();
      }
    };

    const contextValue: ModalContextValue = {
      open,
      setOpen: handleOpenChange,
      size,
      variant,
      backdrop,
      animation,
      modalId,
      closeModal,
      contentRef
    };

    if (!open) { return null; }

    const backdropClasses = [
      modalVariants.backdrop.base,
      modalVariants.backdrop.variants[backdrop]
    ].filter(Boolean).join(" ");

    const containerClasses = [
      modalVariants.container.base,
      modalVariants.container.variants[variant]
    ].filter(Boolean).join(" ");

    const contentClasses = [
      modalVariants.content.base,
      modalVariants.content.sizes[size],
      modalVariants.content.variants[variant],
      animation !== "none" && modalVariants.content.animations[animation].enter,
      animation !== "none" && modalVariants.content.animations[animation].exit,
      className
    ].filter(Boolean).join(" ");

    return (
      <ModalContext.Provider value={contextValue}>
        <Portal>
          <div
            className={containerClasses}
            style={{ zIndex }}
            data-state={open ? "open" : "closed"}
          >
            {/* Backdrop */}
            {backdrop !== "none" && (
              <div
                ref={backdropRef}
                className={backdropClasses}
                onClick={handleBackdropClick}
                data-state={open ? "open" : "closed"}
              />
            )}

            {/* Content */}
            <div
              ref={contentRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${modalId}-title`}
              aria-describedby={`${modalId}-description`}
              className={contentClasses}
              data-state={open ? "open" : "closed"}
              tabIndex={-1}
              {...props}
            >
              {children}
            </div>
          </div>
        </Portal>
      </ModalContext.Provider>
    );
  }
);

ModalRoot.displayName = "Modal";

// Modal Content component
export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`h-full flex flex-col ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

ModalContent.displayName = "ModalContent";

// Modal Header component
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ showCloseButton = true, className = "", children, ...props }, ref) => {
    const { closeModal, modalId } = useModalContext();

    return (
      <div
        ref={ref}
        className={`${modalVariants.header.base} ${className}`}
        {...props}
      >
        <div id={`${modalId}-title`} className="flex-1">
          {children}
        </div>

        {showCloseButton && (
          <button
            type="button"
            onClick={closeModal}
            className={modalVariants.closeButton.base}
            aria-label="Close modal"
          >
            <svg className={modalVariants.closeButton.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = "ModalHeader";

// Modal Body component
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ scrollable = true, className = "", children, ...props }, ref) => {
    const { modalId } = useModalContext();

    const bodyClasses = [
      modalVariants.body.base,
      scrollable && modalVariants.body.scrollable,
      className
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        id={`${modalId}-description`}
        className={bodyClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = "ModalBody";

// Modal Footer component
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ sticky = false, className = "", children, ...props }, ref) => {
    const footerClasses = [
      modalVariants.footer.base,
      sticky && modalVariants.footer.sticky,
      className
    ].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={footerClasses} {...props}>
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

// Modal Close Button component
export const ModalClose = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  ({ className = "", children, onClick, ...props }, ref) => {
    const { closeModal } = useModalContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      closeModal();
      onClick?.(event);
    };

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

ModalClose.displayName = "ModalClose";

// Compound component interface
interface ModalComponent extends React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<ModalHandle>> {
  Content: typeof ModalContent;
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
  Close: typeof ModalClose;
}

// Compound component pattern - attach sub-components to main Modal
const ModalWithSubComponents = ModalRoot as ModalComponent;
ModalWithSubComponents.Content = ModalContent;
ModalWithSubComponents.Header = ModalHeader;
ModalWithSubComponents.Body = ModalBody;
ModalWithSubComponents.Footer = ModalFooter;
ModalWithSubComponents.Close = ModalClose;

export { ModalWithSubComponents as Modal };

// Export types for external use
export type {
  ModalProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalVariants,
  ModalHandle
};