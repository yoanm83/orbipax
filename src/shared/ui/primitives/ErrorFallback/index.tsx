"use client"

import * as React from "react"
import { Alert, AlertTitle, AlertDescription } from "../Alert"
import { Button } from "../Button"
import { cn } from "@/lib/utils"

/**
 * Props for the ErrorFallback component
 */
interface ErrorFallbackProps {
  /** Title text or React node for the error message */
  title?: React.ReactNode;
  /** Description text or React node providing additional context */
  description?: React.ReactNode;
  /** Callback when retry button is clicked - typically bound to ErrorBoundary reset */
  onRetry?: () => void;
  /** Label for the retry button */
  retryLabel?: string;
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Label for the back button */
  backLabel?: string;
  /** URL for back navigation (alternative to onBack callback) */
  backHref?: string;
  /** Focus management strategy */
  focus?: 'title' | 'retry' | 'auto';
  /** Additional CSS classes for styling composition */
  className?: string;
}

/**
 * ErrorFallback provides an accessible UI for displaying error states with
 * proper focus management, ARIA attributes, and recovery actions.
 *
 * Features:
 * - WCAG 2.2 AA compliant with proper roles and focus management
 * - Keyboard accessible with proper tab order
 * - Integrates with existing design system tokens
 * - Flexible action buttons (retry, back navigation)
 * - No PII logging or telemetry - purely presentational
 *
 * @example
 * ```tsx
 * // Basic usage with retry action
 * <ErrorFallback
 *   title="Something went wrong"
 *   description="There was an unexpected error. Please try again."
 *   onRetry={() => resetErrorBoundary()}
 *   focus="auto"
 * />
 *
 * // With back navigation
 * <ErrorFallback
 *   title="Page not found"
 *   description="The page you're looking for doesn't exist."
 *   backHref="/dashboard"
 *   backLabel="Return to Dashboard"
 *   focus="title"
 * />
 * ```
 */
const ErrorFallback = React.forwardRef<HTMLDivElement, ErrorFallbackProps>(({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or go back.",
  onRetry,
  retryLabel = "Try again",
  onBack,
  backLabel = "Back",
  backHref,
  focus = 'auto',
  className,
  ...props
}, ref) => {
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const retryRef = React.useRef<HTMLButtonElement>(null);
  const backButtonRef = React.useRef<HTMLButtonElement>(null);
  const backLinkRef = React.useRef<HTMLAnchorElement>(null);

  // Focus management effect
  React.useEffect(() => {
    const focusTarget = (() => {
      switch (focus) {
        case 'title':
          return titleRef.current;
        case 'retry':
          return onRetry ? retryRef.current : null;
        case 'auto':
        default:
          // Auto focus priority: retry button → title → back button
          if (onRetry && retryRef.current) return retryRef.current;
          if (titleRef.current) return titleRef.current;
          if (onBack && backButtonRef.current) return backButtonRef.current;
          if (backHref && backLinkRef.current) return backLinkRef.current;
          return null;
      }
    })();

    if (focusTarget) {
      // Small delay to ensure component is fully mounted
      const timeoutId = setTimeout(() => {
        focusTarget.focus();
      }, 100);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [focus, onRetry, onBack, backHref]);

  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center min-h-64 p-4", className)}
      {...props}
    >
      <div className="w-full max-w-md space-y-4">
        <Alert
          variant="destructive"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
        >
          <AlertTitle
            ref={titleRef}
            id={titleId}
            tabIndex={focus === 'title' ? 0 : -1}
            className="text-lg font-semibold"
          >
            {title}
          </AlertTitle>
          {description && (
            <AlertDescription
              id={descriptionId}
              className="mt-2 text-sm leading-relaxed"
            >
              {description}
            </AlertDescription>
          )}
        </Alert>

        {/* Action buttons */}
        {(onRetry || onBack || backHref) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                ref={retryRef}
                onClick={onRetry}
                variant="default"
                size="default"
                className="w-full sm:w-auto"
                aria-describedby={description ? descriptionId : undefined}
              >
                {retryLabel}
              </Button>
            )}

            {(onBack || backHref) && (
              <>
                {backHref ? (
                  <Button
                    ref={backLinkRef}
                    asChild
                    variant="outline"
                    size="default"
                    className="w-full sm:w-auto"
                  >
                    <a href={backHref} aria-describedby={description ? descriptionId : undefined}>
                      {backLabel}
                    </a>
                  </Button>
                ) : (
                  <Button
                    ref={backButtonRef}
                    onClick={onBack}
                    variant="outline"
                    size="default"
                    className="w-full sm:w-auto"
                    aria-describedby={description ? descriptionId : undefined}
                  >
                    {backLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ErrorFallback.displayName = "ErrorFallback";

export { ErrorFallback };
export type { ErrorFallbackProps };