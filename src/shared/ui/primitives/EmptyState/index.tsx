import { forwardRef, createContext, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// EmptyState variant configurations based on modern 2025 patterns
interface EmptyStateVariants {
  size: "sm" | "md" | "lg" | "xl";
  variant: "default" | "minimal" | "illustrated" | "onboarding" | "error";
  layout: "vertical" | "horizontal";
}

// EmptyState props interface
interface EmptyStateProps extends ComponentPropsWithoutRef<"div"> {
  size?: EmptyStateVariants["size"];
  variant?: EmptyStateVariants["variant"];
  layout?: EmptyStateVariants["layout"];
  title?: string;
  description?: string;
  icon?: ReactNode;
  illustration?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

// EmptyState icon props
interface EmptyStateIconProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// EmptyState illustration props
interface EmptyStateIllustrationProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  alt?: string;
}

// EmptyState title props
interface EmptyStateTitleProps extends ComponentPropsWithoutRef<"h3"> {
  children: ReactNode;
}

// EmptyState description props
interface EmptyStateDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
}

// EmptyState actions props
interface EmptyStateActionsProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  orientation?: "horizontal" | "vertical";
}

// EmptyState context value
interface EmptyStateContextValue {
  size: EmptyStateVariants["size"];
  variant: EmptyStateVariants["variant"];
  layout: EmptyStateVariants["layout"];
}

const EmptyStateContext = createContext<EmptyStateContextValue | null>(null);

// Hook to access empty state context
export const useEmptyStateContext = () => {
  const context = useContext(EmptyStateContext);
  return context; // Can be null for standalone usage
};

// Semantic class configurations using design tokens
const emptyStateVariants = {
  container: {
    base: "flex items-center justify-center text-center",

    layouts: {
      vertical: "flex-col",
      horizontal: "flex-row gap-6 text-left"
    },

    sizes: {
      sm: "p-4 gap-3",
      md: "p-6 gap-4",
      lg: "p-8 gap-6",
      xl: "p-12 gap-8"
    },

    variants: {
      default: "bg-transparent",
      minimal: "bg-transparent",
      illustrated: "bg-muted/20 rounded-lg border border-dashed border-border",
      onboarding: "bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10",
      error: "bg-error/5 rounded-lg border border-error/20"
    }
  },

  content: {
    base: "flex flex-col items-center justify-center",

    layouts: {
      vertical: "items-center text-center",
      horizontal: "items-start text-left flex-1"
    },

    sizes: {
      sm: "gap-2 max-w-xs",
      md: "gap-3 max-w-sm",
      lg: "gap-4 max-w-md",
      xl: "gap-6 max-w-lg"
    }
  },

  icon: {
    base: "flex items-center justify-center shrink-0",

    sizes: {
      sm: "w-12 h-12 text-2xl",
      md: "w-16 h-16 text-3xl",
      lg: "w-20 h-20 text-4xl",
      xl: "w-24 h-24 text-5xl"
    },

    variants: {
      default: "text-muted-foreground",
      minimal: "text-muted-foreground",
      illustrated: "text-primary",
      onboarding: "text-primary",
      error: "text-error"
    }
  },

  illustration: {
    base: "flex items-center justify-center shrink-0",

    sizes: {
      sm: "w-24 h-24",
      md: "w-32 h-32",
      lg: "w-40 h-40",
      xl: "w-48 h-48"
    }
  },

  title: {
    base: "font-semibold tracking-tight",

    sizes: {
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl"
    },

    variants: {
      default: "text-fg",
      minimal: "text-fg",
      illustrated: "text-fg",
      onboarding: "text-fg",
      error: "text-error"
    }
  },

  description: {
    base: "text-on-muted leading-relaxed",

    sizes: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg"
    }
  },

  actions: {
    base: "flex gap-2",

    orientations: {
      horizontal: "flex-row flex-wrap justify-center",
      vertical: "flex-col items-stretch"
    },

    layouts: {
      vertical: "justify-center",
      horizontal: "justify-start"
    }
  }
};

// Built-in empty state icons
const EmptyStateIcons = {
  default: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  search: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  document: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  inbox: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 4.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
    </svg>
  ),
  error: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  folder: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  users: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  star: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
};

// Main EmptyState component
const EmptyStateRoot = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      size = "md",
      variant = "default",
      layout = "vertical",
      title,
      description,
      icon,
      illustration,
      actions,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const contextValue: EmptyStateContextValue = {
      size,
      variant,
      layout
    };

    // Build container classes
    const containerClasses = [
      emptyStateVariants.container.base,
      emptyStateVariants.container.layouts[layout],
      emptyStateVariants.container.sizes[size],
      emptyStateVariants.container.variants[variant],
      className
    ].filter(Boolean).join(" ");

    // Build content classes
    const contentClasses = [
      emptyStateVariants.content.base,
      emptyStateVariants.content.layouts[layout],
      emptyStateVariants.content.sizes[size]
    ].filter(Boolean).join(" ");

    return (
      <EmptyStateContext.Provider value={contextValue}>
        <div ref={ref} className={containerClasses} {...props}>
          {/* Illustration or Icon */}
          {layout === "horizontal" && (illustration || icon) && (
            <div className="shrink-0">
              {illustration && (
                <EmptyStateIllustration>{illustration}</EmptyStateIllustration>
              )}
              {!illustration && icon && (
                <EmptyStateIcon>{icon}</EmptyStateIcon>
              )}
            </div>
          )}

          {/* Content */}
          <div className={contentClasses}>
            {/* Illustration or Icon for vertical layout */}
            {layout === "vertical" && (illustration || icon) && (
              <>
                {illustration && (
                  <EmptyStateIllustration>{illustration}</EmptyStateIllustration>
                )}
                {!illustration && icon && (
                  <EmptyStateIcon>{icon}</EmptyStateIcon>
                )}
              </>
            )}

            {/* Title */}
            {title && <EmptyStateTitle>{title}</EmptyStateTitle>}

            {/* Description */}
            {description && <EmptyStateDescription>{description}</EmptyStateDescription>}

            {/* Actions */}
            {actions && <EmptyStateActions>{actions}</EmptyStateActions>}

            {/* Custom children */}
            {children}
          </div>
        </div>
      </EmptyStateContext.Provider>
    );
  }
);

