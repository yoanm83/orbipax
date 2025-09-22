import { forwardRef, createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Toast variant configurations based on modern 2025 patterns
interface ToastVariants {
  variant: "default" | "success" | "warning" | "error" | "info";
  position: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  duration: number | "persistent";
}

// Toast data interface
interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariants["variant"];
  duration: ToastVariants["duration"];
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

// Toast component props
interface ToastProps extends ComponentPropsWithoutRef<"div"> {
  toast: ToastData;
  onRemove: (id: string) => void;
}

// Toast provider props
interface ToastProviderProps {
  children: ReactNode;
  position?: ToastVariants["position"];
  duration?: ToastVariants["duration"];
  maxToasts?: number;
}

// Toast context value
interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Hook to access toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  // Helper functions for different toast types
  const toast = useCallback((data: Omit<ToastData, "id" | "variant"> & { variant?: ToastVariants["variant"] }) => {
    return context.addToast({
      variant: "default",
      ...data,
    });
  }, [context]);

  const success = useCallback((title: string, description?: string) => {
    return context.addToast({
      title,
      ...(description !== undefined && { description }),
      variant: "success",
      duration: 5000,
    });
  }, [context]);

  const error = useCallback((title: string, description?: string) => {
    return context.addToast({
      title,
      ...(description !== undefined && { description }),
      variant: "error",
      duration: 7000,
    });
  }, [context]);

  const warning = useCallback((title: string, description?: string) => {
    return context.addToast({
      title,
      ...(description !== undefined && { description }),
      variant: "warning",
      duration: 6000,
    });
  }, [context]);

  const info = useCallback((title: string, description?: string) => {
    return context.addToast({
      title,
      ...(description !== undefined && { description }),
      variant: "info",
      duration: 5000,
    });
  }, [context]);

  const promise = useCallback(async <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    const loadingToastId = context.addToast({
      title: options.loading,
      variant: "info",
      duration: "persistent",
    });

    try {
      const result = await promise;
      context.removeToast(loadingToastId);

      const successMessage = typeof options.success === "function"
        ? options.success(result)
        : options.success;

      context.addToast({
        title: successMessage,
        variant: "success",
        duration: 5000,
      });

      return result;
    } catch (err) {
      context.removeToast(loadingToastId);

      const errorMessage = typeof options.error === "function"
        ? options.error(err as Error)
        : options.error;

      context.addToast({
        title: errorMessage,
        variant: "error",
        duration: 7000,
      });

      throw err;
    }
  }, [context]);

  return {
    toasts: context.toasts,
    toast,
    success,
    error,
    warning,
    info,
    promise,
    dismiss: context.removeToast,
    clear: context.clearToasts,
  };
};

// Semantic class configurations using design tokens
const toastVariants = {
  base: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",

  variants: {
    default: "border-border bg-card text-fg",
    success: "border-success bg-success/10 text-success-foreground",
    warning: "border-warning bg-warning/10 text-warning-foreground",
    error: "border-error bg-error/10 text-error-foreground",
    info: "border-primary bg-primary/10 text-primary-foreground"
  },

  positions: {
    "top-left": "top-0 left-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-0 right-0"
  }
};

const toastTitleVariants = "text-sm font-semibold";
const toastDescriptionVariants = "text-sm opacity-90";
const toastActionVariants = "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-xs font-medium ring-offset-bg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
const toastCloseVariants = "absolute right-2 top-2 rounded-md p-1 text-fg/50 opacity-0 transition-opacity hover:text-fg focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100";

// Toast component
const ToastRoot = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      toast: toastData,
      onRemove,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      // Trigger entrance animation
      setIsVisible(true);

      // Auto-dismiss if duration is set
      if (typeof toastData.duration === "number") {
        const timer = setTimeout(() => {
          handleClose();
        }, toastData.duration);

        return () => clearTimeout(timer);
      }
      return undefined;
    }, [toastData.duration]);

    const handleClose = () => {
      setIsVisible(false);
      // Allow exit animation to complete before removing
      setTimeout(() => {
        onRemove(toastData.id);
        toastData.onClose?.();
      }, 150);
    };

    const toastClasses = [
      toastVariants.base,
      toastVariants.variants[toastData.variant],
      isVisible ? "data-[state=open]" : "data-[state=closed]",
      className
    ].filter(Boolean).join(" ");

    // Icon component based on variant
    const ToastIcon = () => {
      switch (toastData.variant) {
        case "success":
          return (
            <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case "error":
          return (
            <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
        case "warning":
          return (
            <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        case "info":
          return (
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={toastClasses}
        role={toastData.variant === "error" ? "alert" : "status"}
        aria-live={toastData.variant === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        {...props}
      >
        <div className="flex items-start space-x-3">
          <ToastIcon />
          <div className="flex-1 space-y-1">
            {toastData.title && (
              <div className={toastTitleVariants}>
                {toastData.title}
              </div>
            )}
            {toastData.description && (
              <div className={toastDescriptionVariants}>
                {toastData.description}
              </div>
            )}
          </div>
        </div>

        {toastData.action && (
          <button
            className={toastActionVariants}
            onClick={toastData.action.onClick}
          >
            {toastData.action.label}
          </button>
        )}

        <button
          className={toastCloseVariants}
          onClick={handleClose}
          aria-label="Close notification"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }
);

ToastRoot.displayName = "Toast";

// Toast Provider component
export const ToastProvider = ({
  children,
  position = "bottom-right",
  duration = 5000,
  maxToasts = 5,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toastData: Omit<ToastData, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = {
      id,
      ...toastData,
      duration: toastData.duration ?? duration,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Limit number of toasts
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [duration, maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };

  // Container positioning classes
  const containerClasses = [
    "fixed z-50 max-h-screen w-full p-4 pointer-events-none",
    "sm:max-w-sm",
    toastVariants.positions[position]
  ].join(" ");

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <div className={containerClasses}>
        <div className="flex flex-col space-y-2">
          {toasts.map((toast) => (
            <ToastRoot
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

// Individual Toast component for manual usage
export const Toast = ToastRoot;

// Export types for external use
export type {
  ToastData,
  ToastProps,
  ToastProviderProps,
  ToastVariants
};