import { forwardRef, createContext, useContext, useState, useCallback, useId, useEffect } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Avatar variant configurations based on modern 2025 patterns
interface AvatarVariants {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant: "circular" | "rounded" | "square";
  status: "online" | "offline" | "busy" | "away" | "none";
}

// Avatar loading states
type AvatarLoadingStatus = "idle" | "loading" | "loaded" | "error";

// Avatar props interface
interface AvatarProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarVariants["size"];
  variant?: AvatarVariants["variant"];
  status?: AvatarVariants["status"];
  statusPosition?: "top-right" | "bottom-right" | "bottom-left" | "top-left";
  fallback?: ReactNode;
  fallbackSrc?: string;
  showFallback?: boolean;
  getInitials?: (name: string) => string;
  onLoadingStatusChange?: (status: AvatarLoadingStatus) => void;
  children?: ReactNode;
}

// Avatar group props
interface AvatarGroupProps extends ComponentPropsWithoutRef<"div"> {
  max?: number;
  total?: number;
  spacing?: "tight" | "normal" | "wide";
  children: ReactNode;
}

// Avatar context value
interface AvatarContextValue {
  size: AvatarVariants["size"];
  variant: AvatarVariants["variant"];
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

// Hook to access avatar context
export const useAvatarContext = () => {
  const context = useContext(AvatarContext);
  return context; // Can be null for standalone avatars
};

// Semantic class configurations using design tokens
const avatarVariants = {
  root: {
    base: "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-muted text-fg select-none",

    sizes: {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
      "2xl": "h-20 w-20 text-xl"
    },

    variants: {
      circular: "rounded-full",
      rounded: "rounded-md",
      square: "rounded-none"
    }
  },

  image: "h-full w-full object-cover",

  fallback: {
    base: "flex h-full w-full items-center justify-center bg-muted text-fg font-medium uppercase",
    icon: "h-1/2 w-1/2"
  },

  status: {
    base: "absolute block rounded-full border-2 border-bg",

    sizes: {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
      xl: "h-4 w-4",
      "2xl": "h-5 w-5"
    },

    positions: {
      "top-right": "top-0 right-0",
      "bottom-right": "bottom-0 right-0",
      "bottom-left": "bottom-0 left-0",
      "top-left": "top-0 left-0"
    },

    states: {
      online: "bg-success",
      offline: "bg-muted-foreground",
      busy: "bg-error",
      away: "bg-warning",
      none: ""
    }
  },

  group: {
    base: "flex items-center",

    spacings: {
      tight: "-space-x-1",
      normal: "-space-x-2",
      wide: "-space-x-1"
    },

    counter: "flex items-center justify-center bg-muted text-fg text-xs font-medium border-2 border-bg"
  }
};

// Helper function to generate initials from name
const getDefaultInitials = (name: string): string => {
  if (!name) {return "";}

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Helper function to generate deterministic color from name
const getAvatarColor = (name: string): string => {
  if (!name) {return "bg-muted";}

  const colors = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500"
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Main Avatar component
const AvatarRoot = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      variant = "circular",
      status = "none",
      statusPosition = "bottom-right",
      fallback,
      fallbackSrc,
      showFallback = true,
      getInitials = getDefaultInitials,
      onLoadingStatusChange,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // State for image loading
    const [loadingStatus, setLoadingStatus] = useState<AvatarLoadingStatus>("idle");
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
    const [hasImageError, setHasImageError] = useState(false);

    // Generate unique ID for accessibility
    const avatarId = useId();

    // Handle image loading status changes
    const handleLoadingStatusChange = useCallback((status: AvatarLoadingStatus) => {
      setLoadingStatus(status);
      onLoadingStatusChange?.(status);
    }, [onLoadingStatusChange]);

    // Handle image load
    const handleImageLoad = () => {
      setHasImageError(false);
      handleLoadingStatusChange("loaded");
    };

    // Handle image error
    const handleImageError = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        handleLoadingStatusChange("loading");
      } else {
        setHasImageError(true);
        handleLoadingStatusChange("error");
      }
    };

    // Update src when prop changes
    useEffect(() => {
      if (src !== currentSrc) {
        setCurrentSrc(src);
        setHasImageError(false);
        if (src) {
          handleLoadingStatusChange("loading");
        } else {
          handleLoadingStatusChange("idle");
        }
      }
    }, [src, currentSrc, handleLoadingStatusChange]);

    // Build root classes
    const rootClasses = [
      avatarVariants.root.base,
      avatarVariants.root.sizes[size],
      avatarVariants.root.variants[variant],
      className
    ].filter(Boolean).join(" ");

    // Determine what to show
    const shouldShowImage = currentSrc && !hasImageError;
    const shouldShowFallback = !shouldShowImage && showFallback;

    // Generate initials and color for fallback
    const initials = name ? getInitials(name) : "";
    const fallbackColor = name ? getAvatarColor(name) : "bg-muted";

    const contextValue: AvatarContextValue = {
      size,
      variant,
    };

    return (
      <AvatarContext.Provider value={contextValue}>
        <div
          ref={ref}
          id={avatarId}
          className={rootClasses}
          role="img"
          aria-label={alt || (name ? `Avatar for ${name}` : "User avatar")}
          {...props}
        >
          {/* Image */}
          {shouldShowImage && (
            <img
              src={currentSrc}
              alt={alt || name || "Avatar"}
              className={avatarVariants.image}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* Fallback */}
          {shouldShowFallback && (
            <div className={`${avatarVariants.fallback.base} ${fallbackColor}`}>
              {fallback ? (
                fallback
              ) : initials ? (
                <span className="text-white">{initials}</span>
              ) : (
                <svg
                  className={`${avatarVariants.fallback.icon} text-white`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
          )}

          {/* Status Indicator */}
          {status !== "none" && (
            <span
              className={[
                avatarVariants.status.base,
                avatarVariants.status.sizes[size],
                avatarVariants.status.positions[statusPosition],
                avatarVariants.status.states[status]
              ].join(" ")}
              aria-label={`Status: ${status}`}
            />
          )}

          {/* Custom children */}
          {children}
        </div>
      </AvatarContext.Provider>
    );
  }
);

AvatarRoot.displayName = "Avatar";

// Avatar Group component
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      max = 3,
      total,
      spacing = "normal",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const childrenArray = Array.isArray(children) ? children : [children];
    const visibleChildren = childrenArray.slice(0, max);
    const surplus = total ? total - max : childrenArray.length - max;
    const showCounter = surplus > 0;

    const groupClasses = [
      avatarVariants.group.base,
      avatarVariants.group.spacings[spacing],
      className
    ].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={groupClasses} {...props}>
        {visibleChildren}

        {showCounter && (
          <div
            className={[
              avatarVariants.root.base,
              avatarVariants.root.sizes.md, // Default size for counter
              avatarVariants.root.variants.circular,
              avatarVariants.group.counter
            ].join(" ")}
            aria-label={`${surplus} more users`}
          >
            +{surplus}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

// Compound component interface
interface AvatarComponent extends React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>> {
  Group: typeof AvatarGroup;
}

// Compound component pattern - attach sub-components to main Avatar
const AvatarWithSubComponents = AvatarRoot as AvatarComponent;
AvatarWithSubComponents.Group = AvatarGroup;

export { AvatarWithSubComponents as Avatar };

// Export types for external use
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarVariants,
  AvatarLoadingStatus
};