EmptyStateRoot.displayName = "EmptyState";

// EmptyState Icon component
export const EmptyStateIcon = forwardRef<HTMLDivElement, EmptyStateIconProps>(
  ({ className = "", children, ...props }, ref) => {
    const context = useEmptyStateContext();
    const size = context?.size || "md";
    const variant = context?.variant || "default";

    const iconClasses = [
      emptyStateVariants.icon.base,
      emptyStateVariants.icon.sizes[size],
      emptyStateVariants.icon.variants[variant],
      className
    ].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={iconClasses} {...props}>
        {children}
      </div>
    );
  }
);

EmptyStateIcon.displayName = "EmptyStateIcon";

// EmptyState Illustration component
export const EmptyStateIllustration = forwardRef<HTMLDivElement, EmptyStateIllustrationProps>(
  ({ alt = "", className = "", children, ...props }, ref) => {
    const context = useEmptyStateContext();
    const size = context?.size || "md";

    const illustrationClasses = [
      emptyStateVariants.illustration.base,
      emptyStateVariants.illustration.sizes[size],
      className
    ].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={illustrationClasses} role="img" aria-label={alt} {...props}>
        {children}
      </div>
    );
  }
);

EmptyStateIllustration.displayName = "EmptyStateIllustration";

// EmptyState Title component
export const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  ({ className = "", children, ...props }, ref) => {
    const context = useEmptyStateContext();
    const size = context?.size || "md";
    const variant = context?.variant || "default";

    const titleClasses = [
      emptyStateVariants.title.base,
      emptyStateVariants.title.sizes[size],
      emptyStateVariants.title.variants[variant],
      className
    ].filter(Boolean).join(" ");

    return (
      <h3 ref={ref} className={titleClasses} {...props}>
        {children}
      </h3>
    );
  }
);

EmptyStateTitle.displayName = "EmptyStateTitle";

// EmptyState Description component
export const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  ({ className = "", children, ...props }, ref) => {
    const context = useEmptyStateContext();
    const size = context?.size || "md";

    const descriptionClasses = [
      emptyStateVariants.description.base,
      emptyStateVariants.description.sizes[size],
      className
    ].filter(Boolean).join(" ");

    return (
      <p ref={ref} className={descriptionClasses} {...props}>
        {children}
      </p>
    );
  }
);

EmptyStateDescription.displayName = "EmptyStateDescription";

// EmptyState Actions component
export const EmptyStateActions = forwardRef<HTMLDivElement, EmptyStateActionsProps>(
  ({ orientation = "horizontal", className = "", children, ...props }, ref) => {
    const context = useEmptyStateContext();
    const layout = context?.layout || "vertical";

    const actionsClasses = [
      emptyStateVariants.actions.base,
      emptyStateVariants.actions.orientations[orientation],
      emptyStateVariants.actions.layouts[layout],
      className
    ].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={actionsClasses} {...props}>
        {children}
      </div>
    );
  }
);

EmptyStateActions.displayName = "EmptyStateActions";

// Compound component interface
interface EmptyStateComponent extends React.ForwardRefExoticComponent<EmptyStateProps & React.RefAttributes<HTMLDivElement>> {
  Icon: typeof EmptyStateIcon;
  Illustration: typeof EmptyStateIllustration;
  Title: typeof EmptyStateTitle;
  Description: typeof EmptyStateDescription;
  Actions: typeof EmptyStateActions;
  Icons: typeof EmptyStateIcons;
}

// Compound component pattern - attach sub-components to main EmptyState
const EmptyStateWithSubComponents = EmptyStateRoot as EmptyStateComponent;
EmptyStateWithSubComponents.Icon = EmptyStateIcon;
EmptyStateWithSubComponents.Illustration = EmptyStateIllustration;
EmptyStateWithSubComponents.Title = EmptyStateTitle;
EmptyStateWithSubComponents.Description = EmptyStateDescription;
EmptyStateWithSubComponents.Actions = EmptyStateActions;
EmptyStateWithSubComponents.Icons = EmptyStateIcons;

export { EmptyStateWithSubComponents as EmptyState };

// Export types for external use
export type {
  EmptyStateProps,
  EmptyStateIconProps,
  EmptyStateIllustrationProps,
  EmptyStateTitleProps,
  EmptyStateDescriptionProps,
  EmptyStateActionsProps,
  EmptyStateVariants
};