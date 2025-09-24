import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Card variant configurations based on modern 2025 patterns
interface CardVariants {
  variant: "default" | "outlined" | "elevated" | "filled";
  size: "sm" | "md" | "lg";
  padding: "none" | "sm" | "md" | "lg";
}

// Modern Card props interface extending HTML div attributes
interface CardProps extends ComponentPropsWithoutRef<"div"> {
  variant?: CardVariants["variant"];
  size?: CardVariants["size"];
  padding?: CardVariants["padding"];
  interactive?: boolean;
  children: ReactNode;
}

// Card Header props
interface CardHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Card Body props
interface CardBodyProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Card Footer props
interface CardFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Semantic class configurations using design tokens
const cardVariants = {
  base: "rounded-md transition-all duration-200",

  variants: {
    default: "bg-card border border-border",
    outlined: "bg-card border-2 border-border",
    elevated: "bg-card shadow-lg border border-border",
    filled: "bg-muted border border-border"
  },

  interactive: {
    default: "hover:shadow-md hover:border-ring cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]",
    outlined: "hover:shadow-md hover:border-ring cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]",
    elevated: "hover:shadow-xl hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]",
    filled: "hover:shadow-md hover:bg-muted/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]"
  },

  sizes: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg"
  },

  padding: {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  }
};

// Card Header styling using semantic tokens
const cardHeaderVariants = {
  base: "border-b border-border",
  padding: {
    none: "p-0",
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4"
  }
};

// Card Body styling
const cardBodyVariants = {
  base: "flex-1 text-fg",
  padding: {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  }
};

// Card Footer styling using semantic tokens
const cardFooterVariants = {
  base: "border-t border-border",
  padding: {
    none: "p-0",
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4"
  }
};

// Main Card component
const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      size,
      padding = "md",
      interactive = false,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Build card classes
    const baseClasses = cardVariants.base;
    const variantClasses = cardVariants.variants[variant];
    const interactiveClasses = interactive || onClick ? cardVariants.interactive[variant] : "";
    const sizeClasses = size ? cardVariants.sizes[size] : "";
    const paddingClasses = cardVariants.padding[padding];

    const cardClasses = [
      baseClasses,
      variantClasses,
      interactiveClasses,
      sizeClasses,
      paddingClasses,
      className
    ].filter(Boolean).join(" ");

    if (interactive || onClick) {
      return (
        <button
          ref={ref as unknown as React.ForwardedRef<HTMLButtonElement>}
          className={cardClasses}
          onClick={onClick}
          tabIndex={0}
          {...(props as ComponentPropsWithoutRef<"button">)}
        >
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardRoot.displayName = "Card";

// Card Header component
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const headerClasses = [
      cardHeaderVariants.base,
      cardHeaderVariants.padding.md,
      className
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={headerClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Body component
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const bodyClasses = [
      cardBodyVariants.base,
      cardBodyVariants.padding.md,
      className
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={bodyClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

// Card Footer component
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const footerClasses = [
      cardFooterVariants.base,
      cardFooterVariants.padding.md,
      className
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={footerClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

// Compound component interface
interface CardComponent extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
}

// Compound component pattern - attach sub-components to main Card
const CardWithSubComponents = CardRoot as CardComponent;
CardWithSubComponents.Header = CardHeader;
CardWithSubComponents.Body = CardBody;
CardWithSubComponents.Footer = CardFooter;

export { CardWithSubComponents as Card };

// Export types for external use
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardVariants };