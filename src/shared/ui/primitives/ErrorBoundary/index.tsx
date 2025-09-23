"use client"

import * as React from "react"

/**
 * Error boundary fallback can be a React node or a render function
 * that receives error and reset function
 */
type ErrorBoundaryFallback =
  | React.ReactNode
  | ((args: { error: Error | null; reset: () => void }) => React.ReactNode);

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to render when no error occurs */
  children: React.ReactNode;
  /** Fallback UI to show when an error occurs */
  fallback?: ErrorBoundaryFallback;
  /** Callback invoked when an error is caught - used for telemetry */
  onError?: (error: Error, info: { componentStack: string | undefined }) => void;
  /** Array of dependencies that will reset the error state when changed */
  resetKeys?: ReadonlyArray<unknown>;
}

/**
 * Internal state for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the entire app.
 *
 * Features:
 * - Catches render and lifecycle errors in child components
 * - Supports both ReactNode and render prop fallbacks
 * - Optional error reporting callback for telemetry
 * - Automatic reset when resetKeys dependencies change
 * - Manual reset capability through fallback function
 *
 * @example
 * ```tsx
 * // With ReactNode fallback
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With render prop fallback and telemetry
 * <ErrorBoundary
 *   fallback={({ error, reset }) => (
 *     <div>
 *       <h2>Error: {error?.message}</h2>
 *       <button onClick={reset}>Try Again</button>
 *     </div>
 *   )}
 *   onError={(error, info) => trackError('component_error', { error })}
 *   resetKeys={[userId, selectedItem]}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static displayName = 'ErrorBoundary';

  /**
   * Update state to indicate an error has occurred
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Handle the error and call onError callback if provided
   * Note: This method does NOT use console.* for logging - that's handled by the onError callback
   */
  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, { componentStack: errorInfo.componentStack || undefined });
    }
  }

  /**
   * Reset error state when resetKeys change (shallow comparison)
   */
  override componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { resetKeys: prevResetKeys } = prevProps;

    if (this.state.hasError && resetKeys && prevResetKeys) {
      // Shallow comparison of resetKeys array
      if (
        resetKeys.length !== prevResetKeys.length ||
        resetKeys.some((key, index) => key !== prevResetKeys[index])
      ) {
        this.reset();
      }
    }
  }

  /**
   * Reset the error boundary state manually
   */
  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): React.ReactNode {
    if (this.state.hasError) {
      const { fallback } = this.props;

      if (typeof fallback === 'function') {
        return fallback({ error: this.state.error, reset: this.reset });
      }

      if (fallback !== undefined) {
        return fallback;
      }

      // No fallback provided - return null instead of throwing
      return null;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export type { ErrorBoundaryProps, ErrorBoundaryFallback